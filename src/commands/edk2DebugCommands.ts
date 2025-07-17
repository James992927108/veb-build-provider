// src/commands/edk2DebugCommands.ts

import * as vscode from 'vscode';
import * as path from 'path';
import { logMessage, handleError } from '../utils/logger';
import { registerCommandWithLog } from '../utils/commandRegistry';
import { Edk2ModuleProvider } from '../edk2Debug/provider/edk2ModuleProvider';
import { ModuleEnhancer } from '../edk2Debug/enhancer/moduleEnhancer';

export function registerEdk2DebugCommands(context: vscode.ExtensionContext): void {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    
    if (!workspaceRoot) {
        logMessage("No workspace root found, skipping EDK2 debug commands registration");
        return;
    }

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

    // Register all EDK2 debug commands
    registerCommandWithLog(context, 'vebBuild.edk2Debug.scanProject', () => handleScanProject(edk2ModuleProvider));
    registerCommandWithLog(context, 'vebBuild.edk2Debug.enhanceModule', (moduleNode) => handleEnhanceModule(edk2ModuleProvider, moduleNode));
    registerCommandWithLog(context, 'vebBuild.edk2Debug.restoreModuleEnhance', (moduleNode) => handleRestoreModuleEnhance(edk2ModuleProvider, moduleNode));
    registerCommandWithLog(context, 'vebBuild.edk2Debug.showStatistics', () => handleShowStatistics(edk2ModuleProvider));
    registerCommandWithLog(context, 'vebBuild.edk2Debug.searchModules', () => handleSearchModules(edk2ModuleProvider));
    registerCommandWithLog(context, 'vebBuild.edk2Debug.clearSearch', () => handleClearSearch(edk2ModuleProvider));
    registerCommandWithLog(context, 'vebBuild.edk2Debug.filterByModuleType', () => handleFilterByModuleType(edk2ModuleProvider));
    registerCommandWithLog(context, 'vebBuild.edk2Debug.filterByStatus', () => handleFilterByStatus(edk2ModuleProvider));
    
    // Auto-highlight active editor
    setupAutoHighlight(edk2TreeView, edk2ModuleProvider);

    // Auto scan (if enabled in settings)
    const config = vscode.workspace.getConfiguration('vebBuild.edk2Debug');
    if (config.get('autoScan', true)) {
        edk2ModuleProvider.refresh();
    }

    context.subscriptions.push(edk2TreeView);
}

// Command handlers
async function handleScanProject(edk2ModuleProvider: Edk2ModuleProvider): Promise<void> {
    try {
        logMessage("Starting project scan");
        await edk2ModuleProvider.refresh();
        logMessage("Project scan completed");
    } catch (error) {
        handleError(`Project scan failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function handleEnhanceModule(edk2ModuleProvider: Edk2ModuleProvider, moduleNode: any): Promise<void> {
    if (!moduleNode?.filePath) {
        vscode.window.showWarningMessage("No module selected for enhancement");
        return;
    }

    try {
        logMessage(`Starting enhancement for module: ${moduleNode.baseName || moduleNode.filePath}`);
        await edk2ModuleProvider.enhanceModule(moduleNode);
        vscode.window.showInformationMessage(`Enhanced module: ${moduleNode.baseName || moduleNode.filePath}`);
    } catch (error) {
        handleError(`Module enhancement failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function handleRestoreModuleEnhance(edk2ModuleProvider: Edk2ModuleProvider, moduleNode: any): Promise<void> {
    if (!moduleNode?.filePath) {
        vscode.window.showWarningMessage("No module selected for restoration");
        return;
    }

    try {
        const meta = await edk2ModuleProvider.getModuleByPath(moduleNode.filePath);
        if (!meta) {
            vscode.window.showWarningMessage('Cannot restore: module not found.');
            return;
        }

        await ModuleEnhancer.restore(meta);
        vscode.window.showInformationMessage('Restore complete.');
        await edk2ModuleProvider.refresh();
    } catch (error) {
        handleError(`Module restoration failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function handleShowStatistics(edk2ModuleProvider: Edk2ModuleProvider): Promise<void> {
    try {
        const stats = await edk2ModuleProvider.getProjectStatistics();
        const message = `EDK2 Module Statistics:\nTotal: ${stats.totalModules}\nEnhanced: ${stats.enhancedModules}`;
        vscode.window.showInformationMessage(message);
    } catch (error) {
        handleError(`Failed to get statistics: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function handleSearchModules(edk2ModuleProvider: Edk2ModuleProvider): Promise<void> {
    try {
        const searchTerm = await vscode.window.showInputBox({
            prompt: 'Search EDK2 modules (name, type, path)',
            placeHolder: 'Enter search term'
        });

        if (searchTerm !== undefined) {
            edk2ModuleProvider.searchModules(searchTerm);
        }
    } catch (error) {
        handleError(`Module search failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

function handleClearSearch(edk2ModuleProvider: Edk2ModuleProvider): void {
    try {
        edk2ModuleProvider.clearSearch();
        logMessage("Search cleared");
    } catch (error) {
        handleError(`Failed to clear search: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function handleFilterByModuleType(edk2ModuleProvider: Edk2ModuleProvider): Promise<void> {
    try {
        const types = Array.from(new Set(edk2ModuleProvider.getAllModulesSync().map(m => m.moduleType)));
        const picked = await vscode.window.showQuickPick(['All', ...types], { 
            placeHolder: 'Select ModuleType to filter' 
        });
        
        edk2ModuleProvider.setModuleTypeFilter(picked === 'All' ? undefined : picked);
    } catch (error) {
        handleError(`Module type filter failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function handleFilterByStatus(edk2ModuleProvider: Edk2ModuleProvider): Promise<void> {
    try {
        const picked = await vscode.window.showQuickPick(['All', 'Enhanced', 'Not Enhanced'], { 
            placeHolder: 'Select status to filter' 
        });
        
        let status: 'all' | 'enhanced' | 'notEnhanced' = 'all';
        if (picked === 'Enhanced') {
            status = 'enhanced';
        } else if (picked === 'Not Enhanced') {
            status = 'notEnhanced';
        }
        
        edk2ModuleProvider.setStatusFilter(status);
    } catch (error) {
        handleError(`Status filter failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

function setupAutoHighlight(edk2TreeView: vscode.TreeView<any>, edk2ModuleProvider: Edk2ModuleProvider): void {
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
                    // ignore reveal errors
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
                    // ignore reveal errors
                }
            }
        }
    });
}
