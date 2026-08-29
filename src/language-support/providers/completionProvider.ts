// src/language-support/providers/completionProvider.ts
//
// EDK2 completion: EDK2 keywords + section names + symbols from the workspace
// index (GUID names, PCD token spaces/names, module BaseNames). The heavy
// lifting lives in the pure `collectCompletions` so it is unit-testable; the
// provider only maps suggestions to vscode.CompletionItem.

import * as vscode from 'vscode';
import { WorkspaceIndex, getWorkspaceIndex } from '../core/workspaceIndex';
import { logDebug } from '../../shared/utils/logger';

export interface CompletionSuggestion {
  label: string;
  kind: 'keyword' | 'variable' | 'constant' | 'module' | 'reference';
  detail?: string;
}

const SECTION_NAMES: Record<string, string[]> = {
  edk2_inf: [
    '[Defines]', '[Sources]', '[Packages]', '[LibraryClasses]', '[Protocols]', '[Ppis]', '[Guids]',
    '[PcdsFixedAtBuild]', '[PcdsDynamic]', '[PcdsDynamicEx]', '[PcdsPatchableInModule]',
    '[PcdsFeatureFlag]', '[Binaries]', '[BuildOptions]', '[Depex]', '[UserDefined]',
  ],
  edk2_dsc: [
    '[Defines]', '[LibraryClasses]', '[LibraryClasses.common]', '[PcdsFixedAtBuild]',
    '[PcdsFixedAtBuild.common]', '[PcdsDynamic]', '[PcdsDynamicEx]', '[PcdsPatchableInModule]',
    '[PcdsFeatureFlag]', '[Components]', '[Components.common]', '[BuildOptions]', '[SkuIds]',
  ],
  edk2_dec: [
    '[Defines]', '[Includes]', '[Guids]', '[Ppis]', '[Protocols]', '[PcdsFeatureFlag]',
    '[PcdsFixedAtBuild]', '[PcdsDynamic]', '[PcdsDynamicEx]', '[PcdsPatchableInModule]',
  ],
  edk2_fdf: ['[FD]', '[FV]', '[Capsule]', '[Rule]', '[Options]'],
};

const DEFINE_KEYS = [
  'BASE_NAME', 'FILE_GUID', 'MODULE_TYPE', 'INF_VERSION', 'VERSION_STRING', 'ENTRY_POINT',
  'UNLOAD_IMAGE', 'SUPPORTED_ARCHITECTURES', 'BUILD_NUMBER', 'LIBRARY_CLASS', 'CONSTRUCTOR',
  'DESTRUCTOR', 'PRIVATE', 'PLATFORM_NAME', 'PLATFORM_GUID', 'PLATFORM_VERSION',
  'DSC_SPECIFICATION', 'FD_BASE_ADDRESS', 'FD_SIZE', 'FLASH_DEFINITION',
];

const MODULE_TYPES = [
  'BASE', 'SEC', 'PEI_CORE', 'PEIM', 'DXE_CORE', 'DXE_DRIVER', 'DXE_RUNTIME_DRIVER',
  'DXE_SMM_DRIVER', 'DXE_SAL_DRIVER', 'UEFI_DRIVER', 'UEFI_APPLICATION', 'USER_DEFINED',
];

const ARCHITECTURES = ['IA32', 'X64', 'ARM', 'AARCH64', 'RISCV64', 'EBC'];

function suggest(labels: string[], kind: CompletionSuggestion['kind'], detail?: string): CompletionSuggestion[] {
  return labels.map((label) => ({ label, kind, detail }));
}

/** Find the value being edited on the current INF/DSC `KEY = value` line. */
function keyOnLine(linePrefix: string): string | null {
  const m = linePrefix.match(/^\s*([A-Z0-9_]+)\s*=\s*$/);
  return m ? m[1] : null;
}

/** True when the caret is editing the `[section]` header itself. */
function inSectionHeader(linePrefix: string): boolean {
  return /^\s*\[[A-Za-z0-9_.]*$/.test(linePrefix);
}

/**
 * Pure completion logic. `currentSection` is the lowercased name of the last
 * `[...]` section at or above the caret ('' when outside any section).
 */
export function collectCompletions(
  languageId: string,
  linePrefix: string,
  currentSection: string,
  index: WorkspaceIndex
): CompletionSuggestion[] {
  const items: CompletionSuggestion[] = [];

  if (inSectionHeader(linePrefix)) {
    return suggest(SECTION_NAMES[languageId] || [], 'keyword', 'section');
  }

  const afterDot = linePrefix.match(/(g[A-Za-z0-9_]+)\.$/);
  if (afterDot) {
    const defs = index.listPcds(afterDot[1]);
    return defs.map((d) => ({
      label: d.name,
      kind: 'variable' as const,
      detail: `${d.qualifiedName}  (${d.filePath})`,
    }));
  }

  const key = keyOnLine(linePrefix);
  if (key) {
    if (key === 'MODULE_TYPE') {
      return suggest(MODULE_TYPES, 'keyword', 'EDK2 module type');
    }
    if (key === 'SUPPORTED_ARCHITECTURES') {
      return suggest(ARCHITECTURES, 'keyword', 'EDK2 architecture');
    }
    return [];
  }

  const section = currentSection.toLowerCase();
  if (section.startsWith('pcds')) {
    // Typing a fresh token: complete token spaces and full PCD tokens.
    items.push(...suggest(index.listTokenSpaces(), 'constant', 'PCD token space'));
    for (const d of index.listPcds()) {
      items.push({ label: d.qualifiedName!, kind: 'variable', detail: d.filePath });
      if (!items.some((i) => i.label === d.name)) {
        items.push({ label: d.name, kind: 'variable', detail: `declared in ${d.filePath}` });
      }
    }
    return items;
  }
  if (section === 'libraryclasses') {
    return suggest(index.listModules().map((d) => d.name), 'module', 'EDK2 module / library');
  }
  if (section === 'guids' || section === 'ppis' || section === 'protocols') {
    return suggest(index.listGuids().map((d) => d.name), 'constant', 'EDK2 GUID');
  }
  if (section === 'defines' || section === '') {
    // Field keys for [Defines]; offered even outside a section as a fallback.
    return suggest(DEFINE_KEYS, 'keyword', 'EDK2 defines key');
  }
  if (languageId === 'edk2_inf' || languageId === 'edk2_dsc') {
    // Bare word typing: prefer module names and GUID-like tokens.
    const seen = new Set<string>();
    for (const s of suggest(index.listModules().map((d) => d.name), 'module', 'EDK2 module / library')) {
      if (!seen.has(s.label)) {
        seen.add(s.label);
        items.push(s);
      }
    }
    if (items.length === 0) {
      for (const s of suggest(index.listGuids().map((d) => d.name), 'constant', 'EDK2 GUID')) {
        if (!seen.has(s.label)) {
          seen.add(s.label);
          items.push(s);
        }
      }
    }
    return items;
  }
  return items;
}

/** Locate the last section header at or above (and including) `line`. */
export function currentSectionAt(text: string, line: number): string {
  const lines = text.split(/\r?\n/);
  for (let i = line; i >= 0; i--) {
    const m = lines[i] && lines[i].match(/^\s*\[([A-Za-z0-9_.]+)\]\s*.*$/);
    if (m) {
      return m[1];
    }
  }
  return '';
}

const COMPLETION_KIND_MAP: Record<CompletionSuggestion['kind'], vscode.CompletionItemKind> = {
  keyword: vscode.CompletionItemKind.Keyword,
  variable: vscode.CompletionItemKind.Variable,
  constant: vscode.CompletionItemKind.Constant,
  module: vscode.CompletionItemKind.Module,
  reference: vscode.CompletionItemKind.Reference,
};

export class Edk2CompletionProvider implements vscode.CompletionItemProvider {
  constructor(private languageId: string) {}

  async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): Promise<vscode.CompletionItem[]> {
    const linePrefix = document.lineAt(position).text.slice(0, position.character);
    const section = currentSectionAt(document.getText(), position.line);
    const index = getWorkspaceIndex();
    await index.ensureBuilt();
    const suggestions = collectCompletions(this.languageId, linePrefix, section, index);
    logDebug(`[Completion] offered ${suggestions.length} items for ${this.languageId}`);
    return suggestions.map((s) => {
      const item = new vscode.CompletionItem(s.label, COMPLETION_KIND_MAP[s.kind]);
      item.detail = s.detail;
      return item;
    });
  }
}
