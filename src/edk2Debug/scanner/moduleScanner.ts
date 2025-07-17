// src/edk2Debug/scanner/moduleScanner.ts
import { logMessage, handleError } from '../../utils/logger';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { Edk2ScanOptions, Edk2InfMeta } from '../types';

const DEFAULT_EXCLUDE_PATTERNS = [
  "**/Build/**",
  "**/build/**",
  "**/BUILD/**",
  "**/BuildBrh/**",
  "**/Conf/**",
  "**/.git/**",
  "**/node_modules/**",
  "**/.vscode/**",
  "**/.*"
] as const;

const DEFAULT_INCLUDE_PATTERNS = [
  "**/*.inf"
] as const;

const DEFAULT_SCAN_OPTIONS: Edk2ScanOptions = {
  recursive: true,
  excludePatterns: [...DEFAULT_EXCLUDE_PATTERNS],
  includePatterns: [...DEFAULT_INCLUDE_PATTERNS],
  showProgress: true,
  maxDepth: 10
};

export class ModuleScanner {
  constructor(private workspaceRoot: string) { }

  async scanInfFiles(options: Partial<Edk2ScanOptions> = {}): Promise<string[]> {
    const scanOptions: Edk2ScanOptions = {
      recursive: options.recursive ?? DEFAULT_SCAN_OPTIONS.recursive,
      excludePatterns: options.excludePatterns ?? [...DEFAULT_EXCLUDE_PATTERNS],
      includePatterns: options.includePatterns ?? [...DEFAULT_INCLUDE_PATTERNS],
      showProgress: options.showProgress ?? DEFAULT_SCAN_OPTIONS.showProgress,
      maxDepth: options.maxDepth ?? DEFAULT_SCAN_OPTIONS.maxDepth
    };

    if (scanOptions.showProgress) {
      return vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Scanning EDK2 modules...",
        cancellable: true
      }, async (progress, token) => {
        return this.performScan(this.workspaceRoot, scanOptions, progress, token);
      });
    } else {
      return this.performScan(this.workspaceRoot, scanOptions);
    }
  }

  // Scan all INF files in the workspace
  async scanWorkspace(workspaceRoot?: string): Promise<string[]> {
    const targetRoot = workspaceRoot || this.workspaceRoot;
    return this.scanInfFiles();
  }

  // Rescan a single INF module
  async rescanModule(infPath: string): Promise<Edk2InfMeta | null> {
    try {
      if (!await this.fileExists(infPath)) {
        return null;
      }

      const content = await fs.promises.readFile(infPath, 'utf-8');
      const { InfParser } = await import('./infParser');
      const parser = new InfParser();
      return parser.parse(content, infPath);
    } catch (error) {
      handleError(`Rescan module error ${infPath}: ${error instanceof Error ? error.stack || error.message : String(error)}`);
      return null;
    }
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.promises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private async performScan(
    directory: string,
    options: Edk2ScanOptions,
    progress?: vscode.Progress<{ message?: string; increment?: number }>,
    token?: vscode.CancellationToken
  ): Promise<string[]> {
    const infFiles: string[] = [];

    try {
      await this.scanDirectory(directory, infFiles, options, 0, progress, token);
    } catch (error) {
      handleError(`Scan directory error ${directory}: ${error instanceof Error ? error.stack || error.message : String(error)}`);
    }

    // Simplified log output, only record basic information
    logMessage(`Scanning completed: found ${infFiles.length} INF files in workspace.`);

    return infFiles;
  }

  private async scanDirectory(
    directory: string,
    infFiles: string[],
    options: Edk2ScanOptions,
    currentDepth: number,
    progress?: vscode.Progress<{ message?: string; increment?: number }>,
    token?: vscode.CancellationToken
  ): Promise<void> {
    if (token?.isCancellationRequested || currentDepth >= options.maxDepth) {
      return;
    }

    try {
      const files = await fs.promises.readdir(directory, { withFileTypes: true });

      for (const file of files) {
        if (token?.isCancellationRequested) {
          break;
        }

        const fullPath = path.join(directory, file.name);
        const relativePath = path.relative(this.workspaceRoot, fullPath);

        // Log excluded files by pattern
        if (this.matchesPatterns(relativePath, options.excludePatterns)) {
          logMessage(`Excluded by pattern: ${relativePath}`);
          continue;
        }

        if (file.isDirectory() && options.recursive) {
          progress?.report({ message: `Scanning directory: ${relativePath}` });
          await this.scanDirectory(fullPath, infFiles, options, currentDepth + 1, progress, token);
        } else if (file.isFile()) {
          // Only files with the .inf extension (case-insensitive) are included
          if (path.extname(file.name).toLowerCase() === '.inf') {
            infFiles.push(fullPath);
            progress?.report?.({ message: `Module found: ${file.name}` });
          }
        }
      }
    } catch (error) {
      handleError(`Read directory error ${directory}: ${error instanceof Error ? error.stack || error.message : String(error)}`);
    }
  }

  private matchesPatterns(filePath: string, patterns: string[]): boolean {
    return patterns.some(pattern => {
      const regex = new RegExp(
        pattern
          .replace(/\*\*/g, '.*')
          .replace(/\*/g, '[^/]*')
          .replace(/\?/g, '[^/]')
      );
      return regex.test(filePath);
    });
  }
}
