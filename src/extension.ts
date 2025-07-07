// src/extension.ts

import * as vscode from 'vscode';
import { initLogger, disposeLogger, logMessage, outputChannel } from './utils/logger';
import { registerLanguageProviders } from './providers/languageProviders';
import { registerAllCommands } from './commands';
import { registerStatusBarItems } from './ui/statusBar';

export function activate(context: vscode.ExtensionContext): void {
    initLogger(context);
    logMessage(`Extension activated at: ${new Date().toISOString()}`);

    outputChannel.show();

    // Register language providers (Definition, Symbol, Completion)
    registerLanguageProviders(context);

    // Register all commands (build, formatter, debug, log analysis, etc.)
    registerAllCommands(context);

    // Register Status Bar (InitTask(F8), VebBuild(F7), VebReBuild(F9), stopTerminal)
    registerStatusBarItems(context);

    // Set workspace context (if needed for UI)
    vscode.commands.executeCommand('setContext', 'vebBuild.hasEdk2Workspace', !!vscode.workspace.workspaceFolders?.length);

    logMessage('Extension activation completed successfully');
}

export function deactivate(): void {
    logMessage(`Extension deactivated at: ${new Date().toISOString()}`);
    disposeLogger();
}
