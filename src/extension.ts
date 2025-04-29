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

    // Register commands
    registerCommandWithLog(context, 'extension.InitTask', handleInitTask);
    registerCommandWithLog(context, 'extension.VebBuild', handleVebBuild);
    registerCommandWithLog(context, 'extension.VebReBuild', handleVebReBuild);
    registerCommandWithLog(context, 'extension.terminateTerminal', handleterminateTerminal);

    // Create status bar button for ReBuild
    const runRebuildButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    runRebuildButton.command = 'extension.VebReBuild';
    runRebuildButton.text = '$(play) Run Veb ReBuild';
    runRebuildButton.tooltip = 'Click to run Veb ReBuild';
    runRebuildButton.show();
    context.subscriptions.push(runRebuildButton);
    logMessage("Created status bar button: Run Veb ReBuild");

    // Create status bar button for terminating terminal
    const closeTerminalButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99);
    closeTerminalButton.text = "$(stop) Close Terminal";
    closeTerminalButton.tooltip = "Terminate the active terminal";
    closeTerminalButton.command = "extension.terminateTerminal";
    closeTerminalButton.show();
    context.subscriptions.push(closeTerminalButton);
    logMessage("Created status bar button: Close Terminal");

    registerCommandWithLog(context, 'formatter.Edk2Formatter', Edk2Formatter);
    registerCommandWithLog(context, 'SnippetTools.DebugToAsusPrint', () => new SnippetTools(vscode).DebugToAsusPrint());
    registerCommandWithLog(context, 'SnippetTools.AsusPrintToDebug', () => new SnippetTools(vscode).AsusPrintToDebug());
    registerCommandWithLog(context, 'extension.expandMakefileVars', () => { expandMakefileVars(); });
}

export function deactivate(): void {
    logMessage(`Extension deactivated at: ${new Date().toISOString()}`);
    outputChannel.dispose(); // Clean up output channel
}