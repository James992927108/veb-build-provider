// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Edk2FdfDefinitionProvider, Edk2DscDefinitionProvider, Edk2DecDefinitionProvider, Edk2InfDefinitionProvider, Edk2VfrDefinitionProvider } from './edk2Language/edk2Language';
import { Edk2DscSymbolProvider, Edk2DecSymbolProvider, Edk2FdfSymbolProvider, Edk2InfSymbolProvider } from './edk2Language/edk2Language';
import { Edk2CCompletionItemProvider as Edk2CCompletionProvider } from './edk2Language/edk2Language';
import { logMessage, handleError, outputChannel } from './utils/logger';
import { handleInitTask, handleVebBuild, handleVebReBuild } from './VebBuild/initTask';
import { handleterminateTerminal } from './VebBuild/terminal';
import { expandMakefileVars } from './tools/expandMakefileVars';
import { SnippetTools } from "./tools/SnippetTools";
import { Edk2Formatter } from "./edk2Formatter/edk2Formatter";
import { registerStatusBarItems } from './VebBuild/ui/statusBar';
import { initializeEdk2Debug, EDK2_DEBUG_COMMANDS } from './edk2Debug';
/**
 * Registers a VS Code command and adds it to the subscriptions.
 * @param context The extension context.
 * @param commandId The command identifier.
 * @param handler The command handler function.
 */
function registerCommandWithLog(
    context: vscode.ExtensionContext,
    commandId: string,
    handler: (...args: any[]) => any
): void {
    const disposable = vscode.commands.registerCommand(commandId, handler);
    context.subscriptions.push(disposable);
    logMessage(`Registered command: ${commandId}`);
}

/**
 * Registers EDK2 debug-related commands with the VS Code extension context.
 * Each command displays an informational message indicating that its feature is ready.
 * 
 * @param context The VS Code extension context used to register the commands.
 */
function registerEdk2DebugCommands(context: vscode.ExtensionContext): void {
    registerCommandWithLog(context, EDK2_DEBUG_COMMANDS.SCAN_PROJECT, async () => {
        vscode.window.showInformationMessage('🔍 EDK2 project scan feature is ready!');
    });

    registerCommandWithLog(context, EDK2_DEBUG_COMMANDS.ENHANCE_MODULE, async () => {
        vscode.window.showInformationMessage('⚡ EDK2 module enhancement feature is ready!');
    });

    registerCommandWithLog(context, EDK2_DEBUG_COMMANDS.BATCH_ENHANCE, async () => {
        vscode.window.showInformationMessage('🚀 EDK2 batch enhancement feature is ready!');
    });
}

export function activate(context: vscode.ExtensionContext): void {
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

    // Register Commands
    registerCommandWithLog(context, 'extension.InitTask', handleInitTask);
    registerCommandWithLog(context, 'extension.VebBuild', handleVebBuild);
    registerCommandWithLog(context, 'extension.VebReBuild', handleVebReBuild);
    registerCommandWithLog(context, 'extension.terminateTerminal', handleterminateTerminal);
    // Register Status Bar (InitTask(F8), VebBuild(F7), VebReBuild(F9), terminateTerminal)
    registerStatusBarItems(context);

    registerCommandWithLog(context, 'formatter.Edk2Formatter', Edk2Formatter);
    registerCommandWithLog(context, 'SnippetTools.DebugToAsusPrint', () => new SnippetTools(vscode).DebugToAsusPrint());
    registerCommandWithLog(context, 'SnippetTools.AsusPrintToDebug', () => new SnippetTools(vscode).AsusPrintToDebug());
    registerCommandWithLog(context, 'extension.expandMakefileVars', () => { expandMakefileVars(); });

    initializeEdk2Debug();
    registerEdk2DebugCommands(context);
}

export function deactivate(): void {
    logMessage(`Extension deactivated at: ${new Date().toISOString()}`);
    outputChannel.dispose(); // Clean up output channel
}