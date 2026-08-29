// src/language-support/core/lintRules.ts
//
// Pure EDK2 lint rules (no `vscode` dependency) so they can be unit-tested and
// reused by the diagnostics provider. Each rule returns issues with 0-based
// line/column. Scope is intentionally conservative to avoid false positives in
// real EDK2 trees: structural problems, duplicate/undefined references, and
// file-existence checks that are objective.

import * as fs from 'fs';
import * as path from 'path';
import { Edk2Parser } from './edk2Parser';
import { parseQualifiedPcd } from './workspaceIndex';

export interface LintIssue {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
}

interface Section {
  header: string;
  headerLine: number;
  content: Array<{ text: string; line: number }>;
}

const SOURCE_EXTS = /\.(c|h|s|asm|nasm|S|vfr|uni|sd|ifr)$/i;
const PCD_QUALIFIED = /^(g[A-Za-z0-9_]+)\.[A-Za-z0-9_]+\b/;

/**
 * Split a document into `[Section]` blocks, keeping header + content lines.
 * Lines before the first section (e.g. top-level `!include` in DSC/INF) are
 * captured in a synthetic `header: ''` block so they are still linted.
 */
export function parseSections(lines: string[]): Section[] {
  const sections: Section[] = [];
  let current: Section | null = null;
  for (let i = 0; i < lines.length; i++) {
    const clean = Edk2Parser.removeHashTagComment(lines[i]);
    if (clean.length === 0) {
      continue;
    }
    if (!current) {
      current = { header: '', headerLine: -1, content: [] };
      sections.push(current);
    }
    const header = clean.match(/^\[([A-Za-z0-9_.]+)\]\s*$/);
    if (header) {
      current = { header: header[1], headerLine: i, content: [] };
      sections.push(current);
      continue;
    }
    current.content.push({ text: lines[i], line: i });
  }
  return sections;
}

function findDefinesValue(section: Section | undefined, key: string): string | null {
  if (!section) {
    return null;
  }
  const re = new RegExp(`^\\s*${key}\\s*=\\s*(.+)$`);
  for (const entry of section.content) {
    const m = Edk2Parser.removeHashTagComment(entry.text).match(re);
    if (m) {
      return m[1].trim();
    }
  }
  return null;
}

function pathExistsAcross(folderPath: string, rel: string, roots: string[]): boolean {
  const candidates = [path.resolve(folderPath, rel)];
  for (const root of roots) {
    candidates.push(path.resolve(root, rel));
  }
  return candidates.some((c) => fs.existsSync(c));
}

/** Check `!include <path>` and INF/DSC relative path entries exist on disk. */
function checkInclude(entry: string, line: number, filePath: string, roots: string[], issues: LintIssue[]): void {
  const inc = entry.match(/^!include\s+(\S+)/);
  if (inc) {
    if (!pathExistsAcross(path.dirname(filePath), inc[1], roots)) {
      issues.push({
        line,
        column: entry.indexOf(inc[1]),
        message: `Included file not found: ${inc[1]}`,
        severity: 'error',
      });
    }
  }
}

function checkPcdEntry(entry: string, line: number, issues: LintIssue[], requireFields = false): void {
  const clean = Edk2Parser.removeHashTagComment(entry);
  if (clean.length === 0) {
    return;
  }
  const firstToken = clean.split('|', 1)[0].trim();
  if (!PCD_QUALIFIED.test(firstToken)) {
    issues.push({
      line,
      column: 0,
      message: `PCD entry must be TokenSpaceGuid.PcdName, got: ${firstToken}`,
      severity: 'error',
    });
    return;
  }
  const pcd = parseQualifiedPcd(firstToken);
  if (!pcd) {
    return;
  }
  // INF and DSC PCD entries routinely state only `TokenSpace.PcdName` (values
  // live in the DEC or the build output), so only the DEC requires all fields.
  if (requireFields && clean.split('|').length < 4) {
    issues.push({
      line,
      column: 0,
      message: `PCD '${pcd.pcdName}' is missing fields (expected TokenSpace.PcdName|Default|Type|Token)`,
      severity: 'warning',
    });
  }
}

function checkSectionHeaders(anyLine: string, line: number, issues: LintIssue[]): void {
  if (line < 0 || typeof anyLine !== 'string' || anyLine.length === 0) {
    return;
  }
  const clean = Edk2Parser.removeHashTagComment(anyLine);
  if (clean.startsWith('[') && clean.length > 1 && !/^\[[A-Za-z0-9_.]+\]\s*$/.test(clean)) {
    issues.push({ line, column: 0, message: `Malformed section header: ${clean}`, severity: 'error' });
  }
}

export function lintInf(content: string, filePath: string, roots: string[] = []): LintIssue[] {
  const issues: LintIssue[] = [];
  const lines = content.split(/\r?\n/);
  const sections = parseSections(lines);
  const defines = sections.find((s) => s.header.toLowerCase() === 'defines');

  if (!defines) {
    issues.push({
      line: 0,
      column: 0,
      message: 'Missing required [Defines] section',
      severity: 'error',
    });
  } else {
    for (const key of ['BASE_NAME', 'FILE_GUID', 'MODULE_TYPE']) {
      if (!findDefinesValue(defines, key)) {
        issues.push({
          line: defines.headerLine,
          column: 0,
          message: `[Defines] is missing required field: ${key}`,
          severity: 'error',
        });
      }
    }
  }

  const seenSections = new Set<string>();
  for (const s of sections) {
    const normalized = s.header.toLowerCase();
    checkSectionHeaders(lines[s.headerLine], s.headerLine, issues);
    if (seenSections.has(normalized)) {
      issues.push({
        line: s.headerLine,
        column: 0,
        message: `Section '[${s.header}]' is already defined`,
        severity: 'warning',
      });
    }
    seenSections.add(normalized);

    if (/^pcds/i.test(s.header)) {
      for (const entry of s.content) {
        checkPcdEntry(entry.text, entry.line, issues);
      }
    } else if (/^(sources|binaries)$/i.test(s.header)) {
      for (const entry of s.content) {
        const clean = Edk2Parser.removeHashTagComment(entry.text);
        if (clean.length === 0) {
          continue;
        }
        const first = clean.split(/\s/, 1)[0];
        if (SOURCE_EXTS.test(first)) {
          if (!pathExistsAcross(path.dirname(filePath), first, roots)) {
            issues.push({
              line: entry.line,
              column: clean.indexOf(first),
              message: `Source file not found: ${first}`,
              severity: 'warning',
            });
          }
        } else {
          checkInclude(first, entry.line, filePath, roots, issues);
        }
      }
    } else if (/^packages$/i.test(s.header)) {
      for (const entry of s.content) {
        const clean = Edk2Parser.removeHashTagComment(entry.text).split(/\s/, 1)[0];
        if (clean.length === 0) {
          continue;
        }
        if (!pathExistsAcross(path.dirname(filePath), clean, roots)) {
          issues.push({
            line: entry.line,
            column: 0,
            message: `Package declaration not found: ${clean}`,
            severity: 'warning',
          });
        }
      }
    } else {
      for (const entry of s.content) {
        checkInclude(entry.text, entry.line, filePath, roots, issues);
        checkSectionHeaders(entry.text, entry.line, issues);
      }
    }
  }
  return issues;
}

export function lintDsc(content: string, filePath: string, roots: string[] = []): LintIssue[] {
  const issues: LintIssue[] = [];
  const lines = content.split(/\r?\n/);
  const sections = parseSections(lines);
  const seenSections = new Set<string>();
  const seenPcds = new Set<string>();

  for (const s of sections) {
    const normalized = s.header.toLowerCase();
    checkSectionHeaders(lines[s.headerLine], s.headerLine, issues);
    if (seenSections.has(normalized)) {
      issues.push({
        line: s.headerLine,
        column: 0,
        message: `Section '[${s.header}]' is already defined`,
        severity: 'warning',
      });
    }
    seenSections.add(normalized);

    if (/^pcds/i.test(s.header)) {
      for (const entry of s.content) {
        checkPcdEntry(entry.text, entry.line, issues);
        const clean = Edk2Parser.removeHashTagComment(entry.text);
        const first = clean.split('|', 1)[0].trim();
        const pcd = parseQualifiedPcd(first);
        if (pcd) {
          const key = `${pcd.tokenSpace}.${pcd.pcdName}`.toLowerCase();
          if (seenPcds.has(key)) {
            issues.push({
              line: entry.line,
              column: 0,
              message: `PCD '${key}' assigned more than once in this DSC`,
              severity: 'warning',
            });
          }
          seenPcds.add(key);
        }
      }
    } else if (/^libraryclasses/i.test(s.header)) {
      for (const entry of s.content) {
        const clean = Edk2Parser.removeHashTagComment(entry.text).split(/\s\|/, 1)[0].trim();
        if (clean.length === 0) {
          continue;
        }
        const pipe = entry.text.indexOf('|');
        if (pipe >= 0) {
          const infPath = entry.text.slice(pipe + 1).trim().split(/\s/, 1)[0];
          if (infPath && !pathExistsAcross(path.dirname(filePath), infPath, roots)) {
            issues.push({
              line: entry.line,
              column: pipe + 1,
              message: `Library INF not found: ${infPath}`,
              severity: 'warning',
            });
          }
        }
        if (clean.startsWith('!include')) {
          checkInclude(clean, entry.line, filePath, roots, issues);
        }
      }
    } else if (/^components/i.test(s.header)) {
      for (const entry of s.content) {
        const clean = Edk2Parser.removeHashTagComment(entry.text).split(/\s/, 1)[0];
        if (clean.length === 0) {
          continue;
        }
        if (/\.inf$/i.test(clean)) {
          if (!pathExistsAcross(path.dirname(filePath), clean, roots)) {
            issues.push({
              line: entry.line,
              column: 0,
              message: `Component INF not found: ${clean}`,
              severity: 'warning',
            });
          }
        } else if (clean.startsWith('!include')) {
          checkInclude(clean, entry.line, filePath, roots, issues);
        }
      }
    } else {
      for (const entry of s.content) {
        checkInclude(entry.text, entry.line, filePath, roots, issues);
        checkSectionHeaders(entry.text, entry.line, issues);
      }
    }
  }
  return issues;
}

/** Minimal view of the symbol index needed by the cross-file PCD check. */
export interface PcdIndexProbe {
  /** True when a .dec in the workspace declares the token space at all. */
  knowsTokenSpace(ts: string): boolean;
  /** True when the given token space declares `ts.pcdName`. */
  isDeclaredPcd(ts: string, pcdName: string): boolean;
  /** The index has actually scanned files (empty index => skip the check). */
  built(): boolean;
}

/**
 * Warn about PCD assignments to a token space the index knows, when that PCD
 * is not declared in any package .dec. Mirrors the EDK2 build-time error for
 * undeclared PCD tokens, but only fires when we can be sure of the token space.
 */
export function detectUndeclaredPcds(content: string, languageId: string, probe: PcdIndexProbe | null): LintIssue[] {
  if (languageId !== 'edk2_inf' && languageId !== 'edk2_dsc') {
    return [];
  }
  if (!probe || !probe.built()) {
    return [];
  }
  const issues: LintIssue[] = [];
  const lines = content.split(/\r?\n/);
  let inPcd = false;
  for (let i = 0; i < lines.length; i++) {
    const clean = Edk2Parser.removeHashTagComment(lines[i]);
    const header = clean.match(/^\[([A-Za-z0-9_.]+)\]\s*$/);
    if (header) {
      inPcd = /^pcds/i.test(header[1]);
      continue;
    }
    if (!inPcd) {
      continue;
    }
    const first = clean.split('|', 1)[0].trim();
    const pcd = parseQualifiedPcd(first);
    if (pcd && probe.knowsTokenSpace(pcd.tokenSpace) && !probe.isDeclaredPcd(pcd.tokenSpace, pcd.pcdName)) {
      issues.push({
        line: i,
        column: 0,
        message: `PCD '${pcd.tokenSpace}.${pcd.pcdName}' is not declared in any package .dec`,
        severity: 'warning',
      });
    }
  }
  return issues;
}

export function lintDec(content: string, filePath: string, roots: string[] = []): LintIssue[] {
  const issues: LintIssue[] = [];
  const lines = content.split(/\r?\n/);
  const sections = parseSections(lines);
  const seenSection = new Set<string>();
  const seenGuids = new Set<string>();
  const seenPcds = new Set<string>();

  for (const s of sections) {
    const normalized = s.header.toLowerCase();
    checkSectionHeaders(lines[s.headerLine], s.headerLine, issues);
    if (seenSection.has(normalized)) {
      issues.push({
        line: s.headerLine,
        column: 0,
        message: `Section '[${s.header}]' is already defined`,
        severity: 'warning',
      });
    }
    seenSection.add(normalized);

    if (normalized === 'guids' || normalized === 'ppis' || normalized === 'protocols') {
      for (const entry of s.content) {
        const clean = Edk2Parser.removeHashTagComment(entry.text);
        if (clean.length === 0) {
          continue;
        }
        const decl = clean.match(/^(g[A-Za-z0-9_]+)\s*=/);
        if (!decl) {
          issues.push({
            line: entry.line,
            column: 0,
            message: `GUID declaration must be 'gName = { ... }', got: ${clean}`,
            severity: 'error',
          });
          continue;
        }
        const name = decl[1];
        const key = name.toLowerCase();
        if (seenGuids.has(key)) {
          issues.push({ line: entry.line, column: 0, message: `Duplicate ${name}`, severity: 'error' });
        }
        seenGuids.add(key);
      }
    } else if (/^pcds/i.test(s.header)) {
      for (const entry of s.content) {
        checkPcdEntry(entry.text, entry.line, issues, true);
        const clean = Edk2Parser.removeHashTagComment(entry.text);
        const first = clean.split('|', 1)[0].trim();
        const pcd = parseQualifiedPcd(first);
        if (pcd) {
          const key = `${pcd.tokenSpace}.${pcd.pcdName}`.toLowerCase();
          if (seenPcds.has(key)) {
            issues.push({
              line: entry.line,
              column: 0,
              message: `Duplicate PCD token '${pcd.tokenSpace}.${pcd.pcdName}'`,
              severity: 'error',
            });
          }
          seenPcds.add(key);
        }
      }
    } else {
      for (const entry of s.content) {
        checkSectionHeaders(entry.text, entry.line, issues);
      }
    }
  }
  return issues;
}
