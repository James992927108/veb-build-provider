// src/edk2Debug/analyzer/logAnalyzer.ts

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { spawn } from 'child_process';
import { AnalysisResult, DebugLogEntry, CallChainNode, PerformanceMetrics } from '../types';

function ensureDirExists(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

export interface EnhancedAnalysisResult extends AnalysisResult {
    phases: {
        pei_start: number;
        dxe_start: number;
    };
    detailedTimeline: Array<{
        timestamp: number;
        event_type: string;
        phase: string;
        function: string;
        module: string;
        duration?: number;
        depth: number;
        status: string;
    }>;
    callChainPairs: Array<{
        function: string;
        phase: string;
        entry_time: number;
        exit_time: number;
        duration?: number;
        status: string;
        depth: number;
    }>;
}

export class LogAnalyzer {
    private pythonPath: string;
    private workspaceRoot: string;

    constructor(workspaceRoot: string) {
        const config = vscode.workspace.getConfiguration('vebBuild.logAnalyzer');
        this.pythonPath = config.get('Path', 'python');
        this.workspaceRoot = workspaceRoot;
    }

    async analyzeLogFile(logFilePath: string): Promise<EnhancedAnalysisResult> {
        return new Promise((resolve, reject) => {
            const scriptPath = path.join(__dirname, '..', '..', '..', 'scripts', 'log_analyzer.py');
            const outputPath = path.join(path.dirname(logFilePath), 'analysis_result.json');

            const process = spawn(this.pythonPath, [
                scriptPath,
                '--input', logFilePath,
                '--output', outputPath,
            ]);

            let output = '';
            let errors = '';

            process.stdout.on('data', (data) => {
                output += data.toString();
            });

            process.stderr.on('data', (data) => {
                errors += data.toString();
            });

            process.on('close', async (code) => {
                if (code === 0) {
                    try {
                        const result = await this.loadAnalysisResult(outputPath);

                        // 產生 HTML 報告
                        const htmlContent = this.generateEnhancedHtmlReport(result, logFilePath);

                        // 自動建立 out/templates 目錄並寫入報告
                        const outTemplatesDir = path.join(__dirname, '..', '..', '..', 'templates');
                        ensureDirExists(outTemplatesDir);
                        const reportPath = path.join(outTemplatesDir, 'debug_report.html');
                        fs.writeFileSync(reportPath, htmlContent, 'utf-8');

                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    reject(new Error(`日誌分析失敗: ${errors}`));
                }
            });
        });
    }

    private async loadAnalysisResult(resultPath: string): Promise<EnhancedAnalysisResult> {
        const fsPromises = require('fs').promises;
        const content = await fsPromises.readFile(resultPath, 'utf-8');
        const data = JSON.parse(content);

        // 將 Python 分析結果轉換為 TypeScript 格式
        const enhancedResult: EnhancedAnalysisResult = {
            summary: {
                totalEntries: data.summary.total_events,
                totalFunctions: data.performance.total_functions,
                totalDuration: this.calculateTotalDuration(data.call_chains),
                errorCount: this.countErrors(data.timeline),
                analysisTime: new Date().toISOString()
            },
            callChains: this.buildCallChainsFromData(data.call_chains),
            performance: this.buildPerformanceMetrics(data.performance),
            errors: this.extractErrors(data.timeline),
            timeline: this.buildTimelineFromData(data.timeline),
            phases: data.phases,
            detailedTimeline: data.timeline,
            callChainPairs: data.call_chains
        };

        return enhancedResult;
    }

    private calculateTotalDuration(callChains: any[]): number {
        return callChains.reduce((total, chain) => {
            return total + (chain.duration || 0);
        }, 0);
    }

    private countErrors(timeline: any[]): number {
        return timeline.filter(event =>
            event.status && event.status !== 'Success'
        ).length;
    }

    private buildCallChainsFromData(callChains: any[]): CallChainNode[] {
        const rootNodes: CallChainNode[] = [];
        const nodeMap = new Map<string, CallChainNode>();

        // 按深度排序
        const sortedChains = callChains.sort((a, b) => a.depth - b.depth);

        for (const chain of sortedChains) {
            const node: CallChainNode = {
                function: chain.function,
                module: chain.phase, // 使用 phase 作為 module
                timestamp: chain.entry_time.toString(),
                children: [],
                performance: {
                    entryTime: chain.entry_time,
                    exitTime: chain.exit_time,
                    duration: chain.duration
                }
            };

            const nodeKey = `${chain.function}_${chain.entry_time}`;
            nodeMap.set(nodeKey, node);

            if (chain.depth === 1) {
                rootNodes.push(node);
            } else {
                // 找到父節點並加入子節點
                const parentKey = this.findParentNode(chain, sortedChains, nodeMap);
                if (parentKey) {
                    nodeMap.get(parentKey)?.children.push(node);
                }
            }
        }

        return rootNodes;
    }

    private findParentNode(currentChain: any, allChains: any[], nodeMap: Map<string, CallChainNode>): string | null {
        for (const chain of allChains) {
            if (chain.depth === currentChain.depth - 1 &&
                chain.entry_time < currentChain.entry_time &&
                chain.exit_time > currentChain.exit_time) {
                return `${chain.function}_${chain.entry_time}`;
            }
        }
        return null;
    }

    private buildPerformanceMetrics(performanceData: any): PerformanceMetrics {
        return {
            totalFunctions: performanceData.total_functions,
            functionMetrics: performanceData.function_metrics,
            bootTime: this.calculateBootTime(performanceData),
            criticalPath: this.findCriticalPath(performanceData.function_metrics)
        };
    }

    private calculateBootTime(performanceData: any): number | undefined {
        // 從函數統計中計算總啟動時間
        const totalDuration = Object.values(performanceData.function_metrics)
            .reduce((total: number, metrics: any) => total + metrics.total_duration, 0);
        return totalDuration > 0 ? totalDuration : undefined;
    }

    private findCriticalPath(functionMetrics: any): string[] {
        // 找出平均執行時間最長的前5個函數
        return Object.entries(functionMetrics)
            .sort(([, a]: [string, any], [, b]: [string, any]) => b.avg_duration - a.avg_duration)
            .slice(0, 5)
            .map(([name]) => name);
    }

    private extractErrors(timeline: any[]): Array<{
        timestamp: string;
        function: string;
        module: string;
        message: string;
    }> {
        return timeline
            .filter(event => event.status && event.status !== 'Success')
            .map(event => ({
                timestamp: event.timestamp.toString(),
                function: event.function,
                module: event.phase,
                message: `Function ${event.function} failed with status: ${event.status}`
            }));
    }

    private buildTimelineFromData(timelineData: any[]): AnalysisResult['timeline'] {
        return timelineData.map(event => ({
            timestamp: event.timestamp.toString(),
            function: event.function,
            module: event.phase,
            type: event.event_type === 'call_push' || event.event_type === 'entry' ? 'entry' : 'exit',
            duration: event.duration
        }));
    }

    /**
     * 產生增強版 HTML 報告，包含時間軸和階段分析
     */
    private generateEnhancedHtmlReport(result: EnhancedAnalysisResult, logFilePath: string): string {
        const reportTitle = `EDK2 Debug Log Analysis Report - ${path.basename(logFilePath)}`;
        const generatedTime = new Date().toLocaleString('zh-TW');

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${reportTitle}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .section { margin-bottom: 30px; }
        .phase-section { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .pei-phase { border-left: 5px solid #4CAF50; }
        .dxe-phase { border-left: 5px solid #2196F3; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .timeline-item { margin: 5px 0; padding: 10px; background: #fafafa; border-radius: 3px; }
        .call-chain { margin-left: 20px; border-left: 2px solid #ccc; padding-left: 10px; }
        .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .summary-card { background: #f9f9f9; padding: 15px; border-radius: 5px; text-align: center; }
        .duration { color: #666; font-size: 0.9em; }
        .error { color: #f44336; }
        .success { color: #4CAF50; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${reportTitle}</h1>
        <p>產生時間: ${generatedTime}</p>
        <p>日誌檔案: ${logFilePath}</p>
    </div>

    <div class="section">
        <h2>📊 摘要統計</h2>
        <div class="summary-grid">
            <div class="summary-card">
                <h3>${result.summary.totalEntries}</h3>
                <p>總事件數</p>
            </div>
            <div class="summary-card">
                <h3>${result.summary.totalFunctions}</h3>
                <p>總函數數</p>
            </div>
            <div class="summary-card">
                <h3>${result.detailedTimeline.filter(e => e.phase === 'PEI').length}</h3>
                <p>PEI 階段事件</p>
            </div>
            <div class="summary-card">
                <h3>${result.detailedTimeline.filter(e => e.phase === 'DXE').length}</h3>
                <p>DXE 階段事件</p>
            </div>
            <div class="summary-card">
                <h3>${result.summary.errorCount}</h3>
                <p>錯誤數量</p>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>⏱️ 階段時間軸</h2>
        
        <div class="phase-section pei-phase">
            <h3>PEI 階段 (Pre-EFI Initialization)</h3>
            <p>開始時間: ${result.phases.pei_start || 'N/A'}</p>
            ${this.generatePhaseTimeline(result.detailedTimeline.filter(e => e.phase === 'PEI'))}
        </div>

        <div class="phase-section dxe-phase">
            <h3>DXE 階段 (Driver Execution Environment)</h3>
            <p>開始時間: ${result.phases.dxe_start || 'N/A'}</p>
            ${this.generatePhaseTimeline(result.detailedTimeline.filter(e => e.phase === 'DXE'))}
        </div>
    </div>

    <div class="section">
        <h2>🔗 呼叫鏈分析</h2>
        <table>
            <thead>
                <tr>
                    <th>函數</th>
                    <th>階段</th>
                    <th>深度</th>
                    <th>執行時間 (μs)</th>
                    <th>狀態</th>
                </tr>
            </thead>
            <tbody>
                ${(result.callChainPairs ?? []).map(chain => `
                    <tr>
                        <td>${chain.function}</td>
                        <td>${chain.phase}</td>
                        <td>${chain.depth}</td>
                        <td class="duration">${chain.duration || 'N/A'}</td>
                        <td class="${chain.status === 'Success' ? 'success' : 'error'}">${chain.status}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>📈 效能分析</h2>
        <h3>最耗時函數 (前10名)</h3>
        <table>
            <thead>
                <tr>
                    <th>函數名稱</th>
                    <th>呼叫次數</th>
                    <th>平均執行時間 (μs)</th>
                    <th>最大執行時間 (μs)</th>
                    <th>總執行時間 (μs)</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(result.performance.functionMetrics)
                .sort(([, a]: [string, any], [, b]: [string, any]) => b.avg_duration - a.avg_duration)
                .slice(0, 10)
                .map(([name, metrics]: [string, any]) => `
                        <tr>
                            <td>${name}</td>
                            <td>${metrics.call_count}</td>
                            <td class="duration">${metrics.avg_duration.toFixed(2)}</td>
                            <td class="duration">${metrics.max_duration}</td>
                            <td class="duration">${metrics.total_duration}</td>
                        </tr>
                    `).join('')}
            </tbody>
        </table>
    </div>

    ${(result.errors && result.errors.length > 0) ? `
    <div class="section">
        <h2>❌ 錯誤報告</h2>
        ${(result.errors ?? []).map(error => `
            <div class="timeline-item error">
                <strong>${error.function}</strong> - ${error.message}
                <div class="duration">時間: ${error.timestamp}, 模組: ${error.module}</div>
            </div>
        `).join('')}
    </div>
    ` : ''}

    <div class="section">
        <h2>🔧 原始資料</h2>
        <details>
            <summary>點擊查看完整分析結果 JSON</summary>
            <pre style="background: #f5f5f5; padding: 15px; overflow: auto; max-height: 400px;">${JSON.stringify(result, null, 2)}</pre>
        </details>
    </div>
</body>
</html>
        `;
    }

    private generatePhaseTimeline(events: any[]): string {
        if (events.length === 0) {
            return '<p>此階段無事件記錄</p>';
        }

        const sortedEvents = events.sort((a, b) => a.timestamp - b.timestamp);
        return sortedEvents.slice(0, 20).map(event => `
            <div class="timeline-item">
                <strong>${event.function || 'Unknown'}</strong> 
                (${event.event_type})
                <div class="duration">
                    時間: ${event.timestamp}, 
                    深度: ${event.depth}
                    ${event.duration ? `, 執行時間: ${event.duration}μs` : ''}
                </div>
            </div>
        `).join('') + (sortedEvents.length > 20 ? '<p>... 顯示前20個事件</p>' : '');
    }
}
