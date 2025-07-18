// src/language-support/providers/definitionProvider.ts

import * as vscode from 'vscode';
import * as fs from 'fs';
import { Edk2Parser, Common } from '../core/edk2Parser';

export class Edk2FdfDefinitionProvider implements vscode.DefinitionProvider {
    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Definition> {
        let dest = Common.removeHashTagComment(document.lineAt(position).text);

        // Check INF prefix
        if (dest.match(/^INF[\w\s]+/g)) {
            let folders = Common.getRootPath();
            for (let i = 0; i < folders.length; i++) {
                let full_dest = folders[i] + '/' + dest.replace(/^INF[\s]+/g, '');
                if (fs.existsSync(full_dest)) {
                    return new vscode.Location(vscode.Uri.file(full_dest), new vscode.Position(0, 0));
                }
            }
        }
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

        let folders = Common.getRootPath();
        for (let i = 0; i < folders.length; i++) {
            let full_dest = folders[i] + '/' + dest;
            if (fs.existsSync(full_dest)) {
                return new vscode.Location(vscode.Uri.file(full_dest), new vscode.Position(0, 0));
            }
        }
    }
}

export class Edk2DecDefinitionProvider implements vscode.DefinitionProvider {
    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Definition> {
        let dest = Common.removeHashTagComment(document.lineAt(position).text);

        if (dest.match(/^(!include )/g)) {
            dest = dest.replace(/^(!include )/g, '');
        }

        let folders = Common.getRootPath();
        for (let i = 0; i < folders.length; i++) {
            let full_dest = folders[i] + '/' + dest;
            if (fs.existsSync(full_dest)) {
                return new vscode.Location(vscode.Uri.file(full_dest), new vscode.Position(0, 0));
            }
        }
    }
}

export class Edk2InfDefinitionProvider implements vscode.DefinitionProvider {
    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Definition> {
        let dest = Common.removeHashTagComment(document.lineAt(position).text);

        if (dest.match(/^(!include )/g)) {
            dest = dest.replace(/^(!include )/g, '');
        }

        let folders = Common.getRootPath();
        for (let i = 0; i < folders.length; i++) {
            let full_dest = folders[i] + '/' + dest;
            if (fs.existsSync(full_dest)) {
                return new vscode.Location(vscode.Uri.file(full_dest), new vscode.Position(0, 0));
            }
        }
    }
}

export class Edk2VfrDefinitionProvider implements vscode.DefinitionProvider {
    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Definition> {
        let dest = Common.removeHashTagComment(document.lineAt(position).text);

        if (dest.match(/^(!include )/g)) {
            dest = dest.replace(/^(!include )/g, '');
        }

        let folders = Common.getRootPath();
        for (let i = 0; i < folders.length; i++) {
            let full_dest = folders[i] + '/' + dest;
            if (fs.existsSync(full_dest)) {
                return new vscode.Location(vscode.Uri.file(full_dest), new vscode.Position(0, 0));
            }
        }
    }
}
