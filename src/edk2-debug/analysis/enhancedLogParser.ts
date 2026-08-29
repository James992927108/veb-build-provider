// src/edk2-debug/analysis/enhancedLogParser.ts
// Enhanced Debug Log Parser - Supports log navigation functionality

import * as vscode from 'vscode';
import { logInfo, logDebug, isDebugEnabled } from '../../shared/utils/logger';

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
