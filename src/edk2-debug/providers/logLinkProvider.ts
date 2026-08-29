// src/edk2-debug/providers/logLinkProvider.ts
// DocumentLinkProvider - Supports Ctrl+Click navigation for Enhanced Debug Log

import * as vscode from 'vscode';
import { EnhancedLogParser, EnhancedLogEntry } from '../analysis/enhancedLogParser';
import { CrossFolderNavigator } from '../core/crossFolderNavigator';
import { logError, logInfo, logDebug, handleError } from '../../shared/utils/logger';

/**
 * DocumentLinks cache item
 */
interface DocumentLinksCache {
  links: vscode.DocumentLink[];
  version: number;
  timestamp: number;
  lineCount: number;
}

/**
 * DocumentLinkProvider for log files
 * Provides Ctrl+Click navigation functionality for Enhanced Debug format
 */
export class LogLinkProvider implements vscode.DocumentLinkProvider {
  private navigator: CrossFolderNavigator;
  private documentLinksCache = new Map<string, DocumentLinksCache>();
  private readonly CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes expiry

  constructor() {
    this.navigator = new CrossFolderNavigator();
    logDebug(`[LogLinkProvider] Initialization completed`);
  }

  /**
   * Provide document links (create clickable links for Enhanced Debug lines)
   */
  async provideDocumentLinks(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): Promise<vscode.DocumentLink[]> {
    
    const startTime = Date.now();
    logDebug(`[LogLinkProvider] Starting document analysis: ${document.fileName}`);
    
    // Check cache
    const cacheKey = document.uri.toString();
    const cached = this.documentLinksCache.get(cacheKey);
    const now = Date.now();
    
    if (cached && 
        cached.version === document.version && 
        cached.lineCount === document.lineCount &&
        (now - cached.timestamp) < this.CACHE_EXPIRY_MS) {
      
      logDebug(`[LogLinkProvider] Using cached result (${cached.links.length} links, time: ${Date.now() - startTime}ms)`);
      return cached.links;
    }
    
    // Check if it's an Enhanced Debug log file
    if (!EnhancedLogParser.hasEnhancedDebugContent(document)) {
      logDebug(`[LogLinkProvider] Document does not contain Enhanced Debug content, skipping`);
      return [];
    }

    const links: vscode.DocumentLink[] = [];
    const content = document.getText();
    const lines = content.split('\n');
    
    logInfo(`[LogLinkProvider] Starting to process ${lines.length} log lines (cache invalid, re-parsing)`);

    for (let i = 0; i < lines.length; i++) {
      if (token.isCancellationRequested) {
        logDebug(`[LogLinkProvider] Operation cancelled`);
        break;
      }

      const link = this.createDocumentLink(lines[i], i);
      if (link) {
        links.push(link);
      }
    }
    
    // Save to cache
    this.documentLinksCache.set(cacheKey, {
      links: links,
      version: document.version,
      timestamp: now,
      lineCount: document.lineCount
    });
    
    // Clean expired cache
    this.cleanExpiredCache();
    
    const duration = Date.now() - startTime;
    logInfo(`[LogLinkProvider] Analysis completed, created ${links.length} links (time: ${duration}ms, cached)`);
    return links;
  }

  /**
   * Resolve document link (triggered when user clicks the link)
   */
  async resolveDocumentLink(
    link: vscode.DocumentLink,
    token: vscode.CancellationToken
  ): Promise<vscode.DocumentLink> {
    
    logDebug(`[LogLinkProvider] resolveDocumentLink called`);
    
    // Check if jump information exists
    const jumpInfo = (link as any).jumpInfo;
    if (!jumpInfo) {
      logDebug(`[LogLinkProvider] Link has no jump information`);
      return link;
    }

    try {
      logDebug(`[LogLinkProvider] Parsing jump request: ${JSON.stringify(jumpInfo)}`);
      
      // Execute actual jump
      await this.performJump(jumpInfo);
      
      // Don't set target, let VSCode know this is a handled link
      // This way it won't try to open invalid URI
      
    } catch (error) {
      handleError(`[LogLinkProvider] Jump failed: ${error}`);
    }
    
    return link;
  }

  /**
   * Execute actual file jump
   */
  private async performJump(jumpInfo: {
    module: string;
    function: string;
    line: number;
    sequence: number;
  }): Promise<void> {
    
    logDebug(`[LogLinkProvider] Starting jump execution: ${jumpInfo.module}:${jumpInfo.function}:${jumpInfo.line}`);
    
    try {
      // Use CrossFolderNavigator to search files
      const matchingFiles = await this.navigator.findSourceFiles(
        jumpInfo.module, 
        jumpInfo.function
      );
      
      if (matchingFiles.length === 0) {
        vscode.window.showWarningMessage(
          `Cannot find source file for function ${jumpInfo.function}`
        );
        logDebug(`[LogLinkProvider] Jump failed: no matching files found`);
        return;
      }
      
      // Decide handling based on number of matches
      let targetFile: string | undefined;

      if (matchingFiles.length === 1) {
        // Only one match, jump directly
        targetFile = matchingFiles[0];
        logDebug(`[LogLinkProvider] Found unique matching file: ${targetFile}`);

      } else {
        // Multiple matches, show selection window
        logDebug(`[LogLinkProvider] Found ${matchingFiles.length} matching files, showing selection window`);
        
        const selectedFile = await this.showFileSelectionQuickPick(matchingFiles, jumpInfo);
        if (!selectedFile) {
          logDebug(`[LogLinkProvider] User cancelled selection`);
          return;
        }
        targetFile = selectedFile;
      }
      
      // Ensure targetFile is valid before opening file
      if (targetFile && targetFile.trim()) {
        await this.openFileAtLine(targetFile, jumpInfo.line);
        logInfo(`[LogLinkProvider] Jump successful: ${targetFile}:${jumpInfo.line}`);
      } else {
        throw new Error(`Invalid file path: ${targetFile}`);
      }
      
    } catch (error) {
      handleError(`[LogLinkProvider] Jump execution failed: ${error}`);
      vscode.window.showErrorMessage(`Jump failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Show file selection quick pick window
   */
  private async showFileSelectionQuickPick(
    files: string[], 
    jumpInfo: { module: string; function: string; line: number; sequence: number }
  ): Promise<string | undefined> {
    
    logDebug(`[LogLinkProvider] Showing file selection window, ${files.length} options`);
    
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
    
    // Sort: Override files first
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
      logDebug(`[LogLinkProvider] User selected: ${selected.filePath}`);
      return selected.filePath;
    }
    
    return undefined;
  }

  /**
   * Open file and jump to specified line
   */
  private async openFileAtLine(filePath: string, lineNumber: number): Promise<void> {
    try {
      const document = await vscode.workspace.openTextDocument(filePath);
      const editor = await vscode.window.showTextDocument(document);
      
      // Jump to specified line (VSCode line numbers start from 0, log line numbers start from 1)
      const targetLine = Math.max(0, lineNumber - 1);
      const position = new vscode.Position(targetLine, 0);
      
      // Set cursor position and selection
      editor.selection = new vscode.Selection(position, position);
      
      // Display the line in the center of the editor
      editor.revealRange(
        new vscode.Range(position, position), 
        vscode.TextEditorRevealType.InCenter
      );
      
      logDebug(`[LogLinkProvider] File opened successfully, jumped to line ${lineNumber}`);
      
    } catch (error) {
      throw new Error(`Cannot open file ${filePath}: ${error}`);
    }
  }

  /**
   * Extract file name from full path
   */
  private getFileName(filePath: string): string {
    const parts = filePath.split(/[\\\/]/);
    return parts[parts.length - 1] || filePath;
  }

  /**
   * Clean expired cache items
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
      logDebug(`[LogLinkProvider] Cleaned ${cleanedCount} expired cache items`);
    }
  }

  /**
   * Create DocumentLink for a single line
   */
  private createDocumentLink(line: string, lineIndex: number): vscode.DocumentLink | null {
    const entry = EnhancedLogParser.parseLogLine(line, lineIndex);
    
    if (entry.isValid && entry.functionStartCol !== undefined && entry.functionEndCol !== undefined) {
      const startPos = new vscode.Position(lineIndex, entry.functionStartCol);
      const endPos = new vscode.Position(lineIndex, entry.functionEndCol);
      const range = new vscode.Range(startPos, endPos);
      
      const link = new vscode.DocumentLink(range);
      link.tooltip = `Ctrl+Click to jump to ${entry.function} at line ${entry.line}`;
      
      // Store jump information in the link object
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
