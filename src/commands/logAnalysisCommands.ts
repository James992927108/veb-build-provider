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
            openLabel: '選擇日誌檔案進行分析',
            filters: {
                'Log Files': ['log', 'txt', 'json'],
                'All Files': ['*']
            }
        });

        if (!fileUri || !fileUri[0]) {
            return;
        }

        const logFilePath = fileUri[0].fsPath;
        logMessage(`Starting log file analysis: ${logFilePath}`);

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "分析日誌檔案中...",
            cancellable: false
        }, async (progress) => {
            progress.report({ increment: 10, message: "正在解析日誌格式..." });

            const analysisResult = await logAnalyzer.analyzeLogFile(logFilePath);

            progress.report({ increment: 50, message: "正在生成分析報告..." });

            const reportPath = path.join(path.dirname(logFilePath), `analysis_report_${Date.now()}.html`);
            await htmlReportGenerator.generateDebugReport(analysisResult, reportPath);

            progress.report({ increment: 100, message: "分析完成" });

            const openReport = await vscode.window.showInformationMessage(
                `日誌分析完成！\n總函數數量: ${analysisResult.performance.totalFunctions}\n錯誤數量: ${analysisResult.errors.length}`,
                '開啟報告', '在瀏覽器中開啟'
            );

            if (openReport === '開啟報告') {
                const doc = await vscode.workspace.openTextDocument(reportPath);
                await vscode.window.showTextDocument(doc);
            } else if (openReport === '在瀏覽器中開啟') {
                vscode.env.openExternal(vscode.Uri.file(reportPath));
            }
        });
    } catch (error) {
        handleError(`Log file analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function handleParseLogLine(): Promise<void> {
    try {
        const logLine = await vscode.window.showInputBox({
            prompt: '輸入日誌行進行解析測試',
            placeHolder: '例如: 2024-01-01T12:00:00.000Z [MODULE] DEBUG_ENTRY: FunctionName()'
        });

        if (!logLine) {
            return;
        }

        const parsedEntry = JSONLogParser.parseLogLine(logLine);
        if (parsedEntry) {
            const result = `解析結果:\n` +
                `時間戳: ${parsedEntry.timestamp}\n` +
                `模組: ${parsedEntry.module}\n` +
                `函數: ${parsedEntry.function}\n` +
                `等級: ${parsedEntry.level}\n` +
                `訊息: ${parsedEntry.message}`;
            vscode.window.showInformationMessage(result);
        } else {
            vscode.window.showWarningMessage('無法解析該日誌行，請檢查格式是否正確。');
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
            openLabel: '選擇日誌檔案進行效能分析',
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

        let message = `效能分析結果:\n`;
        message += `總函數數量: ${perf.totalFunctions}\n`;
        
        if (perf.bootTime) {
            message += `啟動時間: ${perf.bootTime}ms\n`;
        }
        
        if (perf.criticalPath && perf.criticalPath.length > 0) {
            message += `關鍵路徑: ${perf.criticalPath.slice(0, 3).join(' -> ')}${perf.criticalPath.length > 3 ? '...' : ''}\n`;
        }

        // 顯示前5個最耗時的函數
        const topFunctions = Object.entries(perf.functionMetrics)
            .sort(([, a], [, b]) => b.avgDuration - a.avgDuration)
            .slice(0, 5);

        if (topFunctions.length > 0) {
            message += `\n最耗時函數 (前5名):\n`;
            topFunctions.forEach(([name, metrics], index) => {
                message += `${index + 1}. ${name}: 平均 ${metrics.avgDuration.toFixed(2)}ms\n`;
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
            openLabel: '選擇包含日誌檔案的資料夾'
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
            vscode.window.showWarningMessage('在指定資料夾中沒有找到日誌檔案。');
            return;
        }

        const batchReportPath = path.join(folderPath, `batch_analysis_${Date.now()}.html`);
        let batchResults: any[] = [];

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "批量分析日誌檔案...",
            cancellable: false
        }, async (progress) => {
            for (let i = 0; i < logFiles.length; i++) {
                const logFile = logFiles[i];
                progress.report({
                    increment: (i / logFiles.length) * 100,
                    message: `正在分析: ${path.basename(logFile)}`
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
            `批量分析完成！成功分析 ${batchResults.length}/${logFiles.length} 個檔案`,
            '開啟批量報告'
        );

        if (openReport === '開啟批量報告') {
            vscode.env.openExternal(vscode.Uri.file(batchReportPath));
        }
    } catch (error) {
        handleError(`Batch log analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function generateBatchReport(batchReportPath: string, logFiles: string[], batchResults: any[]): Promise<void> {
    const fs = require('fs');
    
    const batchSummary = {
        title: '批量日誌分析報告',
        generatedAt: new Date().toLocaleString('zh-TW'),
        totalFiles: logFiles.length,
        successfulAnalysis: batchResults.length,
        results: batchResults
    };

    const batchReportHtml = `<!DOCTYPE html>
<html>
<head>
    <title>批量日誌分析報告</title>
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
        <h2>摘要</h2>
        <p>生成時間: ${batchSummary.generatedAt}</p>
        <p>總檔案數: ${batchSummary.totalFiles}</p>
        <p>成功分析: ${batchSummary.successfulAnalysis}</p>
    </div>
    
    <h2>詳細結果</h2>
    ${batchResults.map(result => `
        <div class="file-section">
            <h3>${result.fileName}</h3>
            <table>
                <tr><th>項目</th><th>值</th></tr>
                <tr><td>總函數數</td><td>${result.performance.totalFunctions}</td></tr>
                <tr><td>錯誤數量</td><td>${result.errorCount}</td></tr>
                ${result.performance.bootTime ? `<tr><td>啟動時間</td><td>${result.performance.bootTime}ms</td></tr>` : ''}
            </table>
        </div>
    `).join('')}
</body>
</html>`;

    fs.writeFileSync(batchReportPath, batchReportHtml, 'utf-8');
}
