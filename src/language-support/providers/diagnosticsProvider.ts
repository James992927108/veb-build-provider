// src/language-support/providers/diagnosticsProvider.ts
//
// Lint-type diagnostics for EDK2 files. Local rules (lintRules.ts) cover
// structural problems without needing the workspace; one cross-file rule
// (undeclared PCD) runs only when the symbol index is available, so missing
// index never produces false positives.

import * as vscode from 'vscode';
import { Edk2Parser } from '../core/edk2Parser';
import {
  lintInf,
  lintDsc,
  lintDec,
  detectUndeclaredPcds,
  LintIssue,
} from '../core/lintRules';
import { getWorkspaceIndex } from '../core/workspaceIndex';
import { logDebug } from '../../shared/utils/logger';

const LINT_BY_LANGUAGE: Record<string, (content: string, filePath: string, roots: string[]) => LintIssue[]> = {
  edk2_inf: lintInf,
  edk2_dsc: lintDsc,
  edk2_dec: lintDec,
};

const LINT_DEBOUNCE_MS = 600;

export class Edk2DiagnosticsProvider {
  private collection: vscode.DiagnosticCollection =
    vscode.languages.createDiagnosticCollection('veb-edk2-lint');
  private timers = new Map<string, NodeJS.Timeout>();

  register(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
      this.collection,
      vscode.workspace.onDidOpenTextDocument((doc) => this.schedule(doc)),
      vscode.workspace.onDidSaveTextDocument((doc) => this.schedule(doc)),
      vscode.workspace.onDidChangeTextDocument((e) => this.schedule(e.document)),
      vscode.workspace.onDidCloseTextDocument((doc) => {
        this.timers.delete(doc.uri.toString());
        this.collection.delete(doc.uri);
      })
    );
    for (const doc of vscode.workspace.textDocuments) {
      this.schedule(doc);
    }
    logDebug('[Diagnostics] EDK2 lint provider registered');
  }

  dispose(): void {
    for (const t of this.timers.values()) {
      clearTimeout(t);
    }
    this.timers.clear();
    this.collection.dispose();
  }

  private schedule(document: vscode.TextDocument): void {
    if (!document || document.isUntitled || !(document.languageId in LINT_BY_LANGUAGE)) {
      return;
    }
    const key = document.uri.toString();
    const existing = this.timers.get(key);
    if (existing) {
      clearTimeout(existing);
    }
    this.timers.set(key, setTimeout(() => this.lint(document), LINT_DEBOUNCE_MS));
  }

  private async lint(document: vscode.TextDocument): Promise<void> {
    const lintFn = LINT_BY_LANGUAGE[document.languageId];
    if (!lintFn) {
      return;
    }
    const content = document.getText();
    const roots = Edk2Parser.getRootPath();
    const issues = lintFn(content, document.fileName, roots);

    const diags: vscode.Diagnostic[] = issues.map((i) => {
      const severity =
        i.severity === 'error' ? vscode.DiagnosticSeverity.Error : vscode.DiagnosticSeverity.Warning;
      return new vscode.Diagnostic(
        new vscode.Range(i.line, Math.max(0, i.column), i.line, Math.max(1, i.column + 1)),
        i.message,
        severity
      );
    });

    // Cross-file: undeclared PCD assignments (only when the index is usable).
    const index = getWorkspaceIndex();
    try {
      await index.ensureBuilt();
    } catch {
      // index build failure is already reported by the index itself
    }
    const probe = {
      knowsTokenSpace: (ts: string) => index.knowsTokenSpace(ts),
      isDeclaredPcd: (ts: string, name: string) => index.isDeclaredPcd(ts, name),
      built: () => index.listAllFiles().length > 0,
    };
    for (const extra of detectUndeclaredPcds(content, document.languageId, probe)) {
      diags.push(
        new vscode.Diagnostic(
          new vscode.Range(extra.line, 0, extra.line, Math.max(1, (content.split(/\r?\n/)[extra.line] || '').length)),
          extra.message,
          vscode.DiagnosticSeverity.Warning
        )
      );
    }

    this.collection.set(document.uri, diags);
    logDebug(`[Diagnostics] linted ${document.fileName}: ${diags.length} issue(s)`);
  }
}
