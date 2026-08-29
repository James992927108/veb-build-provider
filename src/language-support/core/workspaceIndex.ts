// src/language-support/core/workspaceIndex.ts
//
// Cross-file EDK2 symbol index, borrowed from the navigation ideas in
// intel-corporation.edk2code. It answers three questions that are impossible
// from a single file:
//   1. Where is this GUID / PCD / module declared?   (Go to Definition)
//   2. Where is this symbol referenced elsewhere?    (Find References)
//   3. What symbols exist for completion / lint?     (completion + lint rules)
//
// The index is deliberately decoupled from `vscode`: all parsing is done by
// pure functions (below) so they are unit-testable without the mock host.

import * as fs from 'fs';
import * as path from 'path';
import { Edk2Parser } from './edk2Parser';
import { logDebug, logError, handleError } from '../../shared/utils/logger';

export type Edk2SymbolKind = 'guid' | 'ppi' | 'protocol' | 'pcd' | 'module';

/** A symbol DECLARATION (definition) found in a .dec or .inf file. */
export interface Edk2SymbolDef {
  kind: Edk2SymbolKind;
  /** Canonical display name: `gEfiXxxGuid`, `PcdXxx`, or the module BaseName. */
  name: string;
  /** Present only for PCD definitions: the declaring `gXxxTokenSpaceGuid`. */
  tokenSpace?: string;
  /** Present only for PCD definitions: `"gXxxTokenSpaceGuid.PcdXxx"`. */
  qualifiedName?: string;
  filePath: string;
  /** 0-based line / column of the declaration. */
  line: number;
  column: number;
  /** ModuleType, present only for module definitions. */
  moduleType?: string;
}

/** A single occurrence of a searched key in an indexed file. */
export interface Edk2SymbolRef {
  key: string;
  filePath: string;
  line: number;
  column: number;
}

const EDK2_KEYWORDS = new Set([
  'defines', 'sources', 'packages', 'libraryclasses', 'protocols', 'ppis', 'guids',
  'components', 'includes', 'pcdsimple', 'binaries', 'featureflagpcd', 'pcdsfixedatbuild',
  'base_name', 'file_guid', 'module_type', 'inf_version', 'version_string', 'entry_point',
  'unload_image', 'supported_architectures', 'build_number', 'library_class', 'constructor',
  'destructor', 'private', 'archive', 'user_defined', 'dsc_specification', 'platform_name',
  'platform_guid', 'platform_version', 'fd_base_address', 'fd_size', 'flash_definition',
  'the', 'of', 'and', 'or', 'true', 'false', 'inf', 'define', 'set', 'file', 'fv', 'fd',
]);

export const SYMBOL_INDEX_EXCLUDED_DIRS = [
  'build', 'conf', '.git', 'node_modules', '.vscode', 'out', 'out-test', 'dist', 'temp',
];

// ---------------------------------------------------------------------------
// Pure parsing helpers (exported for unit tests)
// ---------------------------------------------------------------------------

/** Split a source line into [tokenSpace, pcdName] when it is a qualified PCD ref. */
export function parseQualifiedPcd(text: string): { tokenSpace: string; pcdName: string } | null {
  const m = text.match(/\b(g[A-Za-z0-9_]+)\.([A-Za-z0-9_]+)\b/);
  if (!m) {
    return null;
  }
  return { tokenSpace: m[1], pcdName: m[2] };
}

/**
 * Parse the symbol declarations of one .dec file:
 * `[Guids] / [Ppis] / [Protocols]` -> `gName = { 0x.. }` entries,
 * `[Pcds*]` -> `gTokenSpace.PcdName|default|type|token` entries.
 */
export function parseDecDefinitions(content: string, filePath: string): Edk2SymbolDef[] {
  const defs: Edk2SymbolDef[] = [];
  const lines = content.split(/\r?\n/);
  let section: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const clean = Edk2Parser.removeHashTagComment(lines[i]);
    if (clean.length === 0) {
      continue;
    }

    const header = clean.match(/^\[([A-Za-z0-9_.]+)\]\s*$/);
    if (header) {
      section = header[1].toLowerCase();
      continue;
    }

    if (!section) {
      continue;
    }

    if (section === 'guids' || section === 'ppis' || section === 'protocols') {
      const decl = clean.match(/^(g[A-Za-z0-9_]+)\s*=/);
      if (decl) {
        const column = clean.indexOf(decl[1]);
        defs.push({
          kind: section === 'guids' ? 'guid' : section === 'ppis' ? 'ppi' : 'protocol',
          name: decl[1],
          filePath,
          line: i,
          column,
        });
      }
    } else if (section.startsWith('pcds')) {
      if (clean.charCodeAt(0) === 35 || clean.startsWith('##')) {
        continue; // comment line
      }
      const pcd = parseQualifiedPcd(clean);
      if (pcd) {
        defs.push({
          kind: 'pcd',
          name: pcd.pcdName,
          tokenSpace: pcd.tokenSpace,
          qualifiedName: `${pcd.tokenSpace}.${pcd.pcdName}`,
          filePath,
          line: i,
          column: clean.indexOf(`${pcd.tokenSpace}.${pcd.pcdName}`),
        });
      }
    }
  }
  return defs;
}

/**
 * Parse the module declarations of one .inf file: the `BASE_NAME` (and, when
 * present, `MODULE_TYPE`) under `[Defines]`.
 */
export function parseInfModuleDef(content: string, filePath: string): Edk2SymbolDef | null {
  const baseName = content.match(/^\s*BASE_NAME\s*=\s*([A-Za-z0-9_]+)\s*$/m);
  if (!baseName) {
    return null;
  }
  const moduleType = content.match(/^\s*MODULE_TYPE\s*=\s*([A-Za-z0-9_]+)\s*$/m);
  let line = 0;
  let column = 0;
  const lines = content.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^\s*BASE_NAME\s*=\s*(.+)$/)) {
      line = i;
      column = lines[i].indexOf(baseName[1]);
      break;
    }
  }
  return {
    kind: 'module',
    name: baseName[1],
    filePath,
    line,
    column,
    moduleType: moduleType ? moduleType[1] : undefined,
  };
}

/** Escape a string so it can be embedded in a RegExp literally. */
function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Find case-insensitive, word-boundary occurrences of any key in `content`,
 * returning their locations. Line-by-line so positions are exact and keys that
 * span lines can never match. Pure and shared by Find References.
 */
export function findAllOccurrences(content: string, keys: string[]): Edk2SymbolRef[] {
  const unique = Array.from(new Set(keys.filter((k) => k.length > 0)));
  if (unique.length === 0) {
    return [];
  }
  const re = new RegExp('\\b(?:' + unique.map(escapeRegExp).join('|') + ')\\b', 'gi');
  const refs: Edk2SymbolRef[] = [];
  const lines = content.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(lines[i])) !== null) {
      refs.push({ key: m[0].toLowerCase(), filePath: '', line: i, column: m.index });
    }
  }
  return refs;
}

// ---------------------------------------------------------------------------
// Workspace symbol index
// ---------------------------------------------------------------------------

export class WorkspaceIndex {
  private roots: string[] = [];
  private defsByKey = new Map<string, Edk2SymbolDef[]>();
  private defsByFile = new Map<string, Edk2SymbolDef[]>();
  private pcdNamesByTokenSpace = new Map<string, Set<string>>();
  private pcdsByTokenSpace = new Map<string, Edk2SymbolDef[]>();
  private tokenSpaces = new Set<string>();
  private files: string[] = [];
  private builtKey = '';
  private building: Promise<void> | null = null;

  constructor(roots?: string[]) {
    if (roots && roots.length > 0) {
      this.roots = roots;
    }
  }

  /** Async build the index for the configured root folders. Idempotent per root set. */
  async build(): Promise<void> {
    if (this.building) {
      return this.building;
    }
    const roots = this.roots.length > 0 ? this.roots : Edk2Parser.getRootPath();
    this.building = (async () => {
      const key = JSON.stringify(roots);
      if (this.builtKey === key) {
        return;
      }
      const files: string[] = [];
      for (const root of roots) {
        await this.collectFiles(root, files, 0);
      }
      this.files = files;
      this.defsByKey.clear();
      this.defsByFile.clear();
      this.pcdNamesByTokenSpace.clear();
      this.pcdsByTokenSpace.clear();
      this.tokenSpaces.clear();

      let defCount = 0;
      for (const file of files) {
        defCount += await this.indexFile(file);
      }
      this.builtKey = key;
      logDebug(`[WorkspaceIndex] built ${defCount} definitions from ${files.length} files (${roots.length} roots)`);
    })().catch((error) => {
      handleError(`Workspace symbol index build failed: ${error instanceof Error ? error.message : String(error)}`);
    }).finally(() => {
      this.building = null;
    });
    return this.building;
  }

  /** Ensure the index reflects the current root folders; returns when usable. */
  async ensureBuilt(): Promise<void> {
    if (this.files.length > 0) {
      return;
    }
    await this.build();
  }

  /** Parse + insert the definitions contributed by one file; returns count. */
  private async indexFile(filePath: string): Promise<number> {
    let content: string;
    try {
      content = await fs.promises.readFile(filePath, 'utf-8');
    } catch (error) {
      handleError(`Index read failed ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
      return 0;
    }
    const lower = filePath.toLowerCase();
    let count = 0;
    if (lower.endsWith('.dec')) {
      for (const def of parseDecDefinitions(content, filePath)) {
        this.insertDef(def);
        count++;
      }
    } else if (lower.endsWith('.inf')) {
      const def = parseInfModuleDef(content, filePath);
      if (def) {
        this.insertDef(def);
        count++;
      }
    }
    return count;
  }

  /** Drop every definition that was contributed by `filePath`. */
  private removeDefsFromFile(filePath: string): void {
    const prev = this.defsByFile.get(filePath);
    if (!prev) {
      return;
    }
    const removeFromBucket = (key: string, def: Edk2SymbolDef): void => {
      const bucket = this.defsByKey.get(key);
      if (!bucket) {
        return;
      }
      const idx = bucket.indexOf(def);
      if (idx >= 0) {
        bucket.splice(idx, 1);
      }
      if (bucket.length === 0) {
        this.defsByKey.delete(key);
      }
    };
    for (const def of prev) {
      const family = def.kind === 'guid' || def.kind === 'ppi' || def.kind === 'protocol' ? 'guid' : def.kind;
      removeFromBucket(`${family}::${def.name.toLowerCase()}`, def);
      if (def.kind === 'pcd' && def.qualifiedName) {
        removeFromBucket(`pcd::${def.qualifiedName.toLowerCase()}`, def);
      }
    }
    this.defsByFile.delete(filePath);
  }

  /** Re-derive token-space listing structures from the live definition map. */
  private rebuildPcdAuxiliaries(): void {
    this.pcdNamesByTokenSpace.clear();
    this.pcdsByTokenSpace.clear();
    this.tokenSpaces.clear();
    const seen = new Set<string>();
    for (const defs of this.defsByKey.values()) {
      for (const def of defs) {
        if (def.kind === 'pcd' && def.tokenSpace) {
          const ts = def.tokenSpace.toLowerCase();
          const uniq = `${ts}.${def.name.toLowerCase()}`;
          if (seen.has(uniq)) {
            continue;
          }
          seen.add(uniq);
          this.tokenSpaces.add(def.tokenSpace);
          let names = this.pcdNamesByTokenSpace.get(ts);
          if (!names) {
            names = new Set<string>();
            this.pcdNamesByTokenSpace.set(ts, names);
          }
          names.add(def.name.toLowerCase());
          let tsDefs = this.pcdsByTokenSpace.get(ts);
          if (!tsDefs) {
            tsDefs = [];
            this.pcdsByTokenSpace.set(ts, tsDefs);
          }
          tsDefs.push(def);
        }
      }
    }
  }

  /**
   * Incremental refresh for a single saved file - avoids a full re-scan of a
   * large tree on every save. New/renamed files fall back to a full rebuild so
   * the collected file list stays authoritative.
   */
  async refreshFile(filePath: string): Promise<void> {
    const lower = filePath.toLowerCase();
    if (!lower.endsWith('.dec') && !lower.endsWith('.inf') && !lower.endsWith('.dsc')) {
      return;
    }
    if (this.files.length === 0 || !this.files.includes(filePath)) {
      await this.build(); // cold index or new file -> rebuild file list too
      return;
    }
    this.removeDefsFromFile(filePath);
    await this.indexFile(filePath);
    this.rebuildPcdAuxiliaries();
    logDebug(`[WorkspaceIndex] refreshed ${filePath}`);
  }

  private insertDef(def: Edk2SymbolDef): void {
    // GUID-family kinds (guid/ppi/protocol) share a lookup namespace so any
    // `g...` name resolves regardless of which section declared it.
    const family = def.kind === 'guid' || def.kind === 'ppi' || def.kind === 'protocol' ? 'guid' : def.kind;
    const key = `${family}::${def.name.toLowerCase()}`;
    let byFile = this.defsByFile.get(def.filePath);
    if (!byFile) {
      byFile = [];
      this.defsByFile.set(def.filePath, byFile);
    }
    byFile.push(def);
    let bucket = this.defsByKey.get(key);
    if (!bucket) {
      bucket = [];
      this.defsByKey.set(key, bucket);
    }
    bucket.push(def);

    if (def.kind === 'pcd' && def.tokenSpace) {
      const ts = def.tokenSpace.toLowerCase();
      this.tokenSpaces.add(def.tokenSpace);
      let names = this.pcdNamesByTokenSpace.get(ts);
      if (!names) {
        names = new Set<string>();
        this.pcdNamesByTokenSpace.set(ts, names);
      }
      names.add(def.name.toLowerCase());
      this.insertDefKey(`pcd::${def.qualifiedName!.toLowerCase()}`, def);
      let tsDefs = this.pcdsByTokenSpace.get(ts);
      if (!tsDefs) {
        tsDefs = [];
        this.pcdsByTokenSpace.set(ts, tsDefs);
      }
      tsDefs.push(def);
    }
  }

  private insertDefKey(key: string, def: Edk2SymbolDef): void {
    let bucket = this.defsByKey.get(key);
    if (!bucket) {
      bucket = [];
      this.defsByKey.set(key, bucket);
    }
    bucket.push(def);
  }

  private async collectFiles(dir: string, out: string[], depth: number): Promise<void> {
    if (depth > 12) {
      return;
    }
    let entries: fs.Dirent[];
    try {
      entries = await fs.promises.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!SYMBOL_INDEX_EXCLUDED_DIRS.includes(entry.name.toLowerCase())) {
          await this.collectFiles(full, out, depth + 1);
        }
      } else if (entry.isFile()) {
        const lower = entry.name.toLowerCase();
        if (lower.endsWith('.dec') || lower.endsWith('.inf') || lower.endsWith('.dsc')) {
          out.push(full);
        }
      }
    }
  }

  /** Lookup definitions for a navigation target produced by `extractDefinitionTarget`. */
  lookup(target: { kind: string; name: string; tokenSpace?: string; qualifiedName?: string }): Edk2SymbolDef[] {
    const lname = target.name.toLowerCase();
    if (target.kind === 'pcd') {
      if (target.qualifiedName) {
        const exact = this.defsByKey.get(`pcd::${target.qualifiedName.toLowerCase()}`);
        if (exact && exact.length > 0) {
          return exact;
        }
      }
      return this.defsByKey.get(`pcd::${lname}`) || [];
    }
    if (target.kind === 'guid') {
      return this.defsByKey.get(`guid::${lname}`) || [];
    }
    // 'word' -> try guid family first, then modules.
    const guid = this.defsByKey.get(`guid::${lname}`);
    if (guid && guid.length > 0) {
      return guid;
    }
    const mod = this.defsByKey.get(`module::${lname}`);
    if (mod && mod.length > 0) {
      return mod;
    }
    const pcd = this.defsByKey.get(`pcd::${lname}`);
    return pcd || [];
  }

  /** Return every definition matching a plain symbol name (any kind). */
  defsByName(name: string): Edk2SymbolDef[] {
    const out: Edk2SymbolDef[] = [];
    for (const suffix of ['guid', 'pcd', 'module']) {
      const bucket = this.defsByKey.get(`${suffix}::${name.toLowerCase()}`);
      if (bucket) {
        out.push(...bucket);
      }
    }
    return out;
  }

  findPcd(tokenSpace: string, pcdName: string): Edk2SymbolDef[] {
    return this.defsByKey.get(`pcd::${tokenSpace}.${pcdName}`.toLowerCase()) || [];
  }

  /** True when a .dec declares `tokenSpace.PcdName`. Used by lint and completion. */
  isDeclaredPcd(tokenSpace: string, pcdName: string): boolean {
    const names = this.pcdNamesByTokenSpace.get(tokenSpace.toLowerCase());
    if (!names) {
      return false;
    }
    return names.has(pcdName.toLowerCase());
  }

  /** True when at least one .dec declares the given token space. */
  knowsTokenSpace(tokenSpace: string): boolean {
    return this.pcdNamesByTokenSpace.has(tokenSpace.toLowerCase());
  }

  listTokenSpaces(): string[] {
    return Array.from(this.tokenSpaces);
  }

  listPcds(tokenSpace?: string): Edk2SymbolDef[] {
    if (tokenSpace) {
      const seen = new Set<string>();
      const out: Edk2SymbolDef[] = [];
      for (const def of this.pcdsByTokenSpace.get(tokenSpace.toLowerCase()) || []) {
        const k = def.qualifiedName!.toLowerCase();
        if (!seen.has(k)) {
          seen.add(k);
          out.push(def);
        }
      }
      return out;
    }
    const seen = new Set<string>();
    const out: Edk2SymbolDef[] = [];
    for (const defs of this.pcdsByTokenSpace.values()) {
      for (const def of defs) {
        const k = def.qualifiedName!.toLowerCase();
        if (!seen.has(k)) {
          seen.add(k);
          out.push(def);
        }
      }
    }
    return out;
  }

  listGuids(): Edk2SymbolDef[] {
    const out: Edk2SymbolDef[] = [];
    for (const [key, defs] of this.defsByKey) {
      if (key.startsWith('guid::')) {
        out.push(...defs);
      }
    }
    return out;
  }

  listModules(): Edk2SymbolDef[] {
    const out: Edk2SymbolDef[] = [];
    for (const [key, defs] of this.defsByKey) {
      if (key.startsWith('module::')) {
        out.push(...defs);
      }
    }
    return out;
  }

  listAllFiles(): string[] {
    return this.files;
  }

  getStats(): { roots: number; files: number; defs: number } {
    return {
      roots: this.roots.length,
      files: this.files.length,
      defs: Array.from(this.defsByKey.values()).reduce((n, b) => n + b.length, 0),
    };
  }

  /** Compute reference locations for a definition by rescanning indexed files. */
  async findReferences(def: Edk2SymbolDef): Promise<Edk2SymbolRef[]> {
    const keys: string[] = [];
    if (def.kind === 'pcd') {
      if (def.qualifiedName) {
        keys.push(def.qualifiedName);
      }
      keys.push(def.name);
    } else if (def.kind === 'module') {
      keys.push(def.name);
      // A module is also referenced by its repo-relative path (DSC [Components], FDF INF lines).
      for (const root of this.roots) {
        const rel = path.relative(root, def.filePath);
        if (rel && !rel.startsWith('..')) {
          keys.push(rel.replace(/\\/g, '/'));
        }
      }
    } else {
      keys.push(def.name);
    }

    const refs: Edk2SymbolRef[] = [];
    const seen = new Set<string>();
    for (const file of this.files) {
      let content: string;
      try {
        content = await fs.promises.readFile(file, 'utf-8');
      } catch {
        continue;
      }
      const lines = content.split(/\r?\n/);
      const hits = findAllOccurrences(content, keys);
      for (const hit of hits) {
        if (file === def.filePath && hit.line === def.line) {
          continue;
        }
        const key = hit.key.toLowerCase();
        if (def.kind === 'pcd' && key === def.name.toLowerCase()) {
          // A bare PcdName hit counts as a reference only when the line also
          // carries this PCD's token space; otherwise the name likely belongs
          // to a different token space's PCD.
          const lineText = lines[hit.line] || '';
          if (def.qualifiedName && !lineText.toLowerCase().includes(`${def.tokenSpace}.`)) {
            continue;
          }
        }
        const dedupKey = `${file}:${hit.line}:${hit.column}`;
        if (seen.has(dedupKey)) {
          continue;
        }
        seen.add(dedupKey);
        refs.push({ key, filePath: file, line: hit.line, column: hit.column });
      }
    }
    return refs;
  }
}

// ---------------------------------------------------------------------------
// Singleton + navigation target model
// ---------------------------------------------------------------------------

let singleton: WorkspaceIndex | null = null;

/** Shared index instance, lazily rooted on the current workspace folders. */
export function getWorkspaceIndex(): WorkspaceIndex {
  if (!singleton) {
    singleton = new WorkspaceIndex();
  }
  return singleton;
}

// ---------------------------------------------------------------------------
// Navigation target extraction (pure; used by definition / reference providers)
// ---------------------------------------------------------------------------

export type DefinitionTarget =
  | { kind: 'pcd'; name: string; tokenSpace: string; qualifiedName: string }
  | { kind: 'guid'; name: string }
  | { kind: 'word'; name: string };

/** The trimmed word around `column` inside `text`, if any. */
export function wordAt(text: string, column: number): { word: string; start: number; end: number } | null {
  const re = /[A-Za-z0-9_]+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (column >= m.index && column <= m.index + m[0].length) {
      return { word: m[0], start: m.index, end: m.index + m[0].length };
    }
    if (m.index > column) {
      break;
    }
  }
  return null;
}

/**
 * Decide what symbol (if any) the caret points at. Checks (in order):
 * a qualified PCD `gTokenSpace.PcdName`, then a `g...` GUID token, then any
 * bare word that is not an EDK2 keyword.
 */
export function extractDefinitionTarget(text: string, column: number): DefinitionTarget | null {
  const line = text;
  // 1. qualified PCD, e.g. `gEfiMdePkgTokenSpaceGuid.PcdFooBar`
  const qRe = /\b(g[A-Za-z0-9_]+)\.([A-Za-z0-9_]+)\b/g;
  let qm: RegExpExecArray | null;
  while ((qm = qRe.exec(line)) !== null) {
    const dot = line.indexOf('.', qm.index);
    const end = dot + 1 + qm[2].length;
    if (column >= qm.index && column <= end) {
      return {
        kind: 'pcd',
        name: qm[2],
        tokenSpace: qm[1],
        qualifiedName: `${qm[1]}.${qm[2]}`,
      };
    }
    if (qm.index > column) {
      break;
    }
  }

  const w = wordAt(line, column);
  if (!w) {
    return null;
  }
  // 2. GUID / token-space token (`g...`)
  if (w.word.length > 1 && w.word[0] === 'g' && !line.slice(w.start - 1 >= 0 ? w.start - 1 : 0, w.start).match(/[A-Za-z0-9_]/)) {
    return { kind: 'guid', name: w.word };
  }
  // 3. bare word -> module / library name (ignoring EDK2 keywords)
  const lower = w.word.toLowerCase();
  if (lower.length < 3 || EDK2_KEYWORDS.has(lower)) {
    return null;
  }
  return { kind: 'word', name: w.word };
}

/** Convenience wrapper sorting a definition list so type kinds stay in a stable order. */
export function sortDefinitions(defs: Edk2SymbolDef[]): Edk2SymbolDef[] {
  const rank: Record<string, number> = { guid: 0, ppi: 1, protocol: 2, pcd: 3, module: 4 };
  return [...defs].sort((a, b) => {
    const ra = rank[a.kind] ?? 99;
    const rb = rank[b.kind] ?? 99;
    return ra !== rb ? ra - rb : a.name.localeCompare(b.name);
  });
}
