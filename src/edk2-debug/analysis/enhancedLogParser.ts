// src/edk2-debug/analysis/enhancedLogParser.ts
// Enhanced Debug Log 解析器 - 支援日誌轉跳功能

import * as vscode from 'vscode';
import { logMessage } from '../../shared/utils/logger';

/**
 * Enhanced Debug Log 項目
 * 格式: [Module:Function:Line:#Sequence] Message
 * 範例: [PeiCore:TestEnhancedDebugMacro:492:#1] [PEICORE][Test] message
 */
export interface EnhancedLogEntry {
  /** 原始日誌行 */
  rawLine: string;
  /** 模組名稱 (如: PeiCore, BaseDebugLibSerialPort) */
  module: string;
  /** 函數名稱 (如: TestEnhancedDebugMacro) */
  function: string;
  /** 行號 (如: 492) */
  line: number;
  /** 序號 (如: 1) */
  sequence: number;
  /** 訊息內容 */
  message: string;
  /** 是否解析成功 */
  isValid: boolean;
  /** 在文件中的行號 (用於 DocumentLink) */
  documentLine?: number;
  /** 函數名在行中的位置 (用於 DocumentLink) */
  functionStartCol?: number;
  /** 函數名結束位置 */
  functionEndCol?: number;
}

/**
 * Enhanced Debug Log 解析器
 */
export class EnhancedLogParser {
  private static readonly DEBUG_PATTERN = /^\[([^:]+):([^:]+):(\d+):#(\d+)\]\s*(.*)$/;
  
  /**
   * 解析單行 Enhanced Debug Log
   * @param logLine 日誌行
   * @param documentLine 在文件中的行號 (可選)
   * @returns 解析結果
   */
  static parseLogLine(logLine: string, documentLine?: number): EnhancedLogEntry {
    logMessage(`[EnhancedLogParser] 解析日誌行: ${logLine.substring(0, 100)}...`);
    
    const match = logLine.trim().match(this.DEBUG_PATTERN);
    
    if (match) {
      const [, module, functionName, lineStr, sequenceStr, message] = match;
      
      // 計算函數名在原始行中的位置 (用於 DocumentLink)
      const functionInOriginal = `${functionName}:${lineStr}`;
      const functionStartCol = logLine.indexOf(functionInOriginal);
      const functionEndCol = functionStartCol + functionInOriginal.length;
      
      const entry: EnhancedLogEntry = {
        rawLine: logLine,
        module: module.trim(),
        function: functionName.trim(), 
        line: parseInt(lineStr),
        sequence: parseInt(sequenceStr),
        message: message.trim(),
        isValid: true,
        documentLine,
        functionStartCol: functionStartCol >= 0 ? functionStartCol : undefined,
        functionEndCol: functionEndCol > functionStartCol ? functionEndCol : undefined
      };
      
      logMessage(`[EnhancedLogParser] 解析成功: ${entry.module}:${entry.function}:${entry.line}#${entry.sequence}`);
      return entry;
    }
    
    // 解析失敗，返回無效項目
    const invalidEntry: EnhancedLogEntry = {
      rawLine: logLine,
      module: '',
      function: '',
      line: 0,
      sequence: 0,
      message: logLine,
      isValid: false,
      documentLine
    };
    
    logMessage(`[EnhancedLogParser] 解析失敗，非 Enhanced Debug 格式`);
    return invalidEntry;
  }

  /**
   * 解析整個日誌檔案
   * @param logContent 日誌內容
   * @returns 解析結果陣列
   */
  static parseLogContent(logContent: string): EnhancedLogEntry[] {
    logMessage(`[EnhancedLogParser] 開始解析日誌內容，總長度: ${logContent.length} 字符`);
    
    const lines = logContent.split('\n');
    const results: EnhancedLogEntry[] = [];
    let validCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim()) {
        const entry = this.parseLogLine(line, i);
        results.push(entry);
        if (entry.isValid) {
          validCount++;
        }
      }
    }
    
    logMessage(`[EnhancedLogParser] 解析完成: ${validCount}/${results.length} Enhanced Debug 項目`);
    return results;
  }

  /**
   * 從日誌檔案載入並解析
   * @param logFilePath 日誌檔案路徑
   * @returns 解析結果陣列
   */
  static async parseLogFile(logFilePath: string): Promise<EnhancedLogEntry[]> {
    try {
      logMessage(`[EnhancedLogParser] 載入日誌檔案: ${logFilePath}`);
      
      const document = await vscode.workspace.openTextDocument(logFilePath);
      const content = document.getText();
      
      logMessage(`[EnhancedLogParser] 檔案載入成功，開始解析`);
      return this.parseLogContent(content);
      
    } catch (error) {
      logMessage(`[EnhancedLogParser] 載入檔案失敗 ${logFilePath}: ${error}`);
      return [];
    }
  }

  /**
   * 檢查是否為 Enhanced Debug 格式的日誌行
   * @param logLine 日誌行
   * @returns 是否為 Enhanced Debug 格式
   */
  static isEnhancedDebugLine(logLine: string): boolean {
    const result = this.DEBUG_PATTERN.test(logLine.trim());
    logMessage(`[EnhancedLogParser] 格式檢查: ${result ? '符合' : '不符合'} Enhanced Debug 格式`);
    return result;
  }

  /**
   * 檢查檔案是否包含 Enhanced Debug 內容
   * @param document VSCode 文件
   * @returns 是否包含 Enhanced Debug 格式
   */
  static hasEnhancedDebugContent(document: vscode.TextDocument): boolean {
    logMessage(`[EnhancedLogParser] 檢查檔案是否包含 Enhanced Debug 內容: ${document.fileName}`);
    
    const content = document.getText();
    const lines = content.split('\n');
    
    // 檢查前100行，如果有超過5行符合格式，則認為是 Enhanced Debug 日誌
    let matchCount = 0;
    const checkLines = Math.min(100, lines.length);
    
    for (let i = 0; i < checkLines; i++) {
      if (this.isEnhancedDebugLine(lines[i])) {
        matchCount++;
        if (matchCount >= 5) {
          logMessage(`[EnhancedLogParser] 確認為 Enhanced Debug 日誌檔案 (找到 ${matchCount}+ 匹配行)`);
          return true;
        }
      }
    }
    
    logMessage(`[EnhancedLogParser] 不是 Enhanced Debug 日誌檔案 (僅找到 ${matchCount} 匹配行)`);
    return false;
  }

  /**
   * 從解析結果中提取唯一的模組列表
   * @param entries 解析結果陣列
   * @returns 唯一模組列表
   */
  static extractUniqueModules(entries: EnhancedLogEntry[]): string[] {
    const modules = entries
      .filter(entry => entry.isValid)
      .map(entry => entry.module);
    const uniqueModules = Array.from(new Set(modules)).sort();
    
    logMessage(`[EnhancedLogParser] 提取到 ${uniqueModules.length} 個唯一模組: ${uniqueModules.join(', ')}`);
    return uniqueModules;
  }

  /**
   * 從解析結果中提取唯一的函數列表
   * @param entries 解析結果陣列
   * @returns 唯一函數列表
   */
  static extractUniqueFunctions(entries: EnhancedLogEntry[]): string[] {
    const functions = entries
      .filter(entry => entry.isValid)
      .map(entry => entry.function);
    const uniqueFunctions = Array.from(new Set(functions)).sort();
    
    logMessage(`[EnhancedLogParser] 提取到 ${uniqueFunctions.length} 個唯一函數`);
    return uniqueFunctions;
  }

  /**
   * 根據模組名過濾日誌項目
   * @param entries 解析結果陣列
   * @param moduleName 模組名
   * @returns 過濾後的結果
   */
  static filterByModule(entries: EnhancedLogEntry[], moduleName: string): EnhancedLogEntry[] {
    const filtered = entries.filter(entry => entry.isValid && entry.module === moduleName);
    logMessage(`[EnhancedLogParser] 模組過濾 '${moduleName}': ${filtered.length}/${entries.length} 項目`);
    return filtered;
  }

  /**
   * 根據函數名過濾日誌項目
   * @param entries 解析結果陣列
   * @param functionName 函數名
   * @returns 過濾後的結果
   */
  static filterByFunction(entries: EnhancedLogEntry[], functionName: string): EnhancedLogEntry[] {
    const filtered = entries.filter(entry => entry.isValid && entry.function === functionName);
    logMessage(`[EnhancedLogParser] 函數過濾 '${functionName}': ${filtered.length}/${entries.length} 項目`);
    return filtered;
  }

  /**
   * 根據序號範圍過濾日誌項目
   * @param entries 解析結果陣列
   * @param startSeq 起始序號
   * @param endSeq 結束序號
   * @returns 過濾後的結果
   */
  static filterBySequenceRange(entries: EnhancedLogEntry[], startSeq: number, endSeq: number): EnhancedLogEntry[] {
    const filtered = entries.filter(entry => 
      entry.isValid && 
      entry.sequence >= startSeq && 
      entry.sequence <= endSeq
    );
    logMessage(`[EnhancedLogParser] 序號範圍過濾 #${startSeq}-#${endSeq}: ${filtered.length}/${entries.length} 項目`);
    return filtered;
  }

  /**
   * 生成日誌摘要統計
   * @param entries 解析結果陣列
   * @returns 統計資訊
   */
  static generateSummary(entries: EnhancedLogEntry[]): {
    totalLines: number;
    validEntries: number;
    invalidEntries: number;
    uniqueModules: number;
    uniqueFunctions: number;
    sequenceRange: { min: number; max: number } | null;
  } {
    const validEntries = entries.filter(e => e.isValid);
    const sequences = validEntries.map(e => e.sequence);
    
    const summary = {
      totalLines: entries.length,
      validEntries: validEntries.length,
      invalidEntries: entries.length - validEntries.length,
      uniqueModules: this.extractUniqueModules(entries).length,
      uniqueFunctions: this.extractUniqueFunctions(entries).length,
      sequenceRange: sequences.length > 0 ? {
        min: Math.min(...sequences),
        max: Math.max(...sequences)
      } : null
    };
    
    logMessage(`[EnhancedLogParser] 生成統計摘要: ${JSON.stringify(summary)}`);
    return summary;
  }

  /**
   * 映射 DebugLib 變體名稱到實際模組名稱
   * 用於改善搜尋準確性
   */
  static mapDebugLibToModule(debugLibName: string): string {
    const mapping: { [key: string]: string } = {
      'BaseDebugLibSerialPort': 'PeiCore',
      'UefiDebugLibConOut': 'DxeCore',
      'DxeRuntimeDebugLibSerialPort': 'RuntimeServices',
      'UefiDebugLibStdErr': 'DxeCore',
      'UefiDebugLibDebugPortProtocol': 'DebugPort',
      'BaseDebugLibNull': 'NullDebug'
    };
    
    const mapped = mapping[debugLibName] || debugLibName;
    
    if (mapped !== debugLibName) {
      logMessage(`[EnhancedLogParser] 模組名稱映射: ${debugLibName} → ${mapped}`);
    }
    
    return mapped;
  }
}