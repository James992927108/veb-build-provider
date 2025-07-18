// src/edk2-debug/analysis/jsonLogParser.ts

import { DebugLogEntry, JSONLogFormat } from '../types';

export class JSONLogParser {
  static parseLogLine(line: string): DebugLogEntry | null {
    try {
      // Support multiple log formats
      if (line.startsWith('{')) {
        // Pure JSON format
        return this.parseJSONFormat(line);
      } else if (line.includes('DEBUG_ENTRY') || line.includes('DEBUG_EXIT')) {
        // Enhanced Debug Library format
        return this.parseEnhancedDebugFormat(line);
      } else {
        // Traditional BIOS log format
        return this.parseTraditionalFormat(line);
      }
    } catch (error) {
      console.warn(`Unable to parse log line: ${line}`, error);
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
    // Parse Enhanced Debug Library output format
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
        // If there is a DEBUG_JSON_LOG type, extend handling here
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
    // Parse traditional BIOS log format (extend as needed)
    // Example: 2024-07-04T12:34:56.789Z [MODULE] INFO: message
    const regex = /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)\s+\[(\w+)\]\s+(\w+):\s*(.+)/;
    const match = line.match(regex);
    if (match) {
      const [, timestamp, module, level, message] = match;
      return {
        timestamp,
        module,
        function: '', // Traditional format may not have function
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
    // Try to extract function name from content
    const match = content.match(/(\w+)\s*\(/);
    if (match) {
      return match[1];
    }
    // If unable to extract, return the first word
    return content.split(' ')[0] || '';
  }

  private static extractReturnValue(content: string): any {
    // Try to extract return value and duration from content
    // Example: MyFunc returned 123 (15ms)
    const match = content.match(/returned\s+(.+?)(?:\s*\((\d+)ms\))?/);
    if (match) {
      const [, returnValue, duration] = match;
      const data: any = {};
      if (returnValue) { data.returnValue = returnValue.trim(); }
      if (duration) { data.duration = parseInt(duration, 10); }
      return data;
    }
    // Only extract duration
    const durationMatch = content.match(/\((\d+)ms\)/);
    if (durationMatch) {
      return { duration: parseInt(durationMatch[1], 10) };
    }
    return undefined;
  }
}
