// src/edk2-debug/commands/edk2DebugCommands.ts

import * as vscode from 'vscode';
import * as path from 'path';
import { logMessage, handleError } from '../../shared/utils/logger';
import { registerCommandWithLog } from '../../shared/utils/commandRegistry';
import { Edk2ModuleProvider } from '../core/edk2ModuleProvider';
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
    
    // Register log analysis commands
    const logAnalyzer = new LogAnalyzer(workspaceRoot);
    const htmlReportGenerator = new HTMLReportGenerator();
    registerCommandWithLog(context, 'vebBuild.edk2Debug.analyzeLogFile', () => handleAnalyzeLogFile(logAnalyzer, htmlReportGenerator));
    registerCommandWithLog(context, 'vebBuild.edk2Debug.parseLogLine', handleParseLogLine);
    registerCommandWithLog(context, 'vebBuild.edk2Debug.showPerformanceAnalysis', () => handleShowPerformanceAnalysis(logAnalyzer));
    registerCommandWithLog(context, 'vebBuild.edk2Debug.batchAnalyzeLogs', () => handleBatchAnalyzeLogs(logAnalyzer));
    
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

// Log Analysis Command handlers
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
