// src/edk2-debug/analysis/enhancedLogParser.ts
// Enhanced Debug Log Parser - Supports log navigation functionality

import * as vscode from 'vscode';
import { logInfo, logDebug, logSummary, logError, isDebugEnabled } from '../../shared/utils/logger';

/**
 * Enhanced Debug Log Entry
 * Format: [Module:Function:Line:#Sequence] Message
 * Example: [PeiCore:TestEnhancedDebugMacro:492:#1] [PEICORE][Test] message
 */
export interface EnhancedLogEntry {
  /** Original log line */
  rawLine: string;
  /** Module name (e.g: PeiCore, BaseDebugLibSerialPort) */
  module: string;
  /** Function name (e.g: TestEnhancedDebugMacro) */
  function: string;
  /** Line number (e.g: 492) */
  line: number;
  /** Sequence number (e.g: 1) */
  sequence: number;
  /** Message content */
  message: string;
  /** Parse success status */
  isValid: boolean;
  /** Document line number (used for DocumentLink) */
  documentLine?: number;
  /** Function name position in line (used for DocumentLink) */
  functionStartCol?: number;
  /** Function name end position */
  functionEndCol?: number;
}

/**
 * Enhanced Debug Log Parser
 */
export class EnhancedLogParser {
  private static readonly DEBUG_PATTERN = /^\[([^:]+):([^:]+):(\d+):#(\d+)\]\s*(.*)$/;

  /**
   * Parse a single log line (instance method for compatibility with new provider)
   */
  parseLogLine(logLine: string, documentLine?: number): EnhancedLogEntry {
    return EnhancedLogParser.parseLogLine(logLine, documentLine);
  }
  
  /**
   * Parse single Enhanced Debug Log line
   * @param logLine Log line
   * @param documentLine Document line number (optional)
   * @returns Parse result
   */
  static parseLogLine(logLine: string, documentLine?: number): EnhancedLogEntry {
    if (isDebugEnabled()) {
        logDebug(`[EnhancedLogParser] Parsing log line: ${logLine.substring(0, 100)}...`);
    }
    
    const match = logLine.trim().match(this.DEBUG_PATTERN);
    
    if (match) {
      const [, module, functionName, lineStr, sequenceStr, message] = match;
      
      // Calculate function name position in original line (for DocumentLink)
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
      
      logDebug(`[EnhancedLogParser] Parse successful: ${entry.module}:${entry.function}:${entry.line}#${entry.sequence}`);
      return entry;
    }
    
    // Parse failed, return invalid entry
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
    
    logDebug(`[EnhancedLogParser] Parse failed, not Enhanced Debug format`);
    return invalidEntry;
  }

  /**
   * Parse entire log file
   * @param logContent Log content
   * @returns Parse result array
   */
  static parseLogContent(logContent: string): EnhancedLogEntry[] {
    logInfo(`[EnhancedLogParser] Start parsing log content, total length: ${logContent.length} characters`);
    
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
    
    logSummary(`[EnhancedLogParser] Parse complete: ${validCount}/${results.length} Enhanced Debug entries`);
    return results;
  }

  /**
   * Load and parse from log file
   * @param logFilePath Log file path
   * @returns Parse result array
   */
  static async parseLogFile(logFilePath: string): Promise<EnhancedLogEntry[]> {
    try {
      logInfo(`[EnhancedLogParser] Loading log file: ${logFilePath}`);
      
      const document = await vscode.workspace.openTextDocument(logFilePath);
      const content = document.getText();
      
      logInfo(`[EnhancedLogParser] File loaded successfully, starting parse`);
      return this.parseLogContent(content);
      
    } catch (error) {
      logError(`[EnhancedLogParser] Failed to load file ${logFilePath}: ${error}`);
      return [];
    }
  }

  /**
   * Check if log line is Enhanced Debug format
   * @param logLine Log line
   * @returns Whether it is Enhanced Debug format
   */
  static isEnhancedDebugLine(logLine: string): boolean {
    const result = this.DEBUG_PATTERN.test(logLine.trim());
    logDebug(`[EnhancedLogParser] Format check: ${result ? 'matches' : 'does not match'} Enhanced Debug format`);
    return result;
  }

  /**
   * Check if file contains Enhanced Debug content
   * @param document VSCode document
   * @returns Whether it contains Enhanced Debug format
   */
  static hasEnhancedDebugContent(document: vscode.TextDocument): boolean {
    logInfo(`[EnhancedLogParser] Checking if file contains Enhanced Debug content: ${document.fileName}`);
    
    const content = document.getText();
    const lines = content.split('\n');
    
    // Check first 100 lines, if more than 5 lines match format, consider it Enhanced Debug log
    let matchCount = 0;
    const checkLines = Math.min(100, lines.length);
    
    for (let i = 0; i < checkLines; i++) {
      if (this.isEnhancedDebugLine(lines[i])) {
        matchCount++;
        if (matchCount >= 5) {
          logInfo(`[EnhancedLogParser] Confirmed as Enhanced Debug log file (found ${matchCount}+ matching lines)`);
          return true;
        }
      }
    }
    
    logDebug(`[EnhancedLogParser] Not an Enhanced Debug log file (only found ${matchCount} matching lines)`);
    return false;
  }

  /**
   * Extract unique module list from parse results
   * @param entries Parse result array
   * @returns Unique module list
   */
  static extractUniqueModules(entries: EnhancedLogEntry[]): string[] {
    const modules = entries
      .filter(entry => entry.isValid)
      .map(entry => entry.module);
    const uniqueModules = Array.from(new Set(modules)).sort();
    
    logSummary(`[EnhancedLogParser] Extracted ${uniqueModules.length} unique modules: ${uniqueModules.join(', ')}`);
    return uniqueModules;
  }

  /**
   * Extract unique function list from parse results
   * @param entries Parse result array
   * @returns Unique function list
   */
  static extractUniqueFunctions(entries: EnhancedLogEntry[]): string[] {
    const functions = entries
      .filter(entry => entry.isValid)
      .map(entry => entry.function);
    const uniqueFunctions = Array.from(new Set(functions)).sort();
    
    logSummary(`[EnhancedLogParser] Extracted ${uniqueFunctions.length} unique functions`);
    return uniqueFunctions;
  }

  /**
   * Filter log entries by module name
   * @param entries Parse result array
   * @param moduleName Module name
   * @returns Filtered results
   */
  static filterByModule(entries: EnhancedLogEntry[], moduleName: string): EnhancedLogEntry[] {
    const filtered = entries.filter(entry => entry.isValid && entry.module === moduleName);
    logDebug(`[EnhancedLogParser] Module filter '${moduleName}': ${filtered.length}/${entries.length} entries`);
    return filtered;
  }

  /**
   * Filter log entries by function name
   * @param entries Parse result array
   * @param functionName Function name
   * @returns Filtered results
   */
  static filterByFunction(entries: EnhancedLogEntry[], functionName: string): EnhancedLogEntry[] {
    const filtered = entries.filter(entry => entry.isValid && entry.function === functionName);
    logDebug(`[EnhancedLogParser] Function filter '${functionName}': ${filtered.length}/${entries.length} entries`);
    return filtered;
  }

  /**
   * Filter log entries by sequence number range
   * @param entries Parse result array
   * @param startSeq Start sequence number
   * @param endSeq End sequence number
   * @returns Filtered results
   */
  static filterBySequenceRange(entries: EnhancedLogEntry[], startSeq: number, endSeq: number): EnhancedLogEntry[] {
    const filtered = entries.filter(entry => 
      entry.isValid && 
      entry.sequence >= startSeq && 
      entry.sequence <= endSeq
    );
    logDebug(`[EnhancedLogParser] Sequence range filter #${startSeq}-#${endSeq}: ${filtered.length}/${entries.length} entries`);
    return filtered;
  }

  /**
   * Generate log summary statistics
   * @param entries Parse result array
   * @returns Statistics information
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
    
    logSummary(`[EnhancedLogParser] Generated statistics summary: ${JSON.stringify(summary)}`);
    return summary;
  }

  /**
   * Map DebugLib variant names to actual module names
   * Used to improve search accuracy
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
      logDebug(`[EnhancedLogParser] Module name mapping: ${debugLibName} → ${mapped}`);
    }
    
    return mapped;
  }
}