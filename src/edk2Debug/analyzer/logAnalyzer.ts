// src/edk2Debug/analyzer/logAnalyzer.ts
import * as vscode from 'vscode';
import * as path from 'path';
import { spawn } from 'child_process';
import { AnalysisResult, DebugLogEntry, CallChainNode, PerformanceMetrics } from '../types';

export class LogAnalyzer {
    private pythonPath: string;
    private workspaceRoot: string;

    constructor(workspaceRoot: string) {
        const config = vscode.workspace.getConfiguration('amiEdk2Debug');
        this.pythonPath = config.get('pythonPath', 'python3');
        this.workspaceRoot = workspaceRoot;
    }

    async analyzeLogFile(logFilePath: string): Promise<AnalysisResult> {
        return new Promise((resolve, reject) => {
            const scriptPath = path.join(__dirname, '..', '..', 'scripts', 'log_analyzer.py');
            const outputPath = path.join(path.dirname(logFilePath), 'analysis_result.json');

            const process = spawn(this.pythonPath, [
                scriptPath,
                '--input', logFilePath,
                '--output', outputPath,
                '--format', 'json'
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

    private async loadAnalysisResult(resultPath: string): Promise<AnalysisResult> {
        const fs = require('fs').promises;
        const content = await fs.readFile(resultPath, 'utf-8');
        const data = JSON.parse(content);

        return {
            summary: data.summary,
            callChains: this.buildCallChains(data.entries),
            performance: this.analyzePerformance(data.entries),
            errors: data.errors || [],
            timeline: this.buildTimeline(data.entries)
        };
    }

    private buildTimeline(entries: DebugLogEntry[]): AnalysisResult['timeline'] {
        return entries
            .filter(e => e.level === 'ENTRY' || e.level === 'EXIT')
            .map(e => ({
                timestamp: e.timestamp,
                function: e.function,
                module: e.module,
                type: e.level === 'ENTRY' ? 'entry' : 'exit',
                duration: e.data?.duration
            }));
    }
    private calculateBootTime(entries: DebugLogEntry[]): number | undefined {
        const entryTimes = entries
            .filter(e => e.level === 'ENTRY')
            .map(e => new Date(e.timestamp).getTime());
        const exitTimes = entries
            .filter(e => e.level === 'EXIT')
            .map(e => new Date(e.timestamp).getTime());
        if (entryTimes.length === 0 || exitTimes.length === 0) {
            return undefined;
        }
        return Math.max(...exitTimes) - Math.min(...entryTimes);
    }


    private findCriticalPath(entries: DebugLogEntry[]): string[] {
        // 先構建呼叫鏈
        const buildChains = (nodes: CallChainNode[], path: string[] = []): { path: string[], duration: number }[] => {
            let results: { path: string[], duration: number }[] = [];
            for (const node of nodes) {
                const currentPath = [...path, `${node.module}.${node.function}`];
                const duration = node.performance.duration || 0;
                if (node.children.length === 0) {
                    results.push({ path: currentPath, duration });
                } else {
                    const childResults = buildChains(node.children, currentPath);
                    for (const res of childResults) {
                        results.push({ path: res.path, duration: duration + res.duration });
                    }
                }
            }
            return results;
        };
        const callChains = this.buildCallChains(entries);
        const allPaths = buildChains(callChains);
        if (allPaths.length === 0) {
            return [];
        }
        // 找出 duration 最長的 path
        return allPaths.reduce((a, b) => (a.duration > b.duration ? a : b)).path;
    }

    private buildCallChains(entries: DebugLogEntry[]): CallChainNode[] {
        const callStack: CallChainNode[] = [];
        const rootNodes: CallChainNode[] = [];

        for (const entry of entries) {
            if (entry.level === 'ENTRY') {
                const node: CallChainNode = {
                    function: entry.function,
                    module: entry.module,
                    timestamp: entry.timestamp,
                    children: [],
                    performance: {
                        entryTime: new Date(entry.timestamp).getTime()
                    }
                };

                if (callStack.length === 0) {
                    rootNodes.push(node);
                } else {
                    callStack[callStack.length - 1].children.push(node);
                }

                callStack.push(node);
            } else if (entry.level === 'EXIT' && callStack.length > 0) {
                const currentNode = callStack.pop();
                if (currentNode && currentNode.function === entry.function) {
                    currentNode.performance.exitTime = new Date(entry.timestamp).getTime();
                    currentNode.performance.duration =
                        currentNode.performance.exitTime - currentNode.performance.entryTime;
                }
            }
        }

        return rootNodes;
    }

    private analyzePerformance(entries: DebugLogEntry[]): PerformanceMetrics {
        const functionMetrics = new Map<string, {
            callCount: number;
            totalDuration: number;
            avgDuration: number;
            maxDuration: number;
            minDuration: number;
        }>();

        // 效能分析邏輯
        for (const entry of entries) {
            if (entry.level === 'EXIT' && entry.data?.duration) {
                const key = `${entry.module}.${entry.function}`;
                const existing = functionMetrics.get(key) || {
                    callCount: 0,
                    totalDuration: 0,
                    avgDuration: 0,
                    maxDuration: 0,
                    minDuration: Infinity
                };

                existing.callCount++;
                existing.totalDuration += entry.data.duration;
                existing.avgDuration = existing.totalDuration / existing.callCount;
                existing.maxDuration = Math.max(existing.maxDuration, entry.data.duration);
                existing.minDuration = Math.min(existing.minDuration, entry.data.duration);

                functionMetrics.set(key, existing);
            }
        }

        return {
            totalFunctions: functionMetrics.size,
            functionMetrics: Object.fromEntries(functionMetrics),
            bootTime: this.calculateBootTime(entries),
            criticalPath: this.findCriticalPath(entries)
        };
    }
}
