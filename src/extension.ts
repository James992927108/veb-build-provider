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

import { Edk2ModuleProvider } from './edk2Debug/provider/edk2ModuleProvider';
import { ModuleEnhancer } from './edk2Debug/enhancer/moduleEnhancer';

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

        // Let provider know TreeView reference for updating message
        edk2ModuleProvider.setTreeView(edk2TreeView);

        let lastActiveInfPath: string | undefined = undefined;

        vscode.window.onDidChangeActiveTextEditor(async (editor) => {
            if (!editor) {
                return;
            }
            const filePath = editor.document.uri.fsPath;
            if (!filePath.toLowerCase().endsWith('.inf')) {
                return;
            }

            lastActiveInfPath = filePath;

            // If the Veb Build TreeView is visible, immediately sync highlight
            if (edk2TreeView.visible) {
                const module = await edk2ModuleProvider.getModuleByPath(filePath);
                if (module) {
                    try {
                        await edk2TreeView.reveal(module, { select: true, focus: true, expand: false });
                    } catch (err) {
                        // ignore
                    }
                }
            }
        });

        edk2TreeView.onDidChangeVisibility(async (e) => {
            if (e.visible && lastActiveInfPath) {
                const module = await edk2ModuleProvider.getModuleByPath(lastActiveInfPath);
                if (module) {
                    try {
                        await edk2TreeView.reveal(module, { select: true, focus: true, expand: false });
                    } catch (err) {
                        // ignore
                    }
                }
            }
        });

        // Unified command registration for EDK2 debug features
        registerCommandWithLog(context, 'vebBuild.edk2Debug.scanProject', async () => {
            await edk2ModuleProvider.refresh();
        });

        registerCommandWithLog(context, 'vebBuild.edk2Debug.enhanceModule', async (moduleNode) => {
            if (moduleNode && moduleNode.filePath) {
                logMessage(`Starting enhancement for module: ${moduleNode.baseName || moduleNode.filePath}`);
                await edk2ModuleProvider.enhanceModule(moduleNode);
                vscode.window.showInformationMessage(`Enhanced module: ${moduleNode.baseName || moduleNode.filePath}`);
            }
        });

        // Register restore command
        const restoreEnhanceCommand = vscode.commands.registerCommand(
            'vebBuild.edk2Debug.restoreModuleEnhance',
            async (moduleNode) => {
                if (!moduleNode?.filePath) {
                    return;
                }
                const meta = await edk2ModuleProvider.getModuleByPath(moduleNode.filePath);
                if (!meta) {
                    vscode.window.showWarningMessage('Cannot restore: module not found.');
                    return;
                }
                const result = await ModuleEnhancer.restore(meta);
                if (result.success) {
                    vscode.window.showInformationMessage('Restore complete.');
                    await edk2ModuleProvider.refresh();
                } else {
                    vscode.window.showWarningMessage('Restore failed:\n' + result.errors.join('\n'));
                }
            }
        );
        context.subscriptions.push(restoreEnhanceCommand);

        registerCommandWithLog(context, 'vebBuild.edk2Debug.showStatistics', async () => {
            const stats = await edk2ModuleProvider.getProjectStatistics();
            const message = `EDK2 Module Statistics:\nTotal: ${stats.totalModules}\nEnhanced: ${stats.enhancedModules}`;
            vscode.window.showInformationMessage(message);
        });

        context.subscriptions.push(edk2TreeView);

        // Inside activate function, after creating edk2ModuleProvider
        const searchCommand = vscode.commands.registerCommand(
            'vebBuild.edk2Debug.searchModules',
            async () => {
                const searchTerm = await vscode.window.showInputBox({
                    prompt: 'Search EDK2 modules (name, type, path)',
                    placeHolder: 'Enter search term'
                });

                if (searchTerm !== undefined) { // User didn't cancel
                    edk2ModuleProvider.searchModules(searchTerm);
                }
            }
        );

        const clearSearchCommand = vscode.commands.registerCommand(
            'vebBuild.edk2Debug.clearSearch',
            () => {
                edk2ModuleProvider.clearSearch();
            }
        );
        // Update context subscriptions
        context.subscriptions.push(
            searchCommand,
            clearSearchCommand
        );

        registerCommandWithLog(context, 'vebBuild.edk2Debug.filterByModuleType', async () => {
            const types = Array.from(new Set(edk2ModuleProvider.getAllModulesSync().map(m => m.moduleType)));
            const picked = await vscode.window.showQuickPick(['All', ...types], { placeHolder: 'Select ModuleType to filter' });
            edk2ModuleProvider.setModuleTypeFilter(picked === 'All' ? undefined : picked);
        });

        registerCommandWithLog(context, 'vebBuild.edk2Debug.filterByStatus', async () => {
            const picked = await vscode.window.showQuickPick(['All', 'Enhanced', 'Not Enhanced'], { placeHolder: 'Select status to filter' });
            let status: 'all' | 'enhanced' | 'notEnhanced' = 'all';
            if (picked === 'Enhanced') {
                status = 'enhanced';
            } else if (picked === 'Not Enhanced') {
                status = 'notEnhanced';
            }
            edk2ModuleProvider.setStatusFilter(status);
        });
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