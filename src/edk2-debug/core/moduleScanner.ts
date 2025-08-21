// src/edk2-debug/core/moduleScanner.ts
import { logDebug, logInfo, logSummary, logError, handleError, LogLevel } from '../../shared/utils/logger';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { Edk2ScanOptions, Edk2InfMeta } from '../types';
import { InfParser } from './infParser';

const DEFAULT_EXCLUDE_PATTERNS = [
  "**/Build/**",
  "**/build/**",
  "**/BUILD/**",
  "**/BuildBrh/**",
  "Build/**",
  "build/**",
  "BUILD/**",
  "BuildBrh/**",
  "**/Conf/**",
  "Conf/**",
  "**/.git/**",
  "**/node_modules/**",
  "**/.vscode/**"
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
  private parser = new InfParser();
  
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

  // Scan and parse all INF files in the workspace
  async scanAndParseWorkspace(workspaceRoot?: string): Promise<Edk2InfMeta[]> {
    const targetRoot = workspaceRoot || this.workspaceRoot;
    const infPaths = await this.scanInfFiles();
    const metas: Edk2InfMeta[] = [];
    let failedCount = 0;

    for (const infPath of infPaths) {
      try {
        const content = await fs.promises.readFile(infPath, 'utf-8');
        const meta = await this.parser.parse(content, infPath);
        if (meta) {
          metas.push(meta);
        }
      } catch (error) {
        failedCount++;
        logError(`Failed to parse INF file ${infPath}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    logSummary(`=== EDK2 Debug Scanning Results ===`);
    logSummary(`Total INF files found by scanner: ${infPaths.length}`);
    logSummary(`Successfully parsed INF files: ${metas.length}`);
    logSummary(`Failed to parse INF files: ${failedCount}`);

    return metas;
  }

  // Rescan a single INF module
  async rescanModule(infPath: string): Promise<Edk2InfMeta | null> {
    try {
      if (!await this.fileExists(infPath)) {
        return null;
      }

      const content = await fs.promises.readFile(infPath, 'utf-8');
      return this.parser.parse(content, infPath);
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
    let excludedCount = 0;

    try {
      excludedCount = await this.scanDirectory(directory, infFiles, options, 0, progress, token);
    } catch (error) {
      handleError(`Scan directory error ${directory}: ${error instanceof Error ? error.stack || error.message : String(error)}`);
    }

    // Show summary information only
    logSummary(`Scanning completed: found ${infFiles.length} INF files in workspace.`);
    if (excludedCount > 0) {
      logInfo(`Excluded ${excludedCount} files/directories by pattern matching.`);
    }

    return infFiles;
  }

  private async scanDirectory(
    directory: string,
    infFiles: string[],
    options: Edk2ScanOptions,
    currentDepth: number,
    progress?: vscode.Progress<{ message?: string; increment?: number }>,
    token?: vscode.CancellationToken
  ): Promise<number> {
    if (token?.isCancellationRequested || currentDepth >= options.maxDepth) {
      return 0;
    }

    let excludedCount = 0;

    try {
      const files = await fs.promises.readdir(directory, { withFileTypes: true });

      for (const file of files) {
        if (token?.isCancellationRequested) {
          break;
        }

        const fullPath = path.join(directory, file.name);
        const relativePath = path.relative(this.workspaceRoot, fullPath);

        // Check if it should be excluded (check for all files and directories)
        if (this.matchesPatterns(relativePath, options.excludePatterns)) {
          logDebug(`Excluded by pattern: ${relativePath}`);
          excludedCount++;
          continue;
        }

        if (file.isDirectory() && options.recursive) {
          progress?.report({ message: `Scanning directory: ${relativePath}` });
          const subExcludedCount = await this.scanDirectory(fullPath, infFiles, options, currentDepth + 1, progress, token);
          excludedCount += subExcludedCount;
        } else if (file.isFile()) {
          // Only files with the .inf extension (case-insensitive) are included
          if (path.extname(file.name).toLowerCase() === '.inf') {
            infFiles.push(fullPath);
            logDebug(`Found INF file: ${relativePath}`);
            progress?.report?.({ message: `Module found: ${file.name}` });
          }
        }
      }
    } catch (error) {
      handleError(`Read directory error ${directory}: ${error instanceof Error ? error.stack || error.message : String(error)}`);
    }

    return excludedCount;
  }

  private matchesPatterns(filePath: string, patterns: string[]): boolean {
    return patterns.some(pattern => {
      // Normalize path separators to forward slashes for cross-platform compatibility
      const normalizedPath = filePath.replace(/\\/g, '/');
      
      // Convert glob pattern to regular expression
      const regexPattern = pattern
        .replace(/\./g, '\\.')             // Escape dots first
        .replace(/\*\*/g, '§DOUBLESTAR§')  // Replace double asterisks
        .replace(/\*/g, '[^/]*')           // Single asterisk doesn't match path separators
        .replace(/§DOUBLESTAR§/g, '.*')    // Double asterisk matches any character
        .replace(/\?/g, '[^/]');           // Question mark matches single non-path separator character
      
      const regex = new RegExp('^' + regexPattern + '$', 'i'); // Add case-insensitive flag
      return regex.test(normalizedPath);
    });
  }
}
