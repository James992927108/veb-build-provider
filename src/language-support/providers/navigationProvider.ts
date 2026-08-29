// src/language-support/providers/navigationProvider.ts
//
// Semantic Go to Definition / Find References layered on top of the existing
// path-only definition providers. The existing providers jump to `!include`
// targets and module paths; these providers resolve *symbols* (GUIDs, PCDs,
// module BaseNames) to their cross-file declarations using WorkspaceIndex.

import * as vscode from 'vscode';
import {
  getWorkspaceIndex,
  extractDefinitionTarget,
  sortDefinitions,
  Edk2SymbolDef,
  WorkspaceIndex,
} from '../core/workspaceIndex';
import { logDebug, logError } from '../../shared/utils/logger';

function toLocation(def: Edk2SymbolDef): vscode.Location {
  return new vscode.Location(vscode.Uri.file(def.filePath), new vscode.Position(def.line, def.column));
}

/** Go to the declaration of the symbol under the caret (GUID / PCD / module). */
export class Edk2SymbolNavigationProvider implements vscode.DefinitionProvider {
  /** Optional index for tests; defaults to the shared workspace index. */
  constructor(private indexOverride?: WorkspaceIndex) { }

  private getIndex(): WorkspaceIndex {
    return this.indexOverride || getWorkspaceIndex();
  }

  async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Definition | undefined> {
    const lineText = document.lineAt(position).text;
    const target = extractDefinitionTarget(lineText, position.character);
    if (!target) {
      return undefined;
    }
    const index = this.getIndex();
    await index.ensureBuilt();
    const defs = sortDefinitions(index.lookup(target));
    if (defs.length === 0) {
      return undefined;
    }
    logDebug(`[Navigation] resolved '${target.name}' to ${defs[0].filePath}:${defs[0].line}`);
    return toLocation(defs[0]);
  }
}

/** Find all references to the symbol under the caret across the workspace. */
export class Edk2SymbolReferenceProvider implements vscode.ReferenceProvider {
  /** Optional index for tests; defaults to the shared workspace index. */
  constructor(private indexOverride?: WorkspaceIndex) { }

  private getIndex(): WorkspaceIndex {
    return this.indexOverride || getWorkspaceIndex();
  }

  async provideReferences(
    document: vscode.TextDocument,
    position: vscode.Position,
    context: vscode.ReferenceContext,
    token: vscode.CancellationToken
  ): Promise<vscode.Location[]> {
    const lineText = document.lineAt(position).text;
    const target = extractDefinitionTarget(lineText, position.character);
    if (!target) {
      return [];
    }
    const index = this.getIndex();
    await index.ensureBuilt();
    const defs = sortDefinitions(index.lookup(target));
    if (defs.length === 0) {
      return [];
    }
    const map = new Map<string, Edk2SymbolDef>();
    for (const def of defs) {
      map.set(def.filePath, def);
    }
    const locations: vscode.Location[] = [];
    for (const def of map.values()) {
      let refs;
      try {
        refs = await index.findReferences(def);
      } catch (error) {
        logError(`Find references failed for ${def.name}: ${error instanceof Error ? error.message : String(error)}`);
        continue;
      }
      for (const ref of refs) {
        locations.push(new vscode.Location(vscode.Uri.file(ref.filePath), new vscode.Position(ref.line, ref.column)));
      }
    }
    return locations;
  }
}

export const EDK2_NAV_LANGUAGES = ['edk2_inf', 'edk2_dsc', 'edk2_dec', 'edk2_fdf'] as const;
