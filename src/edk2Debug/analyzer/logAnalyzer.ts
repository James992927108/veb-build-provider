// src/edk2Debug/analyzer/logAnalyzer.ts

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { spawn } from 'child_process';
import {
    AnalysisResult,
    DebugLogEntry,
    CallChainNode,
    PerformanceMetrics
} from '../types';

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
        this.pythonPath = config.get('Path', 'python')!;
        this.workspaceRoot = workspaceRoot;
    }

    async analyzeLogFile(logFilePath: string): Promise<EnhancedAnalysisResult> {
        return new Promise((resolve, reject) => {
            const scriptPath = path.join(
                __dirname,
                '..',
                '..',
                '..',
                'scripts',
                'log_analyzer.py'
            );
            const outputPath = path.join(
                path.dirname(logFilePath),
                'analysis_result.json'
            );

            const process = spawn(this.pythonPath, [
                scriptPath,
                '--input',
                logFilePath,
                '--output',
                outputPath
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
                        const htmlContent = this.generateEnhancedHtmlReport(
                            result,
                            logFilePath
                        );
                        const outTemplatesDir = path.join(
                            __dirname,
                            '..',
                            '..',
                            '..',
                            'templates'
                        );
                        ensureDirExists(outTemplatesDir);
                        const reportPath = path.join(
                            outTemplatesDir,
                            'debug_report.html'
                        );
                        fs.writeFileSync(reportPath, htmlContent, 'utf-8');
                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    reject(new Error(`Log analysis failed: ${errors}`));
                }
            });
        });
    }

    private async loadAnalysisResult(
        resultPath: string
    ): Promise<EnhancedAnalysisResult> {
        const fsPromises = require('fs').promises;
        const content = await fsPromises.readFile(resultPath, 'utf-8');
        const data = JSON.parse(content);

        // 確保各陣列欄位至少為空陣列
        const rawTimeline = Array.isArray(data.timeline) ? data.timeline : [];
        const rawCallChains = Array.isArray(data.call_chains)
            ? data.call_chains
            : [];

        const enhancedResult: EnhancedAnalysisResult = {
            summary: {
                totalEntries: data.summary.total_events ?? 0,
                totalFunctions: data.performance.total_functions ?? 0,
                totalDuration: this.calculateTotalDuration(rawCallChains),
                errorCount: this.countErrors(rawTimeline),
                analysisTime: new Date().toISOString()
            },
            callChains: this.buildCallChainsFromData(rawCallChains),
            performance: this.buildPerformanceMetrics(data.performance ?? {}),
            errors: this.extractErrors(rawTimeline),
            timeline: this.buildTimelineFromData(rawTimeline),
            phases: {
                pei_start: data.phases?.pei_start ?? 0,
                dxe_start: data.phases?.dxe_start ?? 0
            },
            detailedTimeline: rawTimeline,
            callChainPairs: rawCallChains
        };

        return enhancedResult;
    }

    private calculateTotalDuration(callChains: any[]): number {
        return callChains.reduce(
            (total, chain) => total + (chain.duration ?? 0),
            0
        );
    }

    private countErrors(timeline: any[]): number {
        return timeline.filter(
            (e) => e.status && e.status !== 'Success'
        ).length;
    }

    private buildCallChainsFromData(callChains: any[]): CallChainNode[] {
        const rootNodes: CallChainNode[] = [];
        const nodeMap = new Map<string, CallChainNode>();

        const sortedChains = [...callChains].sort(
            (a, b) => (a.depth ?? 0) - (b.depth ?? 0)
        );

        for (const chain of sortedChains) {
            const entry = chain.entry_time ?? 0;
            const nodeKey = `${chain.function}_${entry}`;

            const node: CallChainNode = {
                function: chain.function,
                module: chain.phase,
                timestamp: entry.toString(),
                children: [],
                performance: {
                    entryTime: entry,
                    exitTime: chain.exit_time ?? entry,
                    duration: chain.duration
                }
            };
            nodeMap.set(nodeKey, node);

            if (chain.depth === 1) {
                rootNodes.push(node);
            } else {
                const parentKey = this.findParentNode(
                    chain,
                    sortedChains,
                    nodeMap
                );
                if (parentKey) {
                    nodeMap.get(parentKey)?.children.push(node);
                }
            }
        }

        return rootNodes;
    }

    private findParentNode(
        currentChain: any,
        allChains: any[],
        nodeMap: Map<string, CallChainNode>
    ): string | null {
        for (const chain of allChains) {
            if (
                chain.depth === currentChain.depth - 1 &&
                chain.entry_time < currentChain.entry_time &&
                chain.exit_time > currentChain.exit_time
            ) {
                return `${chain.function}_${chain.entry_time}`;
            }
        }
        return null;
    }

    private buildPerformanceMetrics(performanceData: any): PerformanceMetrics {
        const funcMetrics = performanceData.function_metrics ?? {};
        return {
            totalFunctions: performanceData.total_functions ?? 0,
            functionMetrics: funcMetrics,
            bootTime: this.calculateBootTime(performanceData),
            criticalPath: this.findCriticalPath(funcMetrics)
        };
    }

    private calculateBootTime(performanceData: any): number | undefined {
        const funcMetrics = performanceData.function_metrics ?? {};
        const total = Object.values(funcMetrics).reduce(
            (sum: number, m: any) => sum + (m.total_duration ?? 0),
            0
        );
        return total > 0 ? total : undefined;
    }

    private findCriticalPath(functionMetrics: any): string[] {
        return Object.entries(functionMetrics)
            .sort(([, a]: any, [, b]: any) => b.avg_duration - a.avg_duration)
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
            .filter((e) => e.status && e.status !== 'Success')
            .map((e) => ({
                timestamp: e.timestamp?.toString() ?? '',
                function: e.function,
                module: e.phase,
                message: `Function ${e.function} failed with status: ${e.status}`
            }));
    }

    private buildTimelineFromData(timelineData: any[]): AnalysisResult['timeline'] {
        return timelineData.map((e) => ({
            timestamp: e.timestamp?.toString() ?? '',
            function: e.function,
            module: e.phase,
            type:
                e.event_type === 'call_push' || e.event_type === 'entry'
                    ? 'entry'
                    : 'exit',
            duration: e.duration
        }));
    }

    private generateEnhancedHtmlReport(
        result: EnhancedAnalysisResult,
        logFilePath: string
    ): string {
        const reportTitle = `EDK2 Debug Log Analysis Report - ${path.basename(
            logFilePath
        )}`;
        const generatedTime = new Date().toLocaleString('zh-TW');

        // 內部函式：安全篩選
        const safeFilter = (
            arr: any[],
            phase: string
        ): any[] => Array.isArray(arr)
                ? arr.filter((e) => e.phase === phase)
                : [];

        return `
<!DOCTYPE html>
<html>
<head> …  // 保留原樣式
</head>
<body>
  <div class="header"> … </div>
  <div class="section">
    <h2>⏱️ 階段時間軸</h2>
    <div class="phase-section pei-phase">
      <h3>PEI 階段</h3>
      <p>開始時間: ${result.phases.pei_start}</p>
      ${this.generatePhaseTimeline(safeFilter(result.detailedTimeline, 'PEI'))}
    </div>
    <div class="phase-section dxe-phase">
      <h3>DXE 階段</h3>
      <p>開始時間: ${result.phases.dxe_start}</p>
      ${this.generatePhaseTimeline(safeFilter(result.detailedTimeline, 'DXE'))}
    </div>
  </div>
  …  // 其餘區段同樣用 safeFilter(result.detailedTimeline, 'DXE')、呼叫鏈等
</body>
</html>
`;
    }

    private generatePhaseTimeline(events: any[]): string {
        if (!Array.isArray(events) || events.length === 0) {
            return '<p>此階段無事件記錄</p>';
        }
        const sorted = [...events].sort((a, b) => a.timestamp - b.timestamp);
        const top = sorted.slice(0, 20);
        return top
            .map(
                (e) => `
      <div class="timeline-item">
        <strong>${e.function || 'Unknown'}</strong>
        (${e.event_type})
        <div class="duration">
          時間: ${e.timestamp}, 深度: ${e.depth}
          ${e.duration ? `, 執行時間: ${e.duration}μs` : ''}
        </div>
      </div>`
            )
            .join('') +
            (sorted.length > 20 ? '<p>... 顯示前20個事件</p>' : '');
    }
}
