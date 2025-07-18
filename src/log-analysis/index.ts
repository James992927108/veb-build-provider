// src/log-analysis/index.ts

import * as vscode from 'vscode';
import { registerLogAnalysisCommands } from './commands/logAnalysisCommands';

export function registerLogAnalysisModule(context: vscode.ExtensionContext): void {
    registerLogAnalysisCommands(context);
}

// Export all log analysis functionality
export * from './commands/logAnalysisCommands';
