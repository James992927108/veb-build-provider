// src/edk2-debug/commands/jumpToSourceCommand.ts
// Jump to source command handler

import * as vscode from 'vscode';
import { CrossFolderNavigator } from '../core/crossFolderNavigator';
import { logInfo, logDebug, handleError } from '../../shared/utils/logger';

/**
 * Global navigator instance (singleton)
 */
let globalNavigator: CrossFolderNavigator | undefined;

/**
 * Get navigator instance
 */
function getNavigator(): CrossFolderNavigator {
  if (!globalNavigator) {
    globalNavigator = new CrossFolderNavigator();
  }
  return globalNavigator;
}

/**
 * Handle jump to source command
 * @param moduleName Module name
 * @param functionName Function name
 * @param lineNumber Line number
 */
export async function handleJumpToSourceCommand(
  moduleName: string,
  functionName: string, 
  lineNumber: number
): Promise<void> {
  
  logDebug(`[JumpToSourceCommand] Handling jump request: ${moduleName}:${functionName}:${lineNumber}`);
  
  try {
    const navigator = getNavigator();
    
    // Show progress indicator
    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: `Searching for ${functionName}...`,
      cancellable: true
    }, async (progress, token) => {
      
      progress.report({ increment: 20, message: "Searching in Override directories..." });
      
      // Search for matching files
      const matchingFiles = await navigator.findSourceFiles(moduleName, functionName);
      
      if (token.isCancellationRequested) {
        logDebug(`[JumpToSourceCommand] Search cancelled by user`);
        return;
      }
      
      progress.report({ increment: 80, message: "Processing results..." });
      
      if (matchingFiles.length === 0) {
        vscode.window.showWarningMessage(
          `Cannot find source file for function ${functionName}. Please ensure current workspace contains BIOS project source code.`
        );
        logDebug(`[JumpToSourceCommand] No matching files found`);
        return;
      }
      
      // Determine handling method based on match count
      let targetFile: string;
      
      if (matchingFiles.length === 1) {
        // Only one match, jump directly
        targetFile = matchingFiles[0];
        logDebug(`[JumpToSourceCommand] Found unique match: ${targetFile}`);
        
      } else {
        // Multiple matches, show selection window
        logDebug(`[JumpToSourceCommand] Found ${matchingFiles.length} matches, showing selection window`);
        
        progress.report({ increment: 100, message: "Showing file selection..." });
        
        const selectedFile = await showFileSelectionQuickPick(
          matchingFiles, 
          { module: moduleName, function: functionName, line: lineNumber }
        );
        
        if (!selectedFile) {
          logDebug(`[JumpToSourceCommand] User cancelled selection`);
          return;
        }
        
        targetFile = selectedFile;
      }
      
      // Open file and jump
      progress.report({ increment: 100, message: "Opening file..." });
      await openFileAtLine(targetFile, lineNumber);
      
      logInfo(`[JumpToSourceCommand] Jump successful: ${targetFile}:${lineNumber}`);
    });
    
  } catch (error) {
    handleError(`[JumpToSourceCommand] Jump failed: ${error}`);
    vscode.window.showErrorMessage(
      `Jump failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Show file selection quick pick window
 */
async function showFileSelectionQuickPick(
  files: string[],
  jumpInfo: { module: string; function: string; line: number }
): Promise<string | undefined> {
  
  logDebug(`[JumpToSourceCommand] Showing file selection window, ${files.length} options`);
  
  // Build option list
  const items: Array<vscode.QuickPickItem & { filePath: string }> = files.map(file => {
    const isOverride = file.includes('Override');
    const relativePath = vscode.workspace.asRelativePath(file);
    
    // Extract filename and directory structure
    const fileName = getFileName(file);
    const dirPath = getDirectoryPath(relativePath);
    
    return {
      label: `${isOverride ? '🔧' : '📄'} ${fileName}:${jumpInfo.function}()`,
      description: dirPath,
      detail: `${isOverride ? 'Modified version (Override)' : 'Original version'} - Line ${jumpInfo.line}`,
      filePath: file
    };
  });
  
  // Smart sorting: Override files have priority
  items.sort((a, b) => {
    const aIsOverride = a.filePath.includes('Override') ? 0 : 1;
    const bIsOverride = b.filePath.includes('Override') ? 0 : 1;
    
    if (aIsOverride !== bIsOverride) {
      return aIsOverride - bIsOverride;
    }
    
    // When Override priority is same, sort by path length
    return a.filePath.length - b.filePath.length;
  });
  
  // Show selection window
  const selected = await vscode.window.showQuickPick(items, {
    title: `Multiple matches found for ${jumpInfo.function}`,
    placeHolder: `Select file to jump to ${jumpInfo.function}:${jumpInfo.line}`,
    matchOnDescription: true,
    matchOnDetail: true,
    ignoreFocusOut: true
  });
  
  if (selected) {
    logDebug(`[JumpToSourceCommand] User selected: ${selected.filePath}`);
    return selected.filePath;
  }
  
  return undefined;
}

/**
 * Open file and jump to specified line
 */
async function openFileAtLine(filePath: string, lineNumber: number): Promise<void> {
  try {
    logDebug(`[JumpToSourceCommand] Opening file: ${filePath}, line number: ${lineNumber}`);
    
    const document = await vscode.workspace.openTextDocument(filePath);
    const editor = await vscode.window.showTextDocument(document);
    
    // Jump to specified line (VSCode line numbers start from 0, log line numbers start from 1)
    const targetLine = Math.max(0, lineNumber - 1);
    const position = new vscode.Position(targetLine, 0);
    
    // Set cursor position and selection
    editor.selection = new vscode.Selection(position, position);
    
    // Display the line in center of editor and highlight
    editor.revealRange(
      new vscode.Range(position, position), 
      vscode.TextEditorRevealType.InCenter
    );
    
    // Try to find exact position of function definition
    const content = document.getText();
    const actualFunctionLine = findFunctionDefinitionLine(content, position.line);
    
    if (actualFunctionLine !== null && actualFunctionLine !== position.line) {
      // If found more accurate function position, jump there
      const actualPosition = new vscode.Position(actualFunctionLine, 0);
      editor.selection = new vscode.Selection(actualPosition, actualPosition);
      editor.revealRange(
        new vscode.Range(actualPosition, actualPosition),
        vscode.TextEditorRevealType.InCenter
      );
      
      logDebug(`[JumpToSourceCommand] Adjusted to actual function position: line ${actualFunctionLine + 1}`);
    }
    
    logDebug(`[JumpToSourceCommand] File opened successfully`);
    
  } catch (error) {
    throw new Error(`Cannot open file ${filePath}: ${error}`);
  }
}

/**
 * Find function definition near specified line
 */
function findFunctionDefinitionLine(content: string, startLine: number): number | null {
  const lines = content.split('\n');
  const searchRange = 10; // Search 10 lines forward and backward
  
  // Search range
  const startSearch = Math.max(0, startLine - searchRange);
  const endSearch = Math.min(lines.length - 1, startLine + searchRange);
  
  for (let i = startSearch; i <= endSearch; i++) {
    const line = lines[i];
    
    // Find function definition pattern
    if (isLikelyFunctionDefinitionLine(line, lines, i)) {
      return i;
    }
  }
  
  return null;
}

/**
 * Determine if this is a function definition line
 */
function isLikelyFunctionDefinitionLine(line: string, lines: string[], index: number): boolean {
  // Lines containing function definition characteristics
  const functionPatterns = [
    /^\s*\w+\s+\w+\s*\([^)]*\)\s*[{]?/,  // return_type function_name(parameters) {
    /^\s*\w+\s*\([^)]*\)\s*[{]?/,        // function_name(parameters) {
  ];
  
  const hasFunctionPattern = functionPatterns.some(pattern => pattern.test(line));
  
  if (hasFunctionPattern) {
    // Check if following lines have '{'
    for (let i = index; i < Math.min(lines.length, index + 3); i++) {
      if (lines[i].includes('{')) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Extract filename from full path
 */
function getFileName(filePath: string): string {
  const parts = filePath.split(/[\\\/]/);
  return parts[parts.length - 1] || filePath;
}

/**
 * Extract directory path from relative path
 */
function getDirectoryPath(relativePath: string): string {
  const parts = relativePath.split(/[\\\/]/);
  if (parts.length <= 1) {
    return '';
  }
  
  // Remove filename, keep directory path
  parts.pop();
  return parts.join('/');
}

/**
 * Clear navigator cache (for testing or reset)
 */
export function clearNavigatorCache(): void {
  if (globalNavigator) {
    globalNavigator.clearCache();
    logInfo(`[JumpToSourceCommand] Navigator cache cleared`);
  }
}