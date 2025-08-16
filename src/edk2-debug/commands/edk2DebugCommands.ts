// src/edk2-debug/commands/edk2DebugCommands.ts

import * as vscode from 'vscode';
import * as path from 'path';
import { logMessage, handleError } from '../../shared/utils/logger';
import { registerCommandWithLog } from '../../shared/utils/commandRegistry';
import { Edk2ModuleProvider } from '../core/edk2ModuleProvider';
import { EnhancedDebugProvider } from '../providers/enhancedDebugProvider';
import { ModuleEnhancer } from '../core/moduleEnhancer';
import { LogAnalyzer } from '../analysis/logAnalyzer';
import { HTMLReportGenerator } from '../analysis/htmlReportGenerator';
import { JSONLogParser } from '../analysis/jsonLogParser';

export function registerEdk2DebugCommands(context: vscode.ExtensionContext): void {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    
    if (!workspaceRoot) {
        logMessage("No workspace root found, skipping EDK2 debug commands registration");
        return;
    }

    // Initialize Enhanced Debug Provider (統一面板)
    const enhancedDebugProvider = new EnhancedDebugProvider(workspaceRoot, context);
    
    // Tree view for Enhanced Debug (取代原來的 EDK2 Modules)
    const enhancedDebugTreeView = vscode.window.createTreeView('vebBuildEnhancedDebug', {
        treeDataProvider: enhancedDebugProvider,
        showCollapseAll: true,
        canSelectMany: true
    });

    // Let provider know TreeView reference
    enhancedDebugProvider.setTreeView(enhancedDebugTreeView);

    // 設定 context 變數以控制按鈕顯示
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
    registerCommandWithLog(context, 'vebBuild.enhancedDebug.filterLogs', () => handleFilterLogs());
    registerCommandWithLog(context, 'vebBuild.enhancedDebug.jumpToSource', (jumpInfo) => handleJumpToSource(jumpInfo));
    registerCommandWithLog(context, 'vebBuild.enhancedDebug.jumpToLogLine', (jumpInfo) => enhancedDebugProvider.jumpToLogLine(jumpInfo));
    registerCommandWithLog(context, 'vebBuild.enhancedDebug.locateInTreeView', () => enhancedDebugProvider.locateInTreeView());
    registerCommandWithLog(context, 'vebBuild.enhancedDebug.changeLogOpenLocation', () => enhancedDebugProvider.changeLogFileOpenLocation());

    // Register module management commands (委託給 enhancedDebugProvider)
    registerCommandWithLog(context, 'vebBuild.edk2Debug.scanProject', () => handleScanProject(enhancedDebugProvider));
    registerCommandWithLog(context, 'vebBuild.edk2Debug.enhanceModule', (moduleNode) => handleEnhanceModule(enhancedDebugProvider, moduleNode));
    registerCommandWithLog(context, 'vebBuild.edk2Debug.restoreModuleEnhance', (moduleNode) => handleRestoreModuleEnhance(enhancedDebugProvider, moduleNode));
    registerCommandWithLog(context, 'vebBuild.edk2Debug.showStatistics', () => handleShowStatistics(enhancedDebugProvider));
    registerCommandWithLog(context, 'vebBuild.edk2Debug.searchModules', () => handleSearchModules(enhancedDebugProvider));
    registerCommandWithLog(context, 'vebBuild.edk2Debug.clearSearch', () => handleClearSearch(enhancedDebugProvider));
    registerCommandWithLog(context, 'vebBuild.edk2Debug.filterByModuleType', () => handleFilterByModuleType(enhancedDebugProvider));
    registerCommandWithLog(context, 'vebBuild.edk2Debug.filterByStatus', () => handleFilterByStatus(enhancedDebugProvider));
    
    // Register log analysis commands
    const logAnalyzer = new LogAnalyzer(workspaceRoot);
    const htmlReportGenerator = new HTMLReportGenerator();
    registerCommandWithLog(context, 'vebBuild.edk2Debug.analyzeLogFile', handleOpenLogFile);
    registerCommandWithLog(context, 'vebBuild.edk2Debug.parseLogLine', handleParseLogLine);
    registerCommandWithLog(context, 'vebBuild.edk2Debug.showPerformanceAnalysis', () => handleShowPerformanceAnalysis(logAnalyzer));
    registerCommandWithLog(context, 'vebBuild.edk2Debug.batchAnalyzeLogs', () => handleBatchAnalyzeLogs(logAnalyzer));
    
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
        logMessage("Starting project scan");
        await enhancedDebugProvider.refreshModules();
        logMessage("Project scan completed");
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
        logMessage(`Starting enhancement for module: ${moduleNode.baseName || moduleNode.filePath}`);
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
async function handleFilterLogs(): Promise<void> {
    try {
        // TODO: Implement log filtering functionality
        vscode.window.showInformationMessage('Log filtering functionality coming soon!');
    } catch (error) {
        handleError(`Log filtering failed: ${error instanceof Error ? error.message : String(error)}`);
    }
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

        logMessage(`Jumping to source: ${jumpInfo.module}:${jumpInfo.function}:${jumpInfo.line}`);
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
        logMessage("Search cleared");
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

// Log Analysis Command handlers (DEPRECATED - replaced with simple Open Log File)
/*
async function handleAnalyzeLogFile(logAnalyzer: LogAnalyzer, htmlReportGenerator: HTMLReportGenerator): Promise<void> {
    try {
        // const fileUri = await vscode.window.showOpenDialog({
        //     canSelectFiles: true,
        //     canSelectFolders: false,
        //     canSelectMany: false,
        //     openLabel: 'Select EDK2 Debug log file for analysis',
        //     filters: {
        //         'Log Files': ['log', 'txt'],
        //         'All Files': ['*']
        //     }
        // });

        // if (!fileUri || !fileUri[0]) {
        //     return;
        // }

        // const logFilePath = fileUri[0].fsPath;
        const logFilePath = "d:\\IpmiTool16-Jeff\\SoLLog\\172.16.122.170_20250710-12-47-28_log.txt";
        logMessage(`Starting enhanced log file analysis: ${logFilePath}`);

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Analyzing EDK2 Debug log...",
            cancellable: false
        }, async (progress) => {
            progress.report({ increment: 10, message: "Parsing PEI/DXE phase..." });

            const analysisResult = await logAnalyzer.analyzeLogFile(logFilePath);

            progress.report({ increment: 50, message: "Building timeline and call chain..." });

            const reportPath = path.join(path.dirname(logFilePath), `edk2_analysis_report_${Date.now()}.html`);
            await htmlReportGenerator.generateDebugReport(analysisResult, reportPath);

            progress.report({ increment: 100, message: "Analysis complete" });

            const peiEvents = analysisResult.detailedTimeline?.filter((e: any) => e.phase === 'PEI').length || 0;
            const dxeEvents = analysisResult.detailedTimeline?.filter((e: any) => e.phase === 'DXE').length || 0;

            const openReport = await vscode.window.showInformationMessage(
                `EDK2 log analysis complete!\n` +
                `Total functions: ${analysisResult.performance.totalFunctions}\n` +
                `PEI phase events: ${peiEvents}\n` +
                `DXE phase events: ${dxeEvents}\n` +
                `Error count: ${analysisResult.errors.length}`,
                'Open Report', 'Open in Browser'
            );

            if (openReport === 'Open Report') {
                const doc = await vscode.workspace.openTextDocument(reportPath);
                await vscode.window.showTextDocument(doc);
            } else if (openReport === 'Open in Browser') {
                vscode.env.openExternal(vscode.Uri.file(reportPath));
            }
        });
    } catch (error) {
        handleError(`Enhanced log file analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}
*/

async function handleParseLogLine(): Promise<void> {
    try {
        const logLine = await vscode.window.showInputBox({
            prompt: 'Enter a log line to parse',
            placeHolder: 'e.g.: 2024-01-01T12:00:00.000Z [MODULE] DEBUG_ENTRY: FunctionName()'
        });

        if (!logLine) {
            return;
        }

        const parsedEntry = JSONLogParser.parseLogLine(logLine);
        if (parsedEntry) {
            const result = `Parse result:\n` +
                `Timestamp: ${parsedEntry.timestamp}\n` +
                `Module: ${parsedEntry.module}\n` +
                `Function: ${parsedEntry.function}\n` +
                `Level: ${parsedEntry.level}\n` +
                `Message: ${parsedEntry.message}`;
            vscode.window.showInformationMessage(result);
        } else {
            vscode.window.showWarningMessage('Unable to parse the log line, please check the format.');
        }
    } catch (error) {
        handleError(`Log line parsing failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function handleShowPerformanceAnalysis(logAnalyzer: LogAnalyzer): Promise<void> {
    try {
        const fileUri = await vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            openLabel: 'Select log file for performance analysis',
            filters: {
                'Log Files': ['log', 'txt', 'json'],
                'All Files': ['*']
            }
        });

        if (!fileUri || !fileUri[0]) {
            return;
        }

        const analysisResult = await logAnalyzer.analyzeLogFile(fileUri[0].fsPath);
        const perf = analysisResult.performance;

        let message = `Performance analysis result:\n`;
        message += `Total functions: ${perf.totalFunctions}\n`;

        if (perf.bootTime) {
            message += `Boot time: ${perf.bootTime}ms\n`;
        }

        if (perf.criticalPath && perf.criticalPath.length > 0) {
            message += `Critical path: ${perf.criticalPath.slice(0, 3).join(' -> ')}${perf.criticalPath.length > 3 ? '...' : ''}\n`;
        }

        // Show top 5 most time-consuming functions
        const topFunctions = Object.entries(perf.functionMetrics)
            .sort(([, a], [, b]) => (b as any).avgDuration - (a as any).avgDuration)
            .slice(0, 5);

        if (topFunctions.length > 0) {
            message += `\nTop 5 most time-consuming functions:\n`;
            topFunctions.forEach(([name, metrics], index) => {
                message += `${index + 1}. ${name}: avg ${(metrics as any).avgDuration.toFixed(2)}ms\n`;
            });
        }

        vscode.window.showInformationMessage(message, { modal: true });
    } catch (error) {
        handleError(`Performance analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function handleBatchAnalyzeLogs(logAnalyzer: LogAnalyzer): Promise<void> {
    try {
        const folderUri = await vscode.window.showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            openLabel: 'Select a folder containing log files'
        });

        if (!folderUri || !folderUri[0]) {
            return;
        }

        const folderPath = folderUri[0].fsPath;
        const fs = require('fs');
        const logFiles = fs.readdirSync(folderPath)
            .filter((file: string) => /\.(log|txt|json)$/i.test(file))
            .map((file: string) => path.join(folderPath, file));

        if (logFiles.length === 0) {
            vscode.window.showWarningMessage('No log files found in the specified folder.');
            return;
        }

        const batchReportPath = path.join(folderPath, `batch_analysis_${Date.now()}.html`);
        let batchResults: any[] = [];

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Batch analyzing log files...",
            cancellable: false
        }, async (progress) => {
            for (let i = 0; i < logFiles.length; i++) {
                const logFile = logFiles[i];
                progress.report({
                    increment: (i / logFiles.length) * 100,
                    message: `Analyzing: ${path.basename(logFile)}`
                });

                try {
                    const result = await logAnalyzer.analyzeLogFile(logFile);
                    batchResults.push({
                        fileName: path.basename(logFile),
                        filePath: logFile,
                        summary: result.summary,
                        performance: result.performance,
                        errorCount: result.errors.length
                    });
                } catch (error) {
                    logMessage(`Batch analysis failed for ${logFile}: ${error}`);
                }
            }
        });

        await generateBatchReport(batchReportPath, logFiles, batchResults);

        const openReport = await vscode.window.showInformationMessage(
            `Batch analysis complete! Successfully analyzed ${batchResults.length}/${logFiles.length} files`,
            'Open Batch Report'
        );

        if (openReport === 'Open Batch Report') {
            vscode.env.openExternal(vscode.Uri.file(batchReportPath));
        }
    } catch (error) {
        handleError(`Batch log analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function generateBatchReport(batchReportPath: string, logFiles: string[], batchResults: any[]): Promise<void> {
    const fs = require('fs');

    const batchSummary = {
        title: 'Batch Log Analysis Report',
        generatedAt: new Date().toLocaleString('zh-TW'),
        totalFiles: logFiles.length,
        successfulAnalysis: batchResults.length,
        results: batchResults
    };

    const batchReportHtml = `<!DOCTYPE html>
<html>
<head>
    <title>Batch Log Analysis Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .summary { background-color: #e8f4f8; padding: 15px; margin: 20px 0; }
        .file-section { margin: 20px 0; padding: 15px; border: 1px solid #ccc; }
    </style>
</head>
<body>
    <h1>${batchSummary.title}</h1>
    
    <div class="summary">
        <h2>Summary</h2>
        <p>Generated at: ${batchSummary.generatedAt}</p>
        <p>Total files: ${batchSummary.totalFiles}</p>
        <p>Successfully analyzed: ${batchSummary.successfulAnalysis}</p>
    </div>
    
    <h2>Detailed Results</h2>
    ${batchResults.map(result => `
        <div class="file-section">
            <h3>${result.fileName}</h3>
            <table>
                <tr><th>Item</th><th>Value</th></tr>
                <tr><td>Total functions</td><td>${result.performance.totalFunctions}</td></tr>
                <tr><td>Error count</td><td>${result.errorCount}</td></tr>
                ${result.performance.bootTime ? `<tr><td>Boot time</td><td>${result.performance.bootTime}ms</td></tr>` : ''}
            </table>
        </div>
    `).join('')}
</body>
</html>`;

    fs.writeFileSync(batchReportPath, batchReportHtml, 'utf-8');
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
        logMessage(`Opened log file: ${selectedFileUri.fsPath}`);
    } catch (error) {
        handleError(`Failed to open log file: ${error instanceof Error ? error.message : String(error)}`);
    }
}
