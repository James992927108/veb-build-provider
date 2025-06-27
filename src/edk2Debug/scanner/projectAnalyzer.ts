// src/edk2Debug/scanner/projectAnalyzer.ts
import * as fs from 'fs';
import { ModuleScanner } from './moduleScanner';
import { InfParser } from './infParser';
import { Edk2InfMeta, Edk2ProjectStats } from '../types';

export class ProjectAnalyzer {
  private scanner: ModuleScanner;
  private parser = new InfParser();

  constructor(private workspaceRoot: string) {
    this.scanner = new ModuleScanner(workspaceRoot);
  }

  async analyze(workspace?: string): Promise<Edk2InfMeta[]> {
    const targetWorkspace = workspace || this.workspaceRoot;
    const infPaths = await this.scanner.scanWorkspace(targetWorkspace);
    const metas: Edk2InfMeta[] = [];

    for (const p of infPaths) {
      try {
        const text = await fs.promises.readFile(p, 'utf-8');
        const meta = await this.parser.parse(text, p);
        if (meta) {
          metas.push(meta);
        }
      } catch (error) {
        console.error(`Failed to parse INF file ${p}:`, error);
      }
    }

    return metas;
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
