// src/edk2-debug/core/crossFolderNavigator.ts
// Override 感知的搜尋引擎 - 支援跨資料夾源碼搜尋

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { EnhancedLogParser } from '../analysis/enhancedLogParser';
import { logError, logInfo, logDebug, logSummary } from '../../shared/utils/logger';

/**
 * 檔案匹配結果
 */
export interface FileMatch {
  /** 檔案完整路徑 */
  filePath: string;
  /** 是否為 Override 版本 */
  isOverride: boolean;
  /** 匹配權重 (越高越好) */
  weight: number;
  /** 匹配原因 */
  reason: string;
  /** 函數在檔案中的行號 (如果找到) */
  functionLine?: number;
}

/**
 * 搜尋快取項目
 */
interface SearchCacheItem {
  matches: FileMatch[];
  timestamp: number;
}

/**
 * 跨資料夾導航器
 * 實現 Override 感知的智能源碼搜尋
 */
export class CrossFolderNavigator {
  private searchCache: Map<string, SearchCacheItem> = new Map();
  private readonly SEARCH_CACHE_EXPIRY_MS = 10 * 60 * 1000; // 10 分鐘過期
  
  constructor() {
    logInfo(`[CrossFolderNavigator] 初始化完成`);
  }

  /**
   * 搜尋源碼檔案 (主要入口)
   * @param moduleName 模組名稱
   * @param functionName 函數名稱
   * @returns 匹配的檔案列表 (按權重排序)
   */
  async findSourceFiles(moduleName: string, functionName: string): Promise<string[]> {
    const startTime = Date.now();
    logDebug(`[CrossFolderNavigator] 搜尋源碼: ${moduleName}:${functionName}`);
    
    const cacheKey = `${moduleName}:${functionName}`;
    const now = Date.now();
    
    // 檢查快取
    const cached = this.searchCache.get(cacheKey);
    if (cached && (now - cached.timestamp) < this.SEARCH_CACHE_EXPIRY_MS) {
      const filePaths = cached.matches.map(match => match.filePath);
      logDebug(`[CrossFolderNavigator] 使用快取結果 (${filePaths.length} 個檔案, 耗時: ${Date.now() - startTime}ms)`);
      return filePaths;
    }
    
    try {
      // 執行多重搜尋策略
      const matches = await this.performMultipleSearchStrategies(moduleName, functionName);
      
      // 排序和去重
      const sortedMatches = this.sortAndDeduplicateMatches(matches);
      
      // 快取結果
      this.searchCache.set(cacheKey, {
        matches: sortedMatches,
        timestamp: now
      });
      
      // 清理過期快取
      this.cleanExpiredSearchCache();
      
      const filePaths = sortedMatches.map(match => match.filePath);
      
      const duration = Date.now() - startTime;
      logSummary(`[CrossFolderNavigator] 搜尋完成，找到 ${filePaths.length} 個匹配檔案 (耗時: ${duration}ms, 已快取)`);
      
      // 記錄搜尋結果詳情
      sortedMatches.forEach((match, index) => {
        logDebug(`[CrossFolderNavigator]   ${index + 1}. ${match.filePath} (${match.reason}, 權重: ${match.weight})`);
      });
      
      return filePaths;
      
    } catch (error) {
      logError(`[CrossFolderNavigator] 搜尋失敗: ${error}`);
      return [];
    }
  }

  /**
   * 執行多重搜尋策略
   */
  private async performMultipleSearchStrategies(
    moduleName: string, 
    functionName: string
  ): Promise<FileMatch[]> {
    
    const matches: FileMatch[] = [];
    
    // 策略1: Override 目錄優先搜尋
    logDebug(`[CrossFolderNavigator] 執行策略1: Override 目錄搜尋`);
    const overrideMatches = await this.searchInOverrideDirectories(moduleName, functionName);
    matches.push(...overrideMatches);
    
    // 策略2: 模組目錄搜尋
    logDebug(`[CrossFolderNavigator] 執行策略2: 模組目錄搜尋`);
    const moduleMatches = await this.searchInModuleDirectories(moduleName, functionName);
    matches.push(...moduleMatches);
    
    // 策略3: 函數名全域搜尋
    logDebug(`[CrossFolderNavigator] 執行策略3: 函數名全域搜尋`);
    const functionMatches = await this.searchByFunctionName(functionName);
    matches.push(...functionMatches);
    
    // 策略4: 檔案名模糊搜尋
    logDebug(`[CrossFolderNavigator] 執行策略4: 檔案名模糊搜尋`);
    const fileNameMatches = await this.searchByFileName(moduleName);
    matches.push(...fileNameMatches);
    
    return matches;
  }

  /**
   * 策略1: Override 目錄優先搜尋
   */
  private async searchInOverrideDirectories(
    moduleName: string, 
    functionName: string
  ): Promise<FileMatch[]> {
    
    const matches: FileMatch[] = [];
    
    // 搜尋 Override 目錄下的檔案
    const overridePattern = '**/Override/**/*.{c,h}';
    const overrideFiles = await vscode.workspace.findFiles(overridePattern, '**/node_modules/**');
    
    logDebug(`[CrossFolderNavigator] 在 Override 目錄找到 ${overrideFiles.length} 個檔案`);
    
    for (const file of overrideFiles) {
      try {
        const content = fs.readFileSync(file.fsPath, 'utf-8');
        
        // 檢查是否包含目標函數
        if (this.containsFunction(content, functionName)) {
          const functionLine = this.findFunctionLine(content, functionName);
          
          matches.push({
            filePath: file.fsPath,
            isOverride: true,
            weight: 100, // Override 檔案最高權重
            reason: 'Found in Override directory',
            functionLine
          });
          
          logDebug(`[CrossFolderNavigator] Override 匹配: ${file.fsPath}`);
        }
        
      } catch (error) {
        // 忽略讀取錯誤，繼續搜尋下一個檔案
      }
    }
    
    return matches;
  }

  /**
   * 策略2: 模組目錄搜尋
   */
  private async searchInModuleDirectories(
    moduleName: string, 
    functionName: string
  ): Promise<FileMatch[]> {
    
    const matches: FileMatch[] = [];
    
    // 映射 DebugLib 變體名稱到實際模組
    const mappedModuleName = EnhancedLogParser.mapDebugLibToModule(moduleName);
    
    // 搜尋模組相關目錄
    const modulePatterns = [
      `**/${mappedModuleName}/**/*.{c,h}`,
      `**/*${mappedModuleName}*/**/*.{c,h}`,
      `**/Library/${mappedModuleName}*/**/*.{c,h}`,
      `**/Library/*${mappedModuleName}*/**/*.{c,h}`
    ];
    
    for (const pattern of modulePatterns) {
      try {
        const moduleFiles = await vscode.workspace.findFiles(pattern, '**/node_modules/**');
        logDebug(`[CrossFolderNavigator] 模組搜尋 '${pattern}' 找到 ${moduleFiles.length} 個檔案`);
        
        for (const file of moduleFiles) {
          try {
            const content = fs.readFileSync(file.fsPath, 'utf-8');
            
            if (this.containsFunction(content, functionName)) {
              const isOverride = file.fsPath.includes('Override');
              const functionLine = this.findFunctionLine(content, functionName);
              
              matches.push({
                filePath: file.fsPath,
                isOverride,
                weight: isOverride ? 90 : 70, // Override 版本權重更高
                reason: `Found in ${mappedModuleName} module directory`,
                functionLine
              });
              
              logDebug(`[CrossFolderNavigator] 模組匹配: ${file.fsPath}`);
            }
            
          } catch (error) {
            // 忽略讀取錯誤
          }
        }
        
      } catch (error) {
        logError(`[CrossFolderNavigator] 模組搜尋模式 '${pattern}' 失敗: ${error}`);
      }
    }
    
    return matches;
  }

  /**
   * 策略3: 函數名全域搜尋
   */
  private async searchByFunctionName(functionName: string): Promise<FileMatch[]> {
    const matches: FileMatch[] = [];
    
    try {
      // 搜尋所有 .c 和 .h 檔案
      const allFiles = await vscode.workspace.findFiles('**/*.{c,h}', '**/node_modules/**');
      logDebug(`[CrossFolderNavigator] 函數名搜尋：檢查 ${allFiles.length} 個檔案`);
      
      // 限制搜尋數量以避免效能問題 (優化: 500 -> 100)
      const maxFiles = 100;
      const filesToSearch = allFiles.slice(0, maxFiles);
      
      if (allFiles.length > maxFiles) {
        logDebug(`[CrossFolderNavigator] 檔案數量過多 (${allFiles.length})，限制搜尋前 ${maxFiles} 個檔案`);
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
              weight: isOverride ? 60 : 40, // 全域搜尋權重較低
              reason: 'Found by function name search',
              functionLine
            });
            
            logDebug(`[CrossFolderNavigator] 函數名匹配: ${file.fsPath}`);
          }
          
        } catch (error) {
          // 忽略讀取錯誤
        }
      }
      
    } catch (error) {
      logError(`[CrossFolderNavigator] 函數名搜尋失敗: ${error}`);
    }
    
    return matches;
  }

  /**
   * 策略4: 檔案名模糊搜尋
   */
  private async searchByFileName(moduleName: string): Promise<FileMatch[]> {
    const matches: FileMatch[] = [];
    
    try {
      // 根據模組名搜尋相似的檔案名
      const fileNamePatterns = [
        `**/${moduleName}.{c,h}`,
        `**/*${moduleName}*.{c,h}`,
        `**/${moduleName}*.{c,h}`
      ];
      
      for (const pattern of fileNamePatterns) {
        const files = await vscode.workspace.findFiles(pattern, '**/node_modules/**');
        logDebug(`[CrossFolderNavigator] 檔案名搜尋 '${pattern}' 找到 ${files.length} 個檔案`);
        
        for (const file of files) {
          const isOverride = file.fsPath.includes('Override');
          
          matches.push({
            filePath: file.fsPath,
            isOverride,
            weight: isOverride ? 30 : 20, // 檔案名匹配權重最低
            reason: 'Found by file name pattern',
          });
        }
      }
      
    } catch (error) {
      logError(`[CrossFolderNavigator] 檔案名搜尋失敗: ${error}`);
    }
    
    return matches;
  }

  /**
   * 檢查檔案內容是否包含指定函數
   */
  private containsFunction(content: string, functionName: string): boolean {
    // 檢查函數定義模式
    const functionPatterns = [
      new RegExp(`\\b${functionName}\\s*\\(`, 'i'), // 函數呼叫/定義
      new RegExp(`^\\s*\\w+.*\\s+${functionName}\\s*\\(`, 'm'), // 函數定義行
    ];
    
    return functionPatterns.some(pattern => pattern.test(content));
  }

  /**
   * 在檔案內容中尋找函數定義的行號
   */
  private findFunctionLine(content: string, functionName: string): number | undefined {
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 尋找函數定義模式
      const functionDefPattern = new RegExp(`\\b${functionName}\\s*\\(`);
      if (functionDefPattern.test(line)) {
        // 檢查是否為函數定義（而非函數呼叫）
        if (this.isLikelyFunctionDefinition(line, lines, i)) {
          return i + 1; // VSCode 行號從 1 開始
        }
      }
    }
    
    return undefined;
  }

  /**
   * 判斷是否為函數定義（而非函數呼叫）
   */
  private isLikelyFunctionDefinition(line: string, lines: string[], index: number): boolean {
    // 簡單的啟發式判斷
    
    // 1. 行開頭有類型聲明
    if (/^\s*\w+\s+\w+/.test(line)) {
      return true;
    }
    
    // 2. 前一行或前兩行包含返回類型
    for (let i = Math.max(0, index - 2); i < index; i++) {
      if (/^\s*(VOID|EFI_STATUS|BOOLEAN|UINT32|UINT64|CHAR8|CHAR16)\s*$/i.test(lines[i].trim())) {
        return true;
      }
    }
    
    // 3. 後續行包含 '{'
    for (let i = index; i < Math.min(lines.length, index + 3); i++) {
      if (lines[i].includes('{')) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * 排序和去重匹配結果
   */
  private sortAndDeduplicateMatches(matches: FileMatch[]): FileMatch[] {
    // 去重 (根據檔案路徑)
    const uniqueMatches = new Map<string, FileMatch>();
    
    for (const match of matches) {
      const existing = uniqueMatches.get(match.filePath);
      
      if (!existing || match.weight > existing.weight) {
        uniqueMatches.set(match.filePath, match);
      }
    }
    
    // 排序 (按權重降序)
    const sortedMatches = Array.from(uniqueMatches.values()).sort((a, b) => {
      // 優先比較權重
      if (b.weight !== a.weight) {
        return b.weight - a.weight;
      }
      
      // 權重相同時，Override 檔案優先
      if (a.isOverride !== b.isOverride) {
        return a.isOverride ? -1 : 1;
      }
      
      // 最後按路徑長度排序 (路徑越短越好)
      return a.filePath.length - b.filePath.length;
    });
    
    return sortedMatches;
  }

  /**
   * 清理過期的搜尋快取
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
      logDebug(`[CrossFolderNavigator] 清理了 ${cleanedCount} 個過期搜尋快取`);
    }
  }

  /**
   * 清除搜尋快取
   */
  clearCache(): void {
    const size = this.searchCache.size;
    this.searchCache.clear();
    logInfo(`[CrossFolderNavigator] 搜尋快取已清除 (${size} 個項目)`);
  }

  /**
   * 取得快取統計
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