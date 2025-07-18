// src/edk2-debug/analysis/logAnalyzer.ts

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { spawn } from 'child_process';
import {
    AnalysisResult,
    CallChainNode,
    PerformanceMetrics,
    EnhancedAnalysisResult
} from '../types';

function ensureDirExists(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
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
                'sol_log_analyzer.py'
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

        // Ensure each array field is at least an empty array
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
}
