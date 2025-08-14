// src/edk2-debug/providers/logLinkProvider.ts
// DocumentLinkProvider - 支援 Enhanced Debug Log 的 Ctrl+Click 跳轉

import * as vscode from 'vscode';
import { EnhancedLogParser, EnhancedLogEntry } from '../analysis/enhancedLogParser';
import { CrossFolderNavigator } from '../core/crossFolderNavigator';
import { logMessage, handleError } from '../../shared/utils/logger';

/**
 * DocumentLinks 快取項目
 */
interface DocumentLinksCache {
  links: vscode.DocumentLink[];
  version: number;
  timestamp: number;
  lineCount: number;
}

/**
 * Log 檔案的 DocumentLinkProvider
 * 為 Enhanced Debug 格式提供 Ctrl+Click 跳轉功能
 */
export class LogLinkProvider implements vscode.DocumentLinkProvider {
  private navigator: CrossFolderNavigator;
  private documentLinksCache = new Map<string, DocumentLinksCache>();
  private readonly CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 分鐘過期

  constructor() {
    this.navigator = new CrossFolderNavigator();
    logMessage(`[LogLinkProvider] 初始化完成`);
  }

  /**
   * 提供文件連結 (為 Enhanced Debug 行建立可點擊連結)
   */
  async provideDocumentLinks(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): Promise<vscode.DocumentLink[]> {
    
    const startTime = Date.now();
    logMessage(`[LogLinkProvider] 開始分析文件: ${document.fileName}`);
    
    // 檢查快取
    const cacheKey = document.uri.toString();
    const cached = this.documentLinksCache.get(cacheKey);
    const now = Date.now();
    
    if (cached && 
        cached.version === document.version && 
        cached.lineCount === document.lineCount &&
        (now - cached.timestamp) < this.CACHE_EXPIRY_MS) {
      
      logMessage(`[LogLinkProvider] 使用快取結果 (${cached.links.length} 個連結, 耗時: ${Date.now() - startTime}ms)`);
      return cached.links;
    }
    
    // 檢查是否為 Enhanced Debug 日誌檔案
    if (!EnhancedLogParser.hasEnhancedDebugContent(document)) {
      logMessage(`[LogLinkProvider] 文件不包含 Enhanced Debug 內容，跳過`);
      return [];
    }

    const links: vscode.DocumentLink[] = [];
    const content = document.getText();
    const lines = content.split('\n');
    
    logMessage(`[LogLinkProvider] 開始處理 ${lines.length} 行日誌 (快取失效，重新解析)`);

    for (let i = 0; i < lines.length; i++) {
      if (token.isCancellationRequested) {
        logMessage(`[LogLinkProvider] 操作被取消`);
        break;
      }

      const link = this.createDocumentLink(lines[i], i);
      if (link) {
        links.push(link);
      }
    }
    
    // 儲存到快取
    this.documentLinksCache.set(cacheKey, {
      links: links,
      version: document.version,
      timestamp: now,
      lineCount: document.lineCount
    });
    
    // 清理過期快取
    this.cleanExpiredCache();
    
    const duration = Date.now() - startTime;
    logMessage(`[LogLinkProvider] 完成分析，建立了 ${links.length} 個連結 (耗時: ${duration}ms, 已快取)`);
    return links;
  }

  /**
   * 解析文件連結 (當使用者點擊連結時觸發)
   */
  async resolveDocumentLink(
    link: vscode.DocumentLink,
    token: vscode.CancellationToken
  ): Promise<vscode.DocumentLink> {
    
    logMessage(`[LogLinkProvider] resolveDocumentLink 被呼叫`);
    
    // 檢查是否有跳轉資訊
    const jumpInfo = (link as any).jumpInfo;
    if (!jumpInfo) {
      logMessage(`[LogLinkProvider] 連結沒有跳轉資訊`);
      return link;
    }

    try {
      logMessage(`[LogLinkProvider] 解析跳轉請求: ${JSON.stringify(jumpInfo)}`);
      
      // 執行實際跳轉
      await this.performJump(jumpInfo);
      
      // 不設定 target，讓 VSCode 知道這是一個已處理的連結
      // 這樣就不會嘗試開啟無效的 URI
      
    } catch (error) {
      handleError(`[LogLinkProvider] 跳轉失敗: ${error}`);
    }
    
    return link;
  }

  /**
   * 執行實際的檔案跳轉
   */
  private async performJump(jumpInfo: {
    module: string;
    function: string;
    line: number;
    sequence: number;
  }): Promise<void> {
    
    logMessage(`[LogLinkProvider] 開始執行跳轉: ${jumpInfo.module}:${jumpInfo.function}:${jumpInfo.line}`);
    
    try {
      // 使用 CrossFolderNavigator 搜尋檔案
      const matchingFiles = await this.navigator.findSourceFiles(
        jumpInfo.module, 
        jumpInfo.function
      );
      
      if (matchingFiles.length === 0) {
        vscode.window.showWarningMessage(
          `找不到函數 ${jumpInfo.function} 的源碼檔案`
        );
        logMessage(`[LogLinkProvider] 跳轉失敗: 找不到匹配的檔案`);
        return;
      }
      
      // 根據匹配數量決定處理方式
      let targetFile: string | undefined;
      
      if (matchingFiles.length === 0) {
        // 沒有找到匹配檔案
        vscode.window.showWarningMessage(
          `找不到函數 ${jumpInfo.function} 的源碼檔案。請確認當前工作區包含 BIOS 專案源碼。`
        );
        logMessage(`[LogLinkProvider] 沒有找到匹配檔案: ${jumpInfo.module}:${jumpInfo.function}`);
        return;
        
      } else if (matchingFiles.length === 1) {
        // 只有一個匹配，直接跳轉
        targetFile = matchingFiles[0];
        logMessage(`[LogLinkProvider] 找到唯一匹配檔案: ${targetFile}`);
        
      } else {
        // 多個匹配，顯示選擇視窗
        logMessage(`[LogLinkProvider] 找到 ${matchingFiles.length} 個匹配檔案，顯示選擇視窗`);
        
        const selectedFile = await this.showFileSelectionQuickPick(matchingFiles, jumpInfo);
        if (!selectedFile) {
          logMessage(`[LogLinkProvider] 使用者取消選擇`);
          return;
        }
        targetFile = selectedFile;
      }
      
      // 確保 targetFile 有效後再開啟檔案
      if (targetFile && targetFile.trim()) {
        await this.openFileAtLine(targetFile, jumpInfo.line);
        logMessage(`[LogLinkProvider] 跳轉成功: ${targetFile}:${jumpInfo.line}`);
      } else {
        throw new Error(`無效的檔案路徑: ${targetFile}`);
      }
      
    } catch (error) {
      handleError(`[LogLinkProvider] 跳轉執行失敗: ${error}`);
      vscode.window.showErrorMessage(`跳轉失敗: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 顯示檔案選擇快速選擇視窗
   */
  private async showFileSelectionQuickPick(
    files: string[], 
    jumpInfo: { module: string; function: string; line: number; sequence: number }
  ): Promise<string | undefined> {
    
    logMessage(`[LogLinkProvider] 顯示檔案選擇視窗，${files.length} 個選項`);
    
    const items: Array<vscode.QuickPickItem & { filePath: string }> = files.map(file => {
      const isOverride = file.includes('Override');
      const relativePath = vscode.workspace.asRelativePath(file);
      
      return {
        label: `${isOverride ? '🔧' : '📄'} ${this.getFileName(file)}`,
        description: relativePath,
        detail: isOverride ? 'Modified version (Override)' : 'Original version',
        filePath: file
      };
    });
    
    // 排序: Override 檔案優先
    items.sort((a, b) => {
      const aIsOverride = a.filePath.includes('Override') ? 0 : 1;
      const bIsOverride = b.filePath.includes('Override') ? 0 : 1;
      return aIsOverride - bIsOverride;
    });
    
    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: `Select file to jump to ${jumpInfo.function}:${jumpInfo.line}`,
      matchOnDescription: true,
      matchOnDetail: true
    });
    
    if (selected) {
      logMessage(`[LogLinkProvider] 使用者選擇: ${selected.filePath}`);
      return selected.filePath;
    }
    
    return undefined;
  }

  /**
   * 開啟檔案並跳轉到指定行
   */
  private async openFileAtLine(filePath: string, lineNumber: number): Promise<void> {
    try {
      const document = await vscode.workspace.openTextDocument(filePath);
      const editor = await vscode.window.showTextDocument(document);
      
      // 跳轉到指定行 (VSCode 行號從0開始，log中的行號從1開始)
      const targetLine = Math.max(0, lineNumber - 1);
      const position = new vscode.Position(targetLine, 0);
      
      // 設定游標位置和選擇
      editor.selection = new vscode.Selection(position, position);
      
      // 將該行顯示在編輯器中央
      editor.revealRange(
        new vscode.Range(position, position), 
        vscode.TextEditorRevealType.InCenter
      );
      
      logMessage(`[LogLinkProvider] 檔案開啟成功，跳轉到第 ${lineNumber} 行`);
      
    } catch (error) {
      throw new Error(`無法開啟檔案 ${filePath}: ${error}`);
    }
  }

  /**
   * 從完整路徑中提取檔案名稱
   */
  private getFileName(filePath: string): string {
    const parts = filePath.split(/[\\\/]/);
    return parts[parts.length - 1] || filePath;
  }

  /**
   * 清理過期的快取項目
   */
  private cleanExpiredCache(): void {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [key, cache] of this.documentLinksCache.entries()) {
      if ((now - cache.timestamp) > this.CACHE_EXPIRY_MS) {
        this.documentLinksCache.delete(key);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      logMessage(`[LogLinkProvider] 清理了 ${cleanedCount} 個過期快取項目`);
    }
  }

  /**
   * 取得快取統計資訊
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.documentLinksCache.size,
      keys: Array.from(this.documentLinksCache.keys())
    };
  }

  /**
   * 清除所有快取
   */
  clearAllCache(): void {
    const size = this.documentLinksCache.size;
    this.documentLinksCache.clear();
    this.navigator.clearCache();
    logMessage(`[LogLinkProvider] 已清除所有快取 (${size} 個 DocumentLinks + CrossFolderNavigator 快取)`);
  }

  /**
   * 為單行創建 DocumentLink
   */
  private createDocumentLink(line: string, lineIndex: number): vscode.DocumentLink | null {
    const entry = EnhancedLogParser.parseLogLine(line, lineIndex);
    
    if (entry.isValid && entry.functionStartCol !== undefined && entry.functionEndCol !== undefined) {
      const startPos = new vscode.Position(lineIndex, entry.functionStartCol);
      const endPos = new vscode.Position(lineIndex, entry.functionEndCol);
      const range = new vscode.Range(startPos, endPos);
      
      const link = new vscode.DocumentLink(range);
      link.tooltip = `Ctrl+Click to jump to ${entry.function} at line ${entry.line}`;
      
      // 將跳轉資訊儲存在 link 物件中
      (link as any).jumpInfo = {
        module: entry.module,
        function: entry.function,
        line: entry.line,
        sequence: entry.sequence
      };
      
      return link;
    }
    
    return null;
  }
}

/**
 * 註冊 Enhanced Debug 跳轉 URI 處理器
 */
export function registerEnhancedDebugUriHandler(context: vscode.ExtensionContext): void {
  const disposable = vscode.window.registerUriHandler({
    handleUri(uri: vscode.Uri): vscode.ProviderResult<void> {
      if (uri.scheme === 'enhanced-debug' && uri.authority === 'jump') {
        logMessage(`[EnhancedDebugUriHandler] 處理跳轉 URI: ${uri.toString()}`);
        
        // 這裡可以添加額外的跳轉邏輯
        // 目前主要邏輯在 LogLinkProvider.resolveDocumentLink 中處理
      }
    }
  });
  
  context.subscriptions.push(disposable);
  logMessage(`[EnhancedDebugUriHandler] URI 處理器註冊完成`);
}