// src/language-support/providers/symbolProvider.ts

import * as vscode from 'vscode';
import { Edk2Parser, Common } from '../core/edk2Parser';

export class Edk2DscSymbolProvider implements vscode.DocumentSymbolProvider {
    provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[] | vscode.DocumentSymbol[]> {
        const symbols: vscode.DocumentSymbol[] = [];
        const lines = document.getText().split('\n');
        let currentSection: vscode.DocumentSymbol | null = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const cleanLine = Common.removeHashTagComment(line);

            // Section headers
            if (cleanLine.match(/^\[[\w\s\.]+\]$/)) {
                const sectionName = cleanLine.replace(/[\[\]]/g, '');
                const range = new vscode.Range(i, 0, i, line.length);
                
                currentSection = new vscode.DocumentSymbol(
                    sectionName,
                    '',
                    vscode.SymbolKind.Namespace,
                    range,
                    range
                );
                symbols.push(currentSection);
            }
            // Key-value pairs
            else if (cleanLine.includes('=') && currentSection) {
                const [key, value] = cleanLine.split('=', 2);
                if (key && value) {
                    const range = new vscode.Range(i, 0, i, line.length);
                    const keySymbol = new vscode.DocumentSymbol(
                        key.trim(),
                        value.trim(),
                        vscode.SymbolKind.Property,
                        range,
                        range
                    );
                    currentSection.children.push(keySymbol);
                }
            }
        }

        return symbols;
    }
}

export class Edk2DecSymbolProvider implements vscode.DocumentSymbolProvider {
    provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[] | vscode.DocumentSymbol[]> {
        const symbols: vscode.DocumentSymbol[] = [];
        const lines = document.getText().split('\n');
        let currentSection: vscode.DocumentSymbol | null = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const cleanLine = Common.removeHashTagComment(line);

            // Section headers
            if (cleanLine.match(/^\[[\w\s\.]+\]$/)) {
                const sectionName = cleanLine.replace(/[\[\]]/g, '');
                const range = new vscode.Range(i, 0, i, line.length);
                
                currentSection = new vscode.DocumentSymbol(
                    sectionName,
                    '',
                    vscode.SymbolKind.Namespace,
                    range,
                    range
                );
                symbols.push(currentSection);
            }
            // Key-value pairs or entries
            else if (cleanLine.length > 0 && currentSection) {
                const range = new vscode.Range(i, 0, i, line.length);
                const entrySymbol = new vscode.DocumentSymbol(
                    cleanLine,
                    '',
                    vscode.SymbolKind.Variable,
                    range,
                    range
                );
                currentSection.children.push(entrySymbol);
            }
        }

        return symbols;
    }
}

export class Edk2FdfSymbolProvider implements vscode.DocumentSymbolProvider {
    provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[] | vscode.DocumentSymbol[]> {
        const symbols: vscode.DocumentSymbol[] = [];
        const lines = document.getText().split('\n');
        let currentSection: vscode.DocumentSymbol | null = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const cleanLine = Common.removeHashTagComment(line);

            // Section headers
            if (cleanLine.match(/^\[[\w\s\.]+\]$/)) {
                const sectionName = cleanLine.replace(/[\[\]]/g, '');
                const range = new vscode.Range(i, 0, i, line.length);
                
                currentSection = new vscode.DocumentSymbol(
                    sectionName,
                    '',
                    vscode.SymbolKind.Namespace,
                    range,
                    range
                );
                symbols.push(currentSection);
            }
            // INF entries
            else if (cleanLine.startsWith('INF ') && currentSection) {
                const infPath = cleanLine.replace('INF ', '');
                const range = new vscode.Range(i, 0, i, line.length);
                const infSymbol = new vscode.DocumentSymbol(
                    infPath,
                    'INF Module',
                    vscode.SymbolKind.Module,
                    range,
                    range
                );
                currentSection.children.push(infSymbol);
            }
        }

        return symbols;
    }
}

export class Edk2InfSymbolProvider implements vscode.DocumentSymbolProvider {
    provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[] | vscode.DocumentSymbol[]> {
        const symbols: vscode.DocumentSymbol[] = [];
        const lines = document.getText().split('\n');
        let currentSection: vscode.DocumentSymbol | null = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const cleanLine = Common.removeHashTagComment(line);

            // Section headers
            if (cleanLine.match(/^\[[\w\s\.]+\]$/)) {
                const sectionName = cleanLine.replace(/[\[\]]/g, '');
                const range = new vscode.Range(i, 0, i, line.length);
                
                currentSection = new vscode.DocumentSymbol(
                    sectionName,
                    '',
                    vscode.SymbolKind.Namespace,
                    range,
                    range
                );
                symbols.push(currentSection);
            }
            // Source files
            else if (cleanLine.endsWith('.c') || cleanLine.endsWith('.h') || cleanLine.endsWith('.asm')) {
                if (currentSection) {
                    const range = new vscode.Range(i, 0, i, line.length);
                    const sourceSymbol = new vscode.DocumentSymbol(
                        cleanLine,
                        'Source File',
                        vscode.SymbolKind.File,
                        range,
                        range
                    );
                    currentSection.children.push(sourceSymbol);
                }
            }
        }

        return symbols;
    }
}
