// src/edk2-debug/commands/jumpToSourceCommand.ts
// 跳轉到源碼命令處理器

import * as vscode from 'vscode';
import { CrossFolderNavigator } from '../core/crossFolderNavigator';
import { logMessage, handleError } from '../../shared/utils/logger';

/**
 * 全域導航器實例 (單例)
 */
let globalNavigator: CrossFolderNavigator | undefined;

/**
 * 取得導航器實例
 */
function getNavigator(): CrossFolderNavigator {
  if (!globalNavigator) {
    globalNavigator = new CrossFolderNavigator();
  }
  return globalNavigator;
}

/**
 * 處理跳轉到源碼命令
 * @param moduleName 模組名稱
 * @param functionName 函數名稱  
 * @param lineNumber 行號
 */
export async function handleJumpToSourceCommand(
  moduleName: string,
  functionName: string, 
  lineNumber: number
): Promise<void> {
  
  logMessage(`[JumpToSourceCommand] 處理跳轉請求: ${moduleName}:${functionName}:${lineNumber}`);
  
  try {
    const navigator = getNavigator();
    
    // 顯示進度指示器
    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: `Searching for ${functionName}...`,
      cancellable: true
    }, async (progress, token) => {
      
      progress.report({ increment: 20, message: "Searching in Override directories..." });
      
      // 搜尋匹配的檔案
      const matchingFiles = await navigator.findSourceFiles(moduleName, functionName);
      
      if (token.isCancellationRequested) {
        logMessage(`[JumpToSourceCommand] 搜尋被使用者取消`);
        return;
      }
      
      progress.report({ increment: 80, message: "Processing results..." });
      
      if (matchingFiles.length === 0) {
        vscode.window.showWarningMessage(
          `找不到函數 ${functionName} 的源碼檔案。請確認當前工作區包含 BIOS 專案源碼。`
        );
        logMessage(`[JumpToSourceCommand] 沒有找到匹配的檔案`);
        return;
      }
      
      // 根據匹配數量決定處理方式
      let targetFile: string;
      
      if (matchingFiles.length === 1) {
        // 只有一個匹配，直接跳轉
        targetFile = matchingFiles[0];
        logMessage(`[JumpToSourceCommand] 找到唯一匹配: ${targetFile}`);
        
      } else {
        // 多個匹配，顯示選擇視窗
        logMessage(`[JumpToSourceCommand] 找到 ${matchingFiles.length} 個匹配，顯示選擇視窗`);
        
        progress.report({ increment: 100, message: "Showing file selection..." });
        
        const selectedFile = await showFileSelectionQuickPick(
          matchingFiles, 
          { module: moduleName, function: functionName, line: lineNumber }
        );
        
        if (!selectedFile) {
          logMessage(`[JumpToSourceCommand] 使用者取消選擇`);
          return;
        }
        
        targetFile = selectedFile;
      }
      
      // 開啟檔案並跳轉
      progress.report({ increment: 100, message: "Opening file..." });
      await openFileAtLine(targetFile, lineNumber);
      
      logMessage(`[JumpToSourceCommand] 跳轉成功: ${targetFile}:${lineNumber}`);
    });
    
  } catch (error) {
    handleError(`[JumpToSourceCommand] 跳轉失敗: ${error}`);
    vscode.window.showErrorMessage(
      `跳轉失敗: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * 顯示檔案選擇快速選擇視窗
 */
async function showFileSelectionQuickPick(
  files: string[],
  jumpInfo: { module: string; function: string; line: number }
): Promise<string | undefined> {
  
  logMessage(`[JumpToSourceCommand] 顯示檔案選擇視窗，${files.length} 個選項`);
  
  // 建立選項清單
  const items: Array<vscode.QuickPickItem & { filePath: string }> = files.map(file => {
    const isOverride = file.includes('Override');
    const relativePath = vscode.workspace.asRelativePath(file);
    
    // 提取檔案名和目錄結構
    const fileName = getFileName(file);
    const dirPath = getDirectoryPath(relativePath);
    
    return {
      label: `${isOverride ? '🔧' : '📄'} ${fileName}:${jumpInfo.function}()`,
      description: dirPath,
      detail: `${isOverride ? 'Modified version (Override)' : 'Original version'} - Line ${jumpInfo.line}`,
      filePath: file
    };
  });
  
  // 智能排序: Override 檔案優先
  items.sort((a, b) => {
    const aIsOverride = a.filePath.includes('Override') ? 0 : 1;
    const bIsOverride = b.filePath.includes('Override') ? 0 : 1;
    
    if (aIsOverride !== bIsOverride) {
      return aIsOverride - bIsOverride;
    }
    
    // Override 優先級相同時，按路徑長度排序
    return a.filePath.length - b.filePath.length;
  });
  
  // 顯示選擇視窗
  const selected = await vscode.window.showQuickPick(items, {
    title: `Multiple matches found for ${jumpInfo.function}`,
    placeHolder: `Select file to jump to ${jumpInfo.function}:${jumpInfo.line}`,
    matchOnDescription: true,
    matchOnDetail: true,
    ignoreFocusOut: true
  });
  
  if (selected) {
    logMessage(`[JumpToSourceCommand] 使用者選擇: ${selected.filePath}`);
    return selected.filePath;
  }
  
  return undefined;
}

/**
 * 開啟檔案並跳轉到指定行
 */
async function openFileAtLine(filePath: string, lineNumber: number): Promise<void> {
  try {
    logMessage(`[JumpToSourceCommand] 開啟檔案: ${filePath}, 行號: ${lineNumber}`);
    
    const document = await vscode.workspace.openTextDocument(filePath);
    const editor = await vscode.window.showTextDocument(document);
    
    // 跳轉到指定行 (VSCode 行號從0開始，log中的行號從1開始)
    const targetLine = Math.max(0, lineNumber - 1);
    const position = new vscode.Position(targetLine, 0);
    
    // 設定游標位置和選擇
    editor.selection = new vscode.Selection(position, position);
    
    // 將該行顯示在編輯器中央，並高亮顯示
    editor.revealRange(
      new vscode.Range(position, position), 
      vscode.TextEditorRevealType.InCenter
    );
    
    // 嘗試尋找函數定義的確切位置
    const content = document.getText();
    const actualFunctionLine = findFunctionDefinitionLine(content, position.line);
    
    if (actualFunctionLine !== null && actualFunctionLine !== position.line) {
      // 如果找到更準確的函數位置，跳轉到那裡
      const actualPosition = new vscode.Position(actualFunctionLine, 0);
      editor.selection = new vscode.Selection(actualPosition, actualPosition);
      editor.revealRange(
        new vscode.Range(actualPosition, actualPosition),
        vscode.TextEditorRevealType.InCenter
      );
      
      logMessage(`[JumpToSourceCommand] 調整到實際函數位置: 第 ${actualFunctionLine + 1} 行`);
    }
    
    logMessage(`[JumpToSourceCommand] 檔案開啟成功`);
    
  } catch (error) {
    throw new Error(`無法開啟檔案 ${filePath}: ${error}`);
  }
}

/**
 * 在指定行附近尋找函數定義
 */
function findFunctionDefinitionLine(content: string, startLine: number): number | null {
  const lines = content.split('\n');
  const searchRange = 10; // 向前後各搜尋10行
  
  // 搜尋範圍
  const startSearch = Math.max(0, startLine - searchRange);
  const endSearch = Math.min(lines.length - 1, startLine + searchRange);
  
  for (let i = startSearch; i <= endSearch; i++) {
    const line = lines[i];
    
    // 尋找函數定義模式
    if (isLikelyFunctionDefinitionLine(line, lines, i)) {
      return i;
    }
  }
  
  return null;
}

/**
 * 判斷是否為函數定義行
 */
function isLikelyFunctionDefinitionLine(line: string, lines: string[], index: number): boolean {
  // 包含函數定義特徵的行
  const functionPatterns = [
    /^\s*\w+\s+\w+\s*\([^)]*\)\s*[{]?/,  // 返回類型 函數名(參數) {
    /^\s*\w+\s*\([^)]*\)\s*[{]?/,        // 函數名(參數) {
  ];
  
  const hasFunctionPattern = functionPatterns.some(pattern => pattern.test(line));
  
  if (hasFunctionPattern) {
    // 檢查後續行是否有 '{'
    for (let i = index; i < Math.min(lines.length, index + 3); i++) {
      if (lines[i].includes('{')) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * 從完整路徑中提取檔案名稱
 */
function getFileName(filePath: string): string {
  const parts = filePath.split(/[\\\/]/);
  return parts[parts.length - 1] || filePath;
}

/**
 * 從相對路徑中提取目錄路徑
 */
function getDirectoryPath(relativePath: string): string {
  const parts = relativePath.split(/[\\\/]/);
  if (parts.length <= 1) {
    return '';
  }
  
  // 移除檔案名，保留目錄路徑
  parts.pop();
  return parts.join('/');
}

/**
 * 清除導航器快取 (用於測試或重置)
 */
export function clearNavigatorCache(): void {
  if (globalNavigator) {
    globalNavigator.clearCache();
    logMessage(`[JumpToSourceCommand] 導航器快取已清除`);
  }
}