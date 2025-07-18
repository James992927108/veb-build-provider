// src/edk2-debug/index.ts
// EDK2 Enhanced Debug Library - Main module entry

import * as vscode from 'vscode';
import { registerEdk2DebugCommands } from './commands/edk2DebugCommands';

export function registerEdk2DebugModule(context: vscode.ExtensionContext): void {
    registerEdk2DebugCommands(context);
}

// Export core types
export * from './types';

// Export constants
export * from './constants';

// Export core modules
export { ModuleScanner } from './core/moduleScanner';
export { InfParser } from './core/infParser';
export { ProjectAnalyzer } from './core/projectAnalyzer';
export { Edk2ModuleProvider } from './core/edk2ModuleProvider';
export { ModuleEnhancer } from './core/moduleEnhancer';

// Export analysis modules
export { JSONLogParser } from './analysis/jsonLogParser';
export { LogAnalyzer } from './analysis/logAnalyzer';
export { HTMLReportGenerator } from './analysis/htmlReportGenerator';

// Export commands
export * from './commands/edk2DebugCommands';

// Convenience functions
import { ModuleScanner } from './core/moduleScanner';
import { ProjectAnalyzer } from './core/projectAnalyzer';

export async function scanWorkspace(workspaceRoot: string) {
  const scanner = new ModuleScanner(workspaceRoot);
  return scanner.scanAndParseWorkspace();
}

export async function getProjectStats(workspaceRoot: string) {
  const analyzer = new ProjectAnalyzer(workspaceRoot);
  return analyzer.getProjectStatistics();
}

// Module information
export const EDK2_DEBUG_MODULE_INFO = {
  name: 'EDK2 Enhanced Debug Library',
  version: '1.0.0',
  description: 'Enhanced debugging tools for EDK2 BIOS development',
  author: 'VEB Build Provider Team'
} as const;