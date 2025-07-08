import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { Edk2InfMeta } from '../types';
import { logMessage } from '../../utils/logger';
import { ENHANCED_DEBUG_CONSTANTS } from '../constants';

export class ModuleEnhancer {
  /** 
   * 入口：增強 INF 與 C 檔案，插入偵錯巨集 
   */
  static async enhance(
    infMeta: Edk2InfMeta,
    maxDepth: number = 3
  ): Promise<boolean> {
    // 1. INF 備份與更新
    const infBak = `${infMeta.filePath}.bak`;
    if (!fs.existsSync(infBak)) { fs.copyFileSync(infMeta.filePath, infBak); }
    let infContent = fs.readFileSync(infMeta.filePath, 'utf-8');
    if (!infContent.includes(ENHANCED_DEBUG_CONSTANTS.LIBRARY_NAME)) {
      infContent = infContent.replace(
        /\[LibraryClasses\][\r\n]+/,
        m => `${m}${ENHANCED_DEBUG_CONSTANTS.LIBRARY_NAME}\n`
      );
    }
    if (!infContent.includes(ENHANCED_DEBUG_CONSTANTS.AMI_MODULE_PKG)) {
      infContent = infContent.replace(
        /\[Packages\][\r\n]+/,
        m => `${m}${ENHANCED_DEBUG_CONSTANTS.AMI_MODULE_PKG}\n`
      );
    }
    fs.writeFileSync(infMeta.filePath, infContent, 'utf-8');

    // 2. 處理所有 C 檔
    for (const srcFile of infMeta.sourceFiles) {
      // 備份
      const cBak = `${srcFile}.bak`;
      if (!fs.existsSync(cBak)) { fs.copyFileSync(srcFile, cBak); }

      let code = fs.readFileSync(srcFile, 'utf-8');
      // 插入 include
      const inc = ENHANCED_DEBUG_CONSTANTS.HEADER_FILE;
      if (!code.includes(inc)) {
        code = code.replace(
          /^(#include.*\n)+/m,
          m => `${m}${inc}\n`
        );
      }

      // 3. 插入巨集
      code = this.insertDebugMacros(code, infMeta.entryPoint, maxDepth);
      fs.writeFileSync(srcFile, code, 'utf-8');
      logMessage(`Enhanced ${path.basename(srcFile)}`);
    }

    return true;
  }

  /** 還原備份 */
  static async restore(infMeta: Edk2InfMeta): Promise<{ success: boolean; errors?: string[] }> {
    const errors: string[] = [];
    const infBak = `${infMeta.filePath}.bak`;
    try {
      if (fs.existsSync(infBak)) {
        fs.copyFileSync(infBak, infMeta.filePath);
        fs.unlinkSync(infBak);
      }
    } catch (e) {
      errors.push(`Failed to restore or remove backup for INF: ${infBak} (${e instanceof Error ? e.message : e})`);
    }

    for (const srcFile of infMeta.sourceFiles) {
      const cBak = `${srcFile}.bak`;
      try {
        if (fs.existsSync(cBak)) {
          fs.copyFileSync(cBak, srcFile);
          fs.unlinkSync(cBak);
        }
      } catch (e) {
        errors.push(`Failed to restore or remove backup for source: ${cBak} (${e instanceof Error ? e.message : e})`);
      }
    }

    return { success: errors.length === 0, errors: errors.length ? errors : undefined };
  }

  /** 核心：正則 + 括號計數，定位函式並遞迴插入 */
  private static insertDebugMacros(
    code: string,
    entryPoint: string,
    maxDepth: number
  ): string {
    // 1. 解析所有函式範圍
    const funcMap = this.parseAllFunctions(code);
    // 2. 從 entryPoint 開始遞迴
    const visited = new Set<string>();
    return this.insertRecursive(code, funcMap, entryPoint, maxDepth, visited);
  }

  /** 用正則找所有函式定義，並記錄 start/end 索引 */
  private static parseAllFunctions(
    code: string
  ): Map<string, { start: number; end: number }> {
    const map = new Map<string, { start: number; end: number }>();
    const regex = /([A-Za-z_][A-Za-z0-9_\s\*]+)\s+([A-Za-z_][A-Za-z0-9_]*)\s*\([^)]*\)\s*\{/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(code)) !== null) {
      const name = match[2];
      let brace = 1;
      let idx = regex.lastIndex;
      while (brace > 0 && idx < code.length) {
        if (code[idx] === '{') { brace++; }
        else if (code[idx] === '}') { brace--; }
        idx++;
      }
      if (brace === 0) { map.set(name, { start: match.index, end: idx }); }
    }
    return map;
  }

  /** 遞迴插入 DEBUG 巨集 */
  private static insertRecursive(
    code: string,
    funcMap: Map<string, { start: number; end: number }>,
    fn: string,
    depth: number,
    visited: Set<string>
  ): string {
    if (depth <= 0 || visited.has(fn) || !funcMap.has(fn)) { return code; }
    visited.add(fn);

    const { start, end } = funcMap.get(fn)!;
    let body = code.slice(start, end);

    // 1. 插入 DEBUG_ENTRY
    const entry = ENHANCED_DEBUG_CONSTANTS.DEBUG_ENTRY_PATTERN.replace(
      '{functionName}', fn
    );
    body = body.replace('{', `{\n  ${entry}`);

    // 2. 處理 return，包含三種情境
    //    - 單行 if(cond) return ret;
    //    - if(cond)\n    return ret;
    //    - 一般 return ret;
    const returnRegex = /(?:if\s*\(\s*([^)]+)\s*\)\s*)(?:\{\s*)?(?:\r?\n\s*|)\s*return\s+([^;]+);|return\s+([^;]+);/g;
    body = body.replace(returnRegex, (_m, cond, ret1, ret2) => {
      const ret = (ret1 || ret2).trim();
      const exit = ENHANCED_DEBUG_CONSTANTS.DEBUG_EXIT_PATTERN
        .replace('{functionName}', fn)
        .replace('{returnValue}', ret);

      if (cond) {
        // 有條件的 return，補上大括號區塊
        return [
          `if(${cond}) {`,
          `    ${exit}`,
          `    return ${ret};`,
          `  }`
        ].join('\n');
      } else {
        // 凡是一般 return，直接插入 EXIT
        return `${exit}\n  return ${ret};`;
      }
    });

    // 3. 若函式內根本沒有 return，則於結尾插入一次 DEBUG_EXIT
    if (!/return\s+[^;]+;/.test(body)) {
      const exitNoRet = ENHANCED_DEBUG_CONSTANTS.DEBUG_EXIT_PATTERN
        .replace('{functionName}', fn)
        .replace('{returnValue}', 'EFI_SUCCESS');
      body = body.replace(/\}\s*$/, `  ${exitNoRet}\n}`);
    }

    // 4. 用修改後 body 取代原函式範圍
    code = code.slice(0, start) + body + code.slice(end);

    // 5. 遞迴處理下一層呼叫
    for (const callee of funcMap.keys()) {
      if (callee !== fn && new RegExp(`\\b${callee}\\s*\\(`).test(body)) {
        code = this.insertRecursive(code, funcMap, callee, depth - 1, visited);
      }
    }

    return code;
  }

}
