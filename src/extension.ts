// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
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

// 新增日誌分析相關import
import { LogAnalyzer } from './edk2Debug/analyzer/logAnalyzer';
import { HTMLReportGenerator } from './edk2Debug/visualization/htmlReportGenerator';
import { JSONLogParser } from './edk2Debug/analyzer/jsonLogParser';

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
        
        // Initialize Log Analyzer
        const logAnalyzer = new LogAnalyzer(workspaceRoot);
        const htmlReportGenerator = new HTMLReportGenerator();

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

        // === 新增日誌分析相關命令 ===
        
        // 1. 日誌檔案分析命令
        registerCommandWithLog(context, 'vebBuild.edk2Debug.analyzeLogFile', async () => {
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

            if (fileUri && fileUri[0]) {
                const logFilePath = fileUri[0].fsPath;
                logMessage(`開始分析日誌檔案: ${logFilePath}`);
                
                try {
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
                    vscode.window.showErrorMessage(`日誌分析失敗: ${error}`);
                    logMessage(`日誌分析錯誤: ${error}`);
                }
            }
        });

        // 2. 即時日誌解析命令
        registerCommandWithLog(context, 'vebBuild.edk2Debug.parseLogLine', async () => {
            const logLine = await vscode.window.showInputBox({
                prompt: '輸入日誌行進行解析測試',
                placeHolder: '例如: 2024-01-01T12:00:00.000Z [MODULE] DEBUG_ENTRY: FunctionName()'
            });

            if (logLine) {
                try {
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
                    vscode.window.showErrorMessage(`解析錯誤: ${error}`);
                }
            }
        });

        // 3. 效能分析命令
        registerCommandWithLog(context, 'vebBuild.edk2Debug.showPerformanceAnalysis', async () => {
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

            if (fileUri && fileUri[0]) {
                try {
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
                        .sort(([,a], [,b]) => b.avgDuration - a.avgDuration)
                        .slice(0, 5);
                    
                    if (topFunctions.length > 0) {
                        message += `\n最耗時函數 (前5名):\n`;
                        topFunctions.forEach(([name, metrics], index) => {
                            message += `${index + 1}. ${name}: 平均 ${metrics.avgDuration.toFixed(2)}ms\n`;
                        });
                    }
                    
                    vscode.window.showInformationMessage(message, { modal: true });
                } catch (error) {
                    vscode.window.showErrorMessage(`效能分析失敗: ${error}`);
                }
            }
        });

        // 4. 批量日誌分析命令
        registerCommandWithLog(context, 'vebBuild.edk2Debug.batchAnalyzeLogs', async () => {
            const folderUri = await vscode.window.showOpenDialog({
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false,
                openLabel: '選擇包含日誌檔案的資料夾'
            });

            if (folderUri && folderUri[0]) {
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
                            logMessage(`批量分析失敗 - ${logFile}: ${error}`);
                        }
                    }
                });

                // 生成批量分析報告
                const batchSummary = {
                    title: '批量日誌分析報告',
                    generatedAt: new Date().toLocaleString('zh-TW'),
                    totalFiles: logFiles.length,
                    successfulAnalysis: batchResults.length,
                    results: batchResults
                };

                // 簡單的批量報告模板
                const batchReportHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>批量日誌分析報告</title>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .file-result { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
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
        <div class="file-result">
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
                
                const openReport = await vscode.window.showInformationMessage(
                    `批量分析完成！成功分析 ${batchResults.length}/${logFiles.length} 個檔案`,
                    '開啟批量報告'
                );
                
                if (openReport === '開啟批量報告') {
                    vscode.env.openExternal(vscode.Uri.file(batchReportPath));
                }
            }
        });

        context.subscriptions.push(edk2TreeView);

        // Existing search and filter commands
        const searchCommand = vscode.commands.registerCommand(
            'vebBuild.edk2Debug.searchModules',
            async () => {
                const searchTerm = await vscode.window.showInputBox({
                    prompt: 'Search EDK2 modules (name, type, path)',
                    placeHolder: 'Enter search term'
                });

                if (searchTerm !== undefined) {
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
