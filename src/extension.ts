// src/extension.ts

import * as vscode from 'vscode';
import { initLogger, disposeLogger, logMessage, outputChannel } from './utils/logger';
import { Edk2FdfDefinitionProvider, Edk2DscDefinitionProvider, Edk2DecDefinitionProvider, Edk2InfDefinitionProvider, Edk2VfrDefinitionProvider } from './edk2Language/edk2Language';
import { Edk2DscSymbolProvider, Edk2DecSymbolProvider, Edk2FdfSymbolProvider, Edk2InfSymbolProvider } from './edk2Language/edk2Language';
import { Edk2CCompletionItemProvider as Edk2CCompletionProvider } from './edk2Language/edk2Language';
import { registerAllCommands } from './commands';
import { registerStatusBarItems } from './ui/statusBar';

export function activate(context: vscode.ExtensionContext): void {
    initLogger(context);
    logMessage(`Extension activated at: ${new Date().toISOString()}`);

    outputChannel.show();

    // Edk2 language provider
    vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'edk2_fdf' }, new Edk2FdfDefinitionProvider());
    vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'edk2_dsc' }, new Edk2DscDefinitionProvider());
    vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'edk2_dec' }, new Edk2DecDefinitionProvider());
    vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'edk2_inf' }, new Edk2InfDefinitionProvider());
    vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'edk2_vfr' }, new Edk2VfrDefinitionProvider());

    vscode.languages.registerDocumentSymbolProvider({ scheme: 'file', language: 'edk2_dsc' }, new Edk2DscSymbolProvider());
    vscode.languages.registerDocumentSymbolProvider({ scheme: 'file', language: 'edk2_dec' }, new Edk2DecSymbolProvider());
    vscode.languages.registerDocumentSymbolProvider({ scheme: 'file', language: 'edk2_fdf' }, new Edk2FdfSymbolProvider());
    vscode.languages.registerDocumentSymbolProvider({ scheme: 'file', language: 'edk2_inf' }, new Edk2InfSymbolProvider());

    vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'c' }, new Edk2CCompletionProvider());
    vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'cpp' }, new Edk2CCompletionProvider());

    // VSBuild commands, formatter, debug, log analysis, snippet, etc.
    registerAllCommands(context);

    // Register Status Bar (InitTask(F8), VebBuild(F7), VebReBuild(F9), stopTerminal)
    registerStatusBarItems(context);

    // Set workspace context (if needed for UI)
    vscode.commands.executeCommand('setContext', 'vebBuild.hasEdk2Workspace', !!vscode.workspace.workspaceFolders?.length);
}

export function deactivate(): void {
    logMessage(`Extension deactivated at: ${new Date().toISOString()}`);
    disposeLogger();
}
