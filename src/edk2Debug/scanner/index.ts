// src/edk2Debug/scanner/index.ts
// 統一的掃描器API - 建議使用 ModuleScanner 作為主要介面
export { ModuleScanner } from './moduleScanner';
export { InfParser } from './infParser';
export { ProjectAnalyzer } from './projectAnalyzer';

import { ModuleScanner } from './moduleScanner';
import { ProjectAnalyzer } from './projectAnalyzer';

// 便捷函數 - 直接使用最常用的功能
export async function scanWorkspace(workspaceRoot: string) {
  const scanner = new ModuleScanner(workspaceRoot);
  return scanner.scanAndParseWorkspace();
}

export async function getProjectStats(workspaceRoot: string) {
  const analyzer = new ProjectAnalyzer(workspaceRoot);
  return analyzer.getProjectStatistics();
}
