// src/language-support/providers/formattingProvider.ts

import * as vscode from 'vscode';
import { Edk2FormatterCore } from '../core/edk2Formatter';
import { logError } from '../../shared/utils/logger';

export class Edk2DocumentFormattingProvider implements vscode.DocumentFormattingEditProvider {
    private formatter: Edk2FormatterCore;

    constructor() {
        this.formatter = new Edk2FormatterCore();
    }

    async provideDocumentFormattingEdits(
        document: vscode.TextDocument,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken
    ): Promise<vscode.TextEdit[]> {
        try {
            const fullText = document.getText();
            const formattedText = await this.formatter.formatContent(fullText, document.languageId);
            
            if (formattedText === fullText) {
                return []; // No changes needed
            }

            const fullRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(fullText.length)
            );

            return [vscode.TextEdit.replace(fullRange, formattedText)];
        } catch (error) {
            logError(`Formatting failed: ${error instanceof Error ? error.message : String(error)}`);
            return [];
        }
    }
}

export class Edk2DocumentRangeFormattingProvider implements vscode.DocumentRangeFormattingEditProvider {
    private formatter: Edk2FormatterCore;

    constructor() {
        this.formatter = new Edk2FormatterCore();
    }

    async provideDocumentRangeFormattingEdits(
        document: vscode.TextDocument,
        range: vscode.Range,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken
    ): Promise<vscode.TextEdit[]> {
        try {
            const rangeText = document.getText(range);
            const formattedText = await this.formatter.formatContent(rangeText, document.languageId);
            
            if (formattedText === rangeText) {
                return []; // No changes needed
            }

            return [vscode.TextEdit.replace(range, formattedText)];
        } catch (error) {
            logError(`Range formatting failed: ${error instanceof Error ? error.message : String(error)}`);
            return [];
        }
    }
}
