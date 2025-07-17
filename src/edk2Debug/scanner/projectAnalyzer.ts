// src/edk2Debug/scanner/projectAnalyzer.ts
import { ModuleScanner } from './moduleScanner';
import { Edk2InfMeta, Edk2ProjectStats } from '../types';

export class ProjectAnalyzer {
  private scanner: ModuleScanner;

  constructor(private workspaceRoot: string) {
    this.scanner = new ModuleScanner(workspaceRoot);
  }

  async analyze(workspace?: string): Promise<Edk2InfMeta[]> {
    const targetWorkspace = workspace || this.workspaceRoot;
    this.scanner = new ModuleScanner(targetWorkspace);
    return this.scanner.scanAndParseWorkspace();
  }

  async getProjectStatistics(): Promise<Edk2ProjectStats> {
    const metas = await this.analyze(this.workspaceRoot);

    return {
      totalModules: metas.length,
      enhancedModules: metas.filter(m => m.enhanced).length,
      moduleTypes: metas.reduce((acc, meta) => {
        acc[meta.moduleType] = (acc[meta.moduleType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      architectures: metas.reduce((acc, meta) => {
        meta.architectures.forEach(arch => {
          acc[arch] = (acc[arch] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>)
    };
  }
}
