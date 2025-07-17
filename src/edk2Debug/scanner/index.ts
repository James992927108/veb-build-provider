// src/edk2Debug/scanner/index.ts
// Unified scanner API - recommended to use ModuleScanner as main interface
export { ModuleScanner } from './moduleScanner';
export { InfParser } from './infParser';
export { ProjectAnalyzer } from './projectAnalyzer';

import { ModuleScanner } from './moduleScanner';
import { ProjectAnalyzer } from './projectAnalyzer';

// Convenience function - directly use most common functionality
export async function scanWorkspace(workspaceRoot: string) {
  const scanner = new ModuleScanner(workspaceRoot);
  return scanner.scanAndParseWorkspace();
}

export async function getProjectStats(workspaceRoot: string) {
  const analyzer = new ProjectAnalyzer(workspaceRoot);
  return analyzer.getProjectStatistics();
}
