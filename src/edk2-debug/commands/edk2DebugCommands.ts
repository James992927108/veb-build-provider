// src/edk2-debug/commands/edk2DebugCommands.ts

import * as vscode from 'vscode';
import * as path from 'path';
import { logInfo, logDebug, logError, logSummary, handleError } from '../../shared/utils/logger';
import { registerCommandWithLog } from '../../shared/utils/commandRegistry';
import { Edk2ModuleProvider } from '../core/edk2ModuleProvider';
import { EnhancedDebugProvider } from '../providers/enhancedDebugProvider';
import { ModuleEnhancer } from '../core/moduleEnhancer';

export function registerEdk2DebugCommands(context: vscode.ExtensionContext): void {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    
    if (!workspaceRoot) {
        logError("No workspace root found, skipping EDK2 debug commands registration");
        return;
    }

    // Initialize Enhanced Debug Provider (unified panel)
    const enhancedDebugProvider = new EnhancedDebugProvider(workspaceRoot, context);
    
    // Tree view for Enhanced Debug (replaces original EDK2 Modules)
    const enhancedDebugTreeView = vscode.window.createTreeView('vebBuildEnhancedDebug', {
        treeDataProvider: enhancedDebugProvider,
        showCollapseAll: true,
        canSelectMany: true
    });

    // Let provider know TreeView reference
    enhancedDebugProvider.setTreeView(enhancedDebugTreeView);

    // Set context variables to control button display
    const updateContexts = () => {
        const mode = enhancedDebugProvider.getCurrentMode();
        vscode.commands.executeCommand('setContext', 'enhancedDebug.mode', mode);
    };
    updateContexts();

    // Register Enhanced Debug panel commands
    registerCommandWithLog(context, 'vebBuild.enhancedDebug.switchToModules', async () => {
        await enhancedDebugProvider.switchMode('modules');
        updateContexts();
    });
    registerCommandWithLog(context, 'vebBuild.enhancedDebug.switchToLogs', async () => {
        await enhancedDebugProvider.switchMode('logs');
        updateContexts();
    });
    registerCommandWithLog(context, 'vebBuild.enhancedDebug.openLogFile', () => enhancedDebugProvider.openLogFile());
    registerCommandWithLog(context, 'vebBuild.enhancedDebug.filterLogs', () => handleFilterLogs(enhancedDebugProvider));
    registerCommandWithLog(context, 'vebBuild.enhancedDebug.jumpToSource', (jumpInfo) => handleJumpToSource(jumpInfo));
    registerCommandWithLog(context, 'vebBuild.enhancedDebug.jumpToLogLine', (jumpInfo) => enhancedDebugProvider.jumpToLogLine(jumpInfo));
    registerCommandWithLog(context, 'vebBuild.enhancedDebug.locateInTreeView', () => enhancedDebugProvider.locateInTreeView());
    registerCommandWithLog(context, 'vebBuild.enhancedDebug.changeLogOpenLocation', () => enhancedDebugProvider.changeLogFileOpenLocation());

    // Register module management commands (delegated to enhancedDebugProvider)
    registerCommandWithLog(context, 'vebBuild.edk2Debug.scanProject', () => handleScanProject(enhancedDebugProvider));
    registerCommandWithLog(context, 'vebBuild.edk2Debug.enhanceModule', (moduleNode) => handleEnhanceModule(enhancedDebugProvider, moduleNode));
    registerCommandWithLog(context, 'vebBuild.edk2Debug.restoreModuleEnhance', (moduleNode) => handleRestoreModuleEnhance(enhancedDebugProvider, moduleNode));
    registerCommandWithLog(context, 'vebBuild.edk2Debug.showStatistics', () => handleShowStatistics(enhancedDebugProvider));
    registerCommandWithLog(context, 'vebBuild.edk2Debug.searchModules', () => handleSearchModules(enhancedDebugProvider));
    registerCommandWithLog(context, 'vebBuild.edk2Debug.clearSearch', () => handleClearSearch(enhancedDebugProvider));
    registerCommandWithLog(context, 'vebBuild.edk2Debug.filterByModuleType', () => handleFilterByModuleType(enhancedDebugProvider));
    registerCommandWithLog(context, 'vebBuild.edk2Debug.filterByStatus', () => handleFilterByStatus(enhancedDebugProvider));
    
    // Register log analysis commands
    registerCommandWithLog(context, 'vebBuild.edk2Debug.analyzeLogFile', handleOpenLogFile);
    
    // Auto-highlight active editor
    setupAutoHighlight(enhancedDebugTreeView, enhancedDebugProvider);

    // Auto scan (if enabled in settings)
    const config = vscode.workspace.getConfiguration('vebBuild.edk2Debug');
    if (config.get('autoScan', true)) {
        enhancedDebugProvider.refreshModules();
    }

    // Listen for editor changes to update status bar
    const onDidChangeActiveEditor = vscode.window.onDidChangeActiveTextEditor(() => {
        enhancedDebugProvider.updateStatusBarItem();
    });

    context.subscriptions.push(enhancedDebugTreeView, onDidChangeActiveEditor);
}

// Command handlers
async function handleScanProject(enhancedDebugProvider: EnhancedDebugProvider): Promise<void> {
    try {
        logInfo("Starting project scan");
        await enhancedDebugProvider.refreshModules();
        logInfo("Project scan completed");
    } catch (error) {
        handleError(`Project scan failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function handleEnhanceModule(enhancedDebugProvider: EnhancedDebugProvider, moduleNode: any): Promise<void> {
    if (!moduleNode?.filePath) {
        vscode.window.showWarningMessage("No module selected for enhancement");
        return;
    }

    try {
        logInfo(`Starting enhancement for module: ${moduleNode.baseName || moduleNode.filePath}`);
        await enhancedDebugProvider.enhanceModule(moduleNode);
        vscode.window.showInformationMessage(`Enhanced module: ${moduleNode.baseName || moduleNode.filePath}`);
    } catch (error) {
        handleError(`Module enhancement failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function handleRestoreModuleEnhance(enhancedDebugProvider: EnhancedDebugProvider, moduleNode: any): Promise<void> {
    if (!moduleNode?.filePath) {
        vscode.window.showWarningMessage("No module selected for restoration");
        return;
    }

    try {
        const meta = await enhancedDebugProvider.getModuleByPath(moduleNode.filePath);
        if (!meta) {
            vscode.window.showWarningMessage('Cannot restore: module not found.');
            return;
        }

        await ModuleEnhancer.restore(meta);
        vscode.window.showInformationMessage('Restore complete.');
        await enhancedDebugProvider.refreshModules();
    } catch (error) {
        handleError(`Module restoration failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

// New Enhanced Debug command handlers
async function handleFilterLogs(enhancedDebugProvider: EnhancedDebugProvider): Promise<void> {
    await enhancedDebugProvider.filterLogs();
}

async function handleJumpToSource(jumpInfo: any): Promise<void> {
    try {
        if (!jumpInfo || !jumpInfo.module || !jumpInfo.function || !jumpInfo.line) {
            vscode.window.showWarningMessage('Invalid jump information provided');
            return;
        }

        // Use existing jump-to-source functionality
        const jumpToSourceCommand = vscode.commands.getCommands().then(commands => {
            if (commands.includes('vebBuild.enhancedDebug.jumpToSourceFromLog')) {
                return vscode.commands.executeCommand('vebBuild.enhancedDebug.jumpToSourceFromLog', jumpInfo);
            } else {
                // Fallback: try to find and open the source file manually
                return findAndOpenSourceFile(jumpInfo);
            }
        });

        logDebug(`Jumping to source: ${jumpInfo.module}:${jumpInfo.function}:${jumpInfo.line}`);
    } catch (error) {
        handleError(`Jump to source failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function findAndOpenSourceFile(jumpInfo: any): Promise<void> {
    // Simple fallback implementation - try to find C files with the module name
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceRoot) return;

    const searchPattern = `**/${jumpInfo.module}*.c`;
    const files = await vscode.workspace.findFiles(searchPattern, null, 10);
    
    if (files.length === 0) {
        vscode.window.showWarningMessage(`Source file for module "${jumpInfo.module}" not found`);
        return;
    }

    let targetFile = files[0];
    if (files.length > 1) {
        const picks = files.map(file => ({
            label: path.basename(file.fsPath),
            description: file.fsPath,
            uri: file
        }));
        
        const selected = await vscode.window.showQuickPick(picks, {
            placeHolder: `Multiple files found for module "${jumpInfo.module}". Select one:`
        });
        
        if (selected) {
            targetFile = selected.uri;
        }
    }

    const document = await vscode.workspace.openTextDocument(targetFile);
    const editor = await vscode.window.showTextDocument(document);
    
    // Try to go to the specific line
    if (jumpInfo.line && jumpInfo.line > 0) {
        const line = Math.min(jumpInfo.line - 1, document.lineCount - 1);
        const position = new vscode.Position(line, 0);
        editor.selection = new vscode.Selection(position, position);
        editor.revealRange(new vscode.Range(position, position), vscode.TextEditorRevealType.InCenter);
    }
}

async function handleShowStatistics(enhancedDebugProvider: EnhancedDebugProvider): Promise<void> {
    try {
        const stats = await enhancedDebugProvider.getProjectStatistics();
        const message = `EDK2 Module Statistics:\nTotal: ${stats.totalModules}\nEnhanced: ${stats.enhancedModules}`;
        vscode.window.showInformationMessage(message);
    } catch (error) {
        handleError(`Failed to get statistics: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function handleSearchModules(enhancedDebugProvider: EnhancedDebugProvider): Promise<void> {
    try {
        const searchTerm = await vscode.window.showInputBox({
            prompt: 'Search EDK2 modules (name, type, path)',
            placeHolder: 'Enter search term'
        });

        if (searchTerm !== undefined) {
            enhancedDebugProvider.searchModules(searchTerm);
        }
    } catch (error) {
        handleError(`Module search failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

function handleClearSearch(enhancedDebugProvider: EnhancedDebugProvider): void {
    try {
        enhancedDebugProvider.clearModuleSearch();
        logInfo("Search cleared");
    } catch (error) {
        handleError(`Failed to clear search: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function handleFilterByModuleType(enhancedDebugProvider: EnhancedDebugProvider): Promise<void> {
    try {
        const types = Array.from(new Set(enhancedDebugProvider.getAllModulesSync().map(m => m.moduleType)));
        const picked = await vscode.window.showQuickPick(['All', ...types], { 
            placeHolder: 'Select ModuleType to filter' 
        });
        
        enhancedDebugProvider.setModuleTypeFilter(picked === 'All' ? undefined : picked);
    } catch (error) {
        handleError(`Module type filter failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function handleFilterByStatus(enhancedDebugProvider: EnhancedDebugProvider): Promise<void> {
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
        
        enhancedDebugProvider.setModuleStatusFilter(status);
    } catch (error) {
        handleError(`Status filter failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

function setupAutoHighlight(enhancedDebugTreeView: vscode.TreeView<any>, enhancedDebugProvider: EnhancedDebugProvider): void {
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

        // If the Enhanced Debug TreeView is visible, immediately sync highlight
        if (enhancedDebugTreeView.visible) {
            const module = await enhancedDebugProvider.getModuleByPath(filePath);
            if (module) {
                try {
                    await enhancedDebugTreeView.reveal(module, { select: true, focus: true, expand: false });
                } catch (err) {
                    // ignore reveal errors
                }
            }
        }
    });

    enhancedDebugTreeView.onDidChangeVisibility(async (e) => {
        if (e.visible && lastActiveInfPath) {
            const module = await enhancedDebugProvider.getModuleByPath(lastActiveInfPath);
            if (module) {
                try {
                    await enhancedDebugTreeView.reveal(module, { select: true, focus: true, expand: false });
                } catch (err) {
                    // ignore reveal errors
                }
            }
        }
    });
}


// Simple log file opener (replaces complex analysis)
async function handleOpenLogFile(): Promise<void> {
    try {
        const fileUri = await vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            openLabel: 'Select EDK2 Log File',
            filters: {
                'Log Files': ['log', 'txt'],
                'All Files': ['*']
            }
        });

        if (!fileUri || fileUri.length === 0) {
            // User cancelled the dialog
            return;
        }

        const selectedFileUri = fileUri[0];
        await vscode.window.showTextDocument(selectedFileUri);
        logInfo(`Opened log file: ${selectedFileUri.fsPath}`);
    } catch (error) {
        handleError(`Failed to open log file: ${error instanceof Error ? error.message : String(error)}`);
    }
}
