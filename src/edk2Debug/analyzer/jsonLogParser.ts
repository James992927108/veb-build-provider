// src/edk2Debug/analyzer/jsonLogParser.ts

import { DebugLogEntry } from '../types';

export interface JSONLogFormat {
  timestamp: string;
  level: string;
  module: string;
  function: string;
  message: string;
  metadata?: {
    phase: 'PEI' | 'DXE' | 'BDS' | 'TSL';
    guid?: string;
    returnValue?: any;
    parameters?: any[];
  };
}

export class JSONLogParser {
  static parseLogLine(line: string): DebugLogEntry | null {
    try {
      // 支援多種日誌格式
      if (line.startsWith('{')) {
        // 純JSON格式
        return this.parseJSONFormat(line);
      } else if (line.includes('DEBUG_ENTRY') || line.includes('DEBUG_EXIT')) {
        // Enhanced Debug Library格式
        return this.parseEnhancedDebugFormat(line);
      } else {
        // 傳統BIOS日誌格式
        return this.parseTraditionalFormat(line);
      }
    } catch (error) {
      console.warn(`無法解析日誌行: ${line}`, error);
      return null;
    }
  }

  private static parseJSONFormat(line: string): DebugLogEntry {
    const data: JSONLogFormat = JSON.parse(line);
    return {
      timestamp: data.timestamp,
      module: data.module,
      function: data.function,
      level: this.mapLogLevel(data.level),
      message: data.message,
      data: data.metadata,
    };
  }

  private static parseEnhancedDebugFormat(line: string): DebugLogEntry | null {
    // 解析Enhanced Debug Library輸出格式
    const regex = /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)\s+\[(\w+)\]\s+(DEBUG_(?:ENTRY|EXIT|JSON_LOG))\s*:\s*(.+)/;
    const match = line.match(regex);

    if (match) {
      const [, timestamp, module, type, content] = match;

      if (type === 'DEBUG_ENTRY') {
        return {
          timestamp,
          module,
          function: this.extractFunctionName(content),
          level: 'ENTRY',
          message: content,
        };
      } else if (type === 'DEBUG_EXIT') {
        return {
          timestamp,
          module,
          function: this.extractFunctionName(content),
          level: 'EXIT',
          message: content,
          data: this.extractReturnValue(content),
        };
      } else if (type === 'DEBUG_JSON_LOG') {
        // 若有 DEBUG_JSON_LOG 類型，可擴充處理
        try {
          const jsonData = JSON.parse(content);
          return {
            timestamp,
            module,
            function: jsonData.function || 'unknown',
            level: 'INFO',
            message: jsonData.message || content,
            data: jsonData,
          };
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  private static parseTraditionalFormat(line: string): DebugLogEntry | null {
    // 根據傳統BIOS日誌格式解析（可依實際格式擴充）
    // 範例：2024-07-04T12:34:56.789Z [MODULE] INFO: message
    const regex = /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)\s+\[(\w+)\]\s+(\w+):\s*(.+)/;
    const match = line.match(regex);
    if (match) {
      const [, timestamp, module, level, message] = match;
      return {
        timestamp,
        module,
        function: '', // 傳統格式可能無function
        level: this.mapLogLevel(level),
        message,
      };
    }
    return null;
  }

  private static mapLogLevel(level: string): 'ENTRY' | 'EXIT' | 'INFO' | 'ERROR' {
    switch (level.toUpperCase()) {
      case 'DEBUG_ENTRY':
      case 'ENTRY':
        return 'ENTRY';
      case 'DEBUG_EXIT':
      case 'EXIT':
        return 'EXIT';
      case 'ERROR':
        return 'ERROR';
      default:
        return 'INFO';
    }
  }

  private static extractFunctionName(content: string): string {
    // 嘗試從內容中提取函數名稱
    const match = content.match(/(\w+)\s*\(/);
    if (match) {
      return match[1];
    }
    // 若無法提取，回傳原內容
    return content.split(' ')[0] || '';
  }

  private static extractReturnValue(content: string): any {
    // 嘗試從內容中提取 return value 和 duration
    // 範例：MyFunc returned 123 (15ms)
    const match = content.match(/returned\s+(.+?)(?:\s*\((\d+)ms\))?/);
    if (match) {
      const [, returnValue, duration] = match;
      const data: any = {};
      if (returnValue) { data.returnValue = returnValue.trim(); }
      if (duration) { data.duration = parseInt(duration, 10); }
      return data;
    }
    // 只提取 duration
    const durationMatch = content.match(/\((\d+)ms\)/);
    if (durationMatch) {
      return { duration: parseInt(durationMatch[1], 10) };
    }
    return undefined;
  }
}
