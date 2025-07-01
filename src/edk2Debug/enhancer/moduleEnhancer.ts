// src/edk2Debug/enhancer/moduleEnhancer.ts

import * as fs from 'fs';
import { Edk2InfMeta } from '../types';

export class ModuleEnhancer {
  /**
   * Enhance INF module: insert DEBUG_ENTRY/ENTRY_POINT, supports multi-level recursion
   * @param infMeta INF module information
   * @param maxDepth Recursion depth, default is 1 (only process entryPoint)
   */
  static async enhance(infMeta: Edk2InfMeta, maxDepth: number = 1): Promise<boolean> {
    // 1. Backup INF file
    const infBackup = infMeta.filePath + '.bak';
    if (!fs.existsSync(infBackup)) {
      fs.copyFileSync(infMeta.filePath, infBackup);
    }

    // 2. Modify INF file
    let infContent = fs.readFileSync(infMeta.filePath, 'utf-8');
    if (!infContent.includes('EnhancedDebugLib')) {
      infContent = infContent.replace(
        /\[LibraryClasses\][\r\n]+/,
        match => match + '  EnhancedDebugLib\n'
      );
    }
    if (!infContent.includes('AmiModulePkg/AmiModulePkg.dec')) {
      infContent = infContent.replace(
        /\[Packages\][\r\n]+/,
        match => match + '  AmiModulePkg/AmiModulePkg.dec\n'
      );
    }
    fs.writeFileSync(infMeta.filePath, infContent, 'utf-8');

    // 3. Process C source files
    for (const srcFile of infMeta.sourceFiles) {
      const cBackup = srcFile + '.bak';
      if (!fs.existsSync(cBackup)) {
        fs.copyFileSync(srcFile, cBackup);
      }
      let cContent = fs.readFileSync(srcFile, 'utf-8');
      cContent = this.insertDebugMacros(cContent, infMeta.entryPoint, maxDepth);
      fs.writeFileSync(srcFile, cContent, 'utf-8');
    }

    return true;
  }

  /**
   * Insert DEBUG_ENTRY/ENTRY_POINT recursively in C source code
   * @param code C source code
   * @param entryPoint Entry function name
   * @param maxDepth Recursion depth
   */
  private static insertDebugMacros(code: string, entryPoint: string, maxDepth: number): string {
    const funcMap = this.parseAllFunctions(code);
    const visited = new Set<string>();
    return this.insertDebugRecursive(code, funcMap, entryPoint, maxDepth, visited);
  }

  /**
   * Parse all functions in C source code, return Map<functionName, {start, end}>
   */
  private static parseAllFunctions(code: string): Map<string, { start: number, end: number }> {
    const funcMap = new Map<string, { start: number, end: number }>();
    // Support common C function declarations
    const funcRegex = /([A-Za-z_][A-Za-z0-9_ \t\n\r*]*)\s+([A-Za-z_][A-Za-z0-9_]*)\s*\([^)]*\)\s*\{/g;
    let match;
    while ((match = funcRegex.exec(code)) !== null) {
      const name = match[2];
      const start = match.index;
      let braceCount = 1;
      let i = funcRegex.lastIndex;
      while (braceCount > 0 && i < code.length) {
        if (code[i] === '{') {
          braceCount++;
        } else if (code[i] === '}') {
          braceCount--;
        }
        i++;
      }
      funcMap.set(name, { start, end: i });
    }
    return funcMap;
  }

  /**
   * Recursively insert DEBUG_ENTRY/ENTRY_POINT
   */
  private static insertDebugRecursive(
    code: string,
    funcMap: Map<string, { start: number, end: number }>,
    funcName: string,
    depth: number,
    visited: Set<string>
  ): string {
    if (depth <= 0 || visited.has(funcName) || !funcMap.has(funcName)) {
      return code;
    }
    visited.add(funcName);

    const { start, end } = funcMap.get(funcName)!;
    let funcBody = code.slice(start, end);

    // Insert DEBUG_ENTRY() after first {
    funcBody = funcBody.replace(/\{/, '{\n  DEBUG_ENTRY();');

    // Insert ENTRY_POINT() before ending }
    funcBody = funcBody.replace(/\}\s*$/, '\n  ENTRY_POINT();\n}');

    // Find other functions called within this function
    const calledFuncs = Array.from(funcMap.keys()).filter(name => {
      if (name === funcName) {
        return false;
      }
      const regex = new RegExp(`\\b${name}\\s*\\(`);
      return regex.test(funcBody);
    });

    // Recursively process next level
    for (const callee of calledFuncs) {
      if (depth > 1) {
        code = this.insertDebugRecursive(code, funcMap, callee, depth - 1, visited);
      }
    }

    // Overwrite the original function body with the new content
    code = code.slice(0, start) + funcBody + code.slice(end);
    return code;
  }
}
