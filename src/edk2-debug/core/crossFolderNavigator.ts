// src/edk2-debug/core/crossFolderNavigator.ts
// Override-aware search engine - supports cross-folder source code search

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { EnhancedLogParser } from '../analysis/enhancedLogParser';
import { logError, logInfo, logDebug, logWarn, logSummary } from '../../shared/utils/logger';

/**
 * Cap a candidate list to the first `cap` entries, reporting whether any were
 * dropped. Pure helper so the search-bound is unit-testable.
 */
export function applySearchCap<T>(all: T[], cap: number): { files: T[]; truncated: boolean; cap: number } {
  if (all.length <= cap) {
    return { files: all, truncated: false, cap };
  }
  return { files: all.slice(0, cap), truncated: true, cap };
}

/**
 * File match result
 */
export interface FileMatch {
  /** Full file path */
  filePath: string;
  /** Whether this is an Override version */
  isOverride: boolean;
  /** Match weight (higher is better) */
  weight: number;
  /** Match reason */
  reason: string;
  /** Function line number in file (if found) */
  functionLine?: number;
}

/**
 * Search cache item
 */
interface SearchCacheItem {
  matches: FileMatch[];
  timestamp: number;
}

/**
 * Cross-folder navigator
 * Implements Override-aware intelligent source code search
 */
export class CrossFolderNavigator {
  private searchCache: Map<string, SearchCacheItem> = new Map();
  private readonly SEARCH_CACHE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes expiry
  
  constructor() {
    logDebug(`[CrossFolderNavigator] Initialization completed`);
  }

  /**
   * Search source files (main entry point)
   * @param moduleName Module name
   * @param functionName Function name
   * @returns List of matching files (sorted by weight)
   */
  async findSourceFiles(moduleName: string, functionName: string): Promise<string[]> {
    const startTime = Date.now();
    logDebug(`[CrossFolderNavigator] Searching source code: ${moduleName}:${functionName}`);
    
    const cacheKey = `${moduleName}:${functionName}`;
    const now = Date.now();
    
    // Check cache
    const cached = this.searchCache.get(cacheKey);
    if (cached && (now - cached.timestamp) < this.SEARCH_CACHE_EXPIRY_MS) {
      const filePaths = cached.matches.map(match => match.filePath);
      logDebug(`[CrossFolderNavigator] Using cached result (${filePaths.length} files, time: ${Date.now() - startTime}ms)`);
      return filePaths;
    }
    
    try {
      // Execute multiple search strategies
      const matches = await this.performMultipleSearchStrategies(moduleName, functionName);
      
      // Sort and deduplicate
      const sortedMatches = this.sortAndDeduplicateMatches(matches);
      
      // Cache results
      this.searchCache.set(cacheKey, {
        matches: sortedMatches,
        timestamp: now
      });
      
      // Clean expired cache
      this.cleanExpiredSearchCache();
      
      const filePaths = sortedMatches.map(match => match.filePath);
      
      const duration = Date.now() - startTime;
      logSummary(`[CrossFolderNavigator] Search completed, found ${filePaths.length} matching files (time: ${duration}ms, cached)`);
      
      // Log search result details
      sortedMatches.forEach((match, index) => {
        logDebug(`[CrossFolderNavigator]   ${index + 1}. ${match.filePath} (${match.reason}, weight: ${match.weight})`);
      });
      
      return filePaths;
      
    } catch (error) {
      logError(`[CrossFolderNavigator] Search failed: ${error}`);
      return [];
    }
  }

  /**
   * Execute multiple search strategies
   */
  private async performMultipleSearchStrategies(
    moduleName: string, 
    functionName: string
  ): Promise<FileMatch[]> {
    
    const matches: FileMatch[] = [];
    
    // Strategy 1: Priority search in Override directories
    logDebug(`[CrossFolderNavigator] Executing strategy 1: Override directory search`);
    const overrideMatches = await this.searchInOverrideDirectories(moduleName, functionName);
    matches.push(...overrideMatches);
    
    // Strategy 2: Module directory search
    logDebug(`[CrossFolderNavigator] Executing strategy 2: Module directory search`);
    const moduleMatches = await this.searchInModuleDirectories(moduleName, functionName);
    matches.push(...moduleMatches);
    
    // Strategy 3: Global function name search
    logDebug(`[CrossFolderNavigator] Executing strategy 3: Global function name search`);
    const functionMatches = await this.searchByFunctionName(functionName);
    matches.push(...functionMatches);
    
    // Strategy 4: Fuzzy file name search
    logDebug(`[CrossFolderNavigator] Executing strategy 4: Fuzzy file name search`);
    const fileNameMatches = await this.searchByFileName(moduleName);
    matches.push(...fileNameMatches);
    
    return matches;
  }

  /**
   * Strategy 1: Priority search in Override directories
   */
  private async searchInOverrideDirectories(
    moduleName: string, 
    functionName: string
  ): Promise<FileMatch[]> {
    
    const matches: FileMatch[] = [];
    
    // Search files in Override directories
    const overridePattern = '**/Override/**/*.{c,h}';
    const overrideFiles = await vscode.workspace.findFiles(overridePattern, '**/node_modules/**');
    
    logDebug(`[CrossFolderNavigator] Found ${overrideFiles.length} files in Override directories`);
    
    for (const file of overrideFiles) {
      try {
        const content = fs.readFileSync(file.fsPath, 'utf-8');
        
        // Check if contains target function
        if (this.containsFunction(content, functionName)) {
          const functionLine = this.findFunctionLine(content, functionName);
          
          matches.push({
            filePath: file.fsPath,
            isOverride: true,
            weight: 100, // Override files have highest weight
            reason: 'Found in Override directory',
            functionLine
          });
          
          logDebug(`[CrossFolderNavigator] Override match: ${file.fsPath}`);
        }
        
      } catch (error) {
        // Ignore read errors, continue searching next file
      }
    }
    
    return matches;
  }

  /**
   * Strategy 2: Module directory search
   */
  private async searchInModuleDirectories(
    moduleName: string, 
    functionName: string
  ): Promise<FileMatch[]> {
    
    const matches: FileMatch[] = [];
    
    // Map DebugLib variant names to actual modules
    const mappedModuleName = EnhancedLogParser.mapDebugLibToModule(moduleName);
    
    // Search module-related directories
    const modulePatterns = [
      `**/${mappedModuleName}/**/*.{c,h}`,
      `**/*${mappedModuleName}*/**/*.{c,h}`,
      `**/Library/${mappedModuleName}*/**/*.{c,h}`,
      `**/Library/*${mappedModuleName}*/**/*.{c,h}`
    ];
    
    for (const pattern of modulePatterns) {
      try {
        const moduleFiles = await vscode.workspace.findFiles(pattern, '**/node_modules/**');
        logDebug(`[CrossFolderNavigator] Module search '${pattern}' found ${moduleFiles.length} files`);
        
        for (const file of moduleFiles) {
          try {
            const content = fs.readFileSync(file.fsPath, 'utf-8');
            
            if (this.containsFunction(content, functionName)) {
              const isOverride = file.fsPath.includes('Override');
              const functionLine = this.findFunctionLine(content, functionName);
              
              matches.push({
                filePath: file.fsPath,
                isOverride,
                weight: isOverride ? 90 : 70, // Override versions have higher weight
                reason: `Found in ${mappedModuleName} module directory`,
                functionLine
              });
              
              logDebug(`[CrossFolderNavigator] Module match: ${file.fsPath}`);
            }
            
          } catch (error) {
            // Ignore read errors
          }
        }
        
      } catch (error) {
        logError(`[CrossFolderNavigator] Module search pattern '${pattern}' failed: ${error}`);
      }
    }
    
    return matches;
  }

  /**
   * Strategy 3: Global function name search
   */
  private async searchByFunctionName(functionName: string): Promise<FileMatch[]> {
    const matches: FileMatch[] = [];

    try {
      // Search all .c and .h files
      const allFiles = await vscode.workspace.findFiles('**/*.{c,h}', '**/node_modules/**');
      logDebug(`[CrossFolderNavigator] Function name search: checking ${allFiles.length} files`);

      // Bound the search for performance, but surface truncation instead of
      // silently dropping matches beyond the cap (OPT-8).
      const { files: filesToSearch, truncated, cap } = applySearchCap(allFiles, 500);
      if (truncated) {
        logWarn(`[CrossFolderNavigator] Too many files (${allFiles.length}); searching first ${cap} to bound cost`);
      }

      for (const file of filesToSearch) {
        try {
          const content = fs.readFileSync(file.fsPath, 'utf-8');
          
          if (this.containsFunction(content, functionName)) {
            const isOverride = file.fsPath.includes('Override');
            const functionLine = this.findFunctionLine(content, functionName);
            
            matches.push({
              filePath: file.fsPath,
              isOverride,
              weight: isOverride ? 60 : 40, // Global search has lower weight
              reason: 'Found by function name search',
              functionLine
            });
            
            logDebug(`[CrossFolderNavigator] Function name match: ${file.fsPath}`);
          }
          
        } catch (error) {
          // Ignore read errors
        }
      }
      
    } catch (error) {
      logError(`[CrossFolderNavigator] Function name search failed: ${error}`);
    }
    
    return matches;
  }

  /**
   * Strategy 4: Fuzzy file name search
   */
  private async searchByFileName(moduleName: string): Promise<FileMatch[]> {
    const matches: FileMatch[] = [];
    
    try {
      // Search similar file names based on module name
      const fileNamePatterns = [
        `**/${moduleName}.{c,h}`,
        `**/*${moduleName}*.{c,h}`,
        `**/${moduleName}*.{c,h}`
      ];
      
      for (const pattern of fileNamePatterns) {
        const files = await vscode.workspace.findFiles(pattern, '**/node_modules/**');
        logDebug(`[CrossFolderNavigator] File name search '${pattern}' found ${files.length} files`);
        
        for (const file of files) {
          const isOverride = file.fsPath.includes('Override');
          
          matches.push({
            filePath: file.fsPath,
            isOverride,
            weight: isOverride ? 30 : 20, // File name matching has lowest weight
            reason: 'Found by file name pattern',
          });
        }
      }
      
    } catch (error) {
      logError(`[CrossFolderNavigator] File name search failed: ${error}`);
    }
    
    return matches;
  }

  /**
   * Check if file content contains specified function
   */
  private containsFunction(content: string, functionName: string): boolean {
    // Check function definition patterns
    const functionPatterns = [
      new RegExp(`\\b${functionName}\\s*\\(`, 'i'), // Function call/definition
      new RegExp(`^\\s*\\w+.*\\s+${functionName}\\s*\\(`, 'm'), // Function definition line
    ];
    
    return functionPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Find function definition line number in file content
   */
  private findFunctionLine(content: string, functionName: string): number | undefined {
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Find function definition pattern
      const functionDefPattern = new RegExp(`\\b${functionName}\\s*\\(`);
      if (functionDefPattern.test(line)) {
        // Check if this is a function definition (not a function call)
        if (this.isLikelyFunctionDefinition(line, lines, i)) {
          return i + 1; // VSCode line numbers start from 1
        }
      }
    }
    
    return undefined;
  }

  /**
   * Determine if this is a function definition (not a function call)
   */
  private isLikelyFunctionDefinition(line: string, lines: string[], index: number): boolean {
    // Simple heuristic judgment
    
    // 1. Line starts with type declaration
    if (/^\s*\w+\s+\w+/.test(line)) {
      return true;
    }
    
    // 2. Previous line or two lines contain return type
    for (let i = Math.max(0, index - 2); i < index; i++) {
      if (/^\s*(VOID|EFI_STATUS|BOOLEAN|UINT32|UINT64|CHAR8|CHAR16)\s*$/i.test(lines[i].trim())) {
        return true;
      }
    }
    
    // 3. Following lines contain '{'
    for (let i = index; i < Math.min(lines.length, index + 3); i++) {
      if (lines[i].includes('{')) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Sort and deduplicate match results
   */
  private sortAndDeduplicateMatches(matches: FileMatch[]): FileMatch[] {
    // Deduplicate (based on file path)
    const uniqueMatches = new Map<string, FileMatch>();
    
    for (const match of matches) {
      const existing = uniqueMatches.get(match.filePath);
      
      if (!existing || match.weight > existing.weight) {
        uniqueMatches.set(match.filePath, match);
      }
    }
    
    // Sort (by weight in descending order)
    const sortedMatches = Array.from(uniqueMatches.values()).sort((a, b) => {
      // Compare weight first
      if (b.weight !== a.weight) {
        return b.weight - a.weight;
      }
      
      // When weight is same, Override files have priority
      if (a.isOverride !== b.isOverride) {
        return a.isOverride ? -1 : 1;
      }
      
      // Finally sort by path length (shorter is better)
      return a.filePath.length - b.filePath.length;
    });
    
    return sortedMatches;
  }

  /**
   * Clean expired search cache
   */
  private cleanExpiredSearchCache(): void {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [key, cache] of this.searchCache.entries()) {
      if ((now - cache.timestamp) > this.SEARCH_CACHE_EXPIRY_MS) {
        this.searchCache.delete(key);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      logDebug(`[CrossFolderNavigator] Cleaned ${cleanedCount} expired search cache entries`);
    }
  }

  /**
   * Clear search cache
   */
  clearCache(): void {
    const size = this.searchCache.size;
    this.searchCache.clear();
    logInfo(`[CrossFolderNavigator] Search cache cleared (${size} entries)`);
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[]; totalMatches: number } {
    let totalMatches = 0;
    for (const cache of this.searchCache.values()) {
      totalMatches += cache.matches.length;
    }
    
    return {
      size: this.searchCache.size,
      keys: Array.from(this.searchCache.keys()),
      totalMatches
    };
  }
}