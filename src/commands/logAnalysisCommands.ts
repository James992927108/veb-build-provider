// src/commands/logAnalysisCommands.ts

import * as vscode from 'vscode';
import * as path from 'path';
import { logMessage, handleError } from '../utils/logger';
import { registerCommandWithLog } from '../utils/commandRegistry';
import { LogAnalyzer } from '../edk2Debug/analyzer/logAnalyzer';
import { HTMLReportGenerator } from '../edk2Debug/visualization/htmlReportGenerator';
import { JSONLogParser } from '../edk2Debug/analyzer/jsonLogParser';

export function registerLogAnalysisCommands(context: vscode.ExtensionContext): void {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

    if (!workspaceRoot) {
        logMessage("No workspace root found, skipping log analysis commands registration");
        return;
    }

    // Initialize log analyzer and report generator
    const logAnalyzer = new LogAnalyzer(workspaceRoot);
    const htmlReportGenerator = new HTMLReportGenerator();

    // Register all log analysis commands
    registerCommandWithLog(context, 'vebBuild.edk2Debug.analyzeLogFile', () => handleAnalyzeLogFile(logAnalyzer, htmlReportGenerator));
    registerCommandWithLog(context, 'vebBuild.edk2Debug.parseLogLine', handleParseLogLine);
    registerCommandWithLog(context, 'vebBuild.edk2Debug.showPerformanceAnalysis', () => handleShowPerformanceAnalysis(logAnalyzer));
    registerCommandWithLog(context, 'vebBuild.edk2Debug.batchAnalyzeLogs', () => handleBatchAnalyzeLogs(logAnalyzer));
}

// Command handlers
async function handleAnalyzeLogFile(logAnalyzer: LogAnalyzer, htmlReportGenerator: HTMLReportGenerator): Promise<void> {
    try {
        const fileUri = await vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            openLabel: 'Select EDK2 Debug log file for analysis',
            filters: {
                'Log Files': ['log', 'txt'],
                'All Files': ['*']
            }
        });

        if (!fileUri || !fileUri[0]) {
            return;
        }

        const logFilePath = fileUri[0].fsPath;
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

            const peiEvents = analysisResult.detailedTimeline?.filter(e => e.phase === 'PEI').length || 0;
            const dxeEvents = analysisResult.detailedTimeline?.filter(e => e.phase === 'DXE').length || 0;

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
            .sort(([, a], [, b]) => b.avgDuration - a.avgDuration)
            .slice(0, 5);

        if (topFunctions.length > 0) {
            message += `\nTop 5 most time-consuming functions:\n`;
            topFunctions.forEach(([name, metrics], index) => {
                message += `${index + 1}. ${name}: avg ${metrics.avgDuration.toFixed(2)}ms\n`;
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
