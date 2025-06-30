// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { initLogger, disposeLogger, logMessage, handleError, outputChannel } from './utils/logger';
import { Edk2FdfDefinitionProvider, Edk2DscDefinitionProvider, Edk2DecDefinitionProvider, Edk2InfDefinitionProvider, Edk2VfrDefinitionProvider } from './edk2Language/edk2Language';
import { Edk2DscSymbolProvider, Edk2DecSymbolProvider, Edk2FdfSymbolProvider, Edk2InfSymbolProvider } from './edk2Language/edk2Language';
import { Edk2CCompletionItemProvider as Edk2CCompletionProvider } from './edk2Language/edk2Language';
import { handleInitTask, handleVebBuild, handleVebReBuild } from './VebBuild/initTask';
import { handleterminateTerminal } from './VebBuild/terminal';
import { expandMakefileVars } from './tools/expandMakefileVars';
import { SnippetTools } from './tools/SnippetTools';
import { Edk2Formatter } from './edk2Formatter/edk2Formatter';
import { registerStatusBarItems } from './VebBuild/ui/statusBar';

import { Edk2ModuleProvider } from './edk2Debug';
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

  // VSBuild commands and status bar
    registerCommandWithLog(context, 'extension.InitTask', handleInitTask);
    registerCommandWithLog(context, 'extension.VebBuild', handleVebBuild);
    registerCommandWithLog(context, 'extension.VebReBuild', handleVebReBuild);
    registerCommandWithLog(context, 'extension.terminateTerminal', handleterminateTerminal);
    // Register Status Bar (InitTask(F8), VebBuild(F7), VebReBuild(F9), terminateTerminal)
    registerStatusBarItems(context);

  // Formatter and snippets
    registerCommandWithLog(context, 'formatter.Edk2Formatter', Edk2Formatter);
    registerCommandWithLog(context, 'SnippetTools.DebugToAsusPrint', () => new SnippetTools(vscode).DebugToAsusPrint());
    registerCommandWithLog(context, 'SnippetTools.AsusPrintToDebug', () => new SnippetTools(vscode).AsusPrintToDebug());
    registerCommandWithLog(context, 'extension.expandMakefileVars', () => { expandMakefileVars(); });

    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    
    if (workspaceRoot) {
        // Initialize EDK2 module provider
        const edk2ModuleProvider = new Edk2ModuleProvider(workspaceRoot);

        // Tree view for EDK2 modules
        const edk2TreeView = vscode.window.createTreeView('vebBuildEdk2Modules', {
            treeDataProvider: edk2ModuleProvider,
            showCollapseAll: true,
            canSelectMany: true
        });

        // Scan command
        const scanEdk2Command = vscode.commands.registerCommand(
            'vebBuild.edk2Debug.scanProject',
            async () => {
                await edk2ModuleProvider.refresh();
            }
        );

        // Enhance module (placeholder for phase 3)
        const enhanceModuleCommand = vscode.commands.registerCommand(
            'vebBuild.edk2Debug.enhanceModule',
            async (moduleNode) => {
                if (moduleNode?.module) {
                    // TODO: Implement module enhancement feature (phase 3)
                    vscode.window.showInformationMessage(
                        `Ready to enhance module: ${moduleNode.module.name}`
                    );
                }
            }
        );

        // Show statistics
        const showStatsCommand = vscode.commands.registerCommand(
            'vebBuild.edk2Debug.showStatistics',
            async () => {
                const stats = await edk2ModuleProvider.getProjectStatistics();
                const message = `EDK2 Module Statistics:\nTotal: ${stats.totalModules}\nEnhanced: ${stats.enhancedModules}`;
                vscode.window.showInformationMessage(message);
            }
        );

        // Add to context.subscriptions
        context.subscriptions.push(
            edk2TreeView,
            scanEdk2Command,
            enhanceModuleCommand,
            showStatsCommand
        );

        // Set workspace context
        vscode.commands.executeCommand('setContext', 'vebBuild.hasEdk2Workspace', true);

        // Auto scan (if enabled in settings)
        const config = vscode.workspace.getConfiguration('vebBuild.edk2Debug');
        if (config.get('autoScan', true)) {
            edk2ModuleProvider.refresh();
        }
    }
}

export function deactivate(): void {
    logMessage(`Extension deactivated at: ${new Date().toISOString()}`);
    disposeLogger();
}