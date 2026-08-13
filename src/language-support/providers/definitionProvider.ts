// src/language-support/providers/definitionProvider.ts

import * as vscode from 'vscode';
import * as fs from 'fs';
import { Common } from '../core/edk2Parser';

/**
 * Resolve a destination path against every configured root folder, returning
 * the first existing file as a Location. Shared by all definition providers.
 */
function findExistingPath(dest: string): vscode.Location | undefined {
  const folders = Common.getRootPath();
  for (let i = 0; i < folders.length; i++) {
    const full_dest = folders[i] + '/' + dest;
    if (fs.existsSync(full_dest)) {
      return new vscode.Location(vscode.Uri.file(full_dest), new vscode.Position(0, 0));
    }
  }
  return undefined;
}

export class Edk2FdfDefinitionProvider implements vscode.DefinitionProvider {
    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Definition> {
        const dest = Common.removeHashTagComment(document.lineAt(position).text);

        // Check INF prefix
        if (dest.match(/^INF[\w\s]+/g)) {
            return findExistingPath(dest.replace(/^INF[\s]+/g, ''));
        }
        return undefined;
    }
}

export class Edk2DscDefinitionProvider implements vscode.DefinitionProvider {
    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Definition> {
        let dest = document.lineAt(position).text.replace(/#.*/g, '')   // comments
            .replace(/^\s*/g, '')                        // front blank
            .replace(/[\s\{\}]*$/g, '')                  // tail "{", "}"" and blank
            .replace(/[\w\s]+\|/g, '');                  // front "|" and blank

        if (dest.match(/^(!include )/g)) {
            dest = dest.replace(/^(!include )/g, '');
        }

        return findExistingPath(dest);
    }
}

export class Edk2DecDefinitionProvider implements vscode.DefinitionProvider {
    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Definition> {
        const dest = Common.removeHashTagComment(document.lineAt(position).text);

        if (dest.match(/^(!include )/g)) {
            return findExistingPath(dest.replace(/^(!include )/g, ''));
        }
        return findExistingPath(dest);
    }
}

export class Edk2InfDefinitionProvider implements vscode.DefinitionProvider {
    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Definition> {
        const dest = Common.removeHashTagComment(document.lineAt(position).text);

        if (dest.match(/^(!include )/g)) {
            return findExistingPath(dest.replace(/^(!include )/g, ''));
        }
        return findExistingPath(dest);
    }
}

export class Edk2VfrDefinitionProvider implements vscode.DefinitionProvider {
    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Definition> {
        const dest = Common.removeHashTagComment(document.lineAt(position).text);

        if (dest.match(/^(!include )/g)) {
            return findExistingPath(dest.replace(/^(!include )/g, ''));
        }
        return findExistingPath(dest);
    }
}
