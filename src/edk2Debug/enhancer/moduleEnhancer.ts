// src/edk2Debug/enhancer/moduleEnhancer.ts

import * as fs from 'fs';
import { Edk2InfMeta } from '../types';
import { logMessage } from '../../utils/logger';
import { ENHANCED_DEBUG_CONSTANTS } from '../constants';

export class ModuleEnhancer {
  static async enhance(infMeta: Edk2InfMeta, maxDepth: number = 2): Promise<boolean> {
    /* ---------- 1. 先備份 INF ---------- */
    const infBackup = `${infMeta.filePath}.bak`;
    if (!fs.existsSync(infBackup)) {
      fs.copyFileSync(infMeta.filePath, infBackup);
    }

    /* ---------- 2. 更新  INF ---------- */
    let infContent = fs.readFileSync(infMeta.filePath, 'utf-8');

    /* LibraryClasses 區段 */
    if (!infContent.includes(ENHANCED_DEBUG_CONSTANTS.LIBRARY_NAME)) {
      infContent = infContent.replace(
        /\[LibraryClasses\][\r\n]+/,
        (m) => `${m}  ${ENHANCED_DEBUG_CONSTANTS.LIBRARY_NAME}\n`,
      );
    }

    /* Packages 區段 */
    if (!infContent.includes(ENHANCED_DEBUG_CONSTANTS.AMI_MODULE_PKG)) {
      infContent = infContent.replace(
        /\[Packages\][\r\n]+/,
        (m) => `${m}  ${ENHANCED_DEBUG_CONSTANTS.AMI_MODULE_PKG}\n`,
      );
    }

    fs.writeFileSync(infMeta.filePath, infContent, 'utf-8');

    /* ---------- 3. 處理所有 C Source ---------- */
    for (const srcFile of infMeta.sourceFiles) {
      const cBackup = `${srcFile}.bak`;
      if (!fs.existsSync(cBackup)) {
        fs.copyFileSync(srcFile, cBackup);
      }

      let cContent = fs.readFileSync(srcFile, 'utf-8');

      /* include EnhancedDebugLib.h */
      const includeLine = ENHANCED_DEBUG_CONSTANTS.HEADER_FILE;
      if (!cContent.includes(includeLine)) {
        const includeRegex = /^(#include.*\n)+/;
        if (includeRegex.test(cContent)) {
          cContent = cContent.replace(includeRegex, (m) => `${m}${includeLine}\n`);
        } else {
          cContent = `${includeLine}\n${cContent}`;
        }
        logMessage(`Inserted include for EnhancedDebugLib.h in: ${srcFile}`);
      }

      /* 插入 DEBUG_ENTRY / DEBUG_EXIT 巨集 */
      cContent = this.insertDebugMacros(cContent, infMeta.entryPoint, maxDepth);
      fs.writeFileSync(srcFile, cContent, 'utf-8');
    }

    return true;
  }

  /**
   * 還原 INF 與 C 檔（.bak → 原檔）
   */
  static async restore(
    infMeta: Edk2InfMeta,
  ): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];

    /* 還原 INF */
    const infBackup = `${infMeta.filePath}.bak`;
    if (fs.existsSync(infBackup)) {
      try {
        fs.copyFileSync(infBackup, infMeta.filePath);
        logMessage(`Restored INF: ${infMeta.filePath}`);
        try {
          fs.unlinkSync(infBackup);
        } catch (e) {
          errors.push(`Delete INF backup failed: ${e}`);
        }
      } catch (e) {
        errors.push(`Restore INF failed: ${e}`);
      }
    } else {
      errors.push(`No backup found for INF: ${infMeta.filePath}`);
    }

    /* 還原所有 C 檔 */
    for (const srcFile of infMeta.sourceFiles) {
      const cBackup = `${srcFile}.bak`;
      if (fs.existsSync(cBackup)) {
        try {
          fs.copyFileSync(cBackup, srcFile);
          try {
            fs.unlinkSync(cBackup);
          } catch (e) {
            errors.push(`Delete C backup failed: ${srcFile} (${e})`);
          }
        } catch (e) {
          errors.push(`Restore C file failed: ${srcFile} (${e})`);
        }
      } else {
        errors.push(`No backup found for C file: ${srcFile}`);
      }
    }

    return { success: errors.length === 0, errors };
  }

  /* ====== 私有工具函式 ====== */

  private static insertDebugMacros(
    code: string,
    entryPoint: string,
    maxDepth: number,
  ): string {
    const funcMap = this.parseAllFunctions(code);

    const visited = new Set<string>();
    return this.insertDebugRecursive(code, funcMap, entryPoint, maxDepth, visited, code);
  }

  private static parseAllFunctions(
    code: string,
  ): Map<string, { start: number; end: number }> {
    const funcMap = new Map<string, { start: number; end: number }>();
    const funcRegex =
      /([A-Za-z_][A-Za-z0-9_ \t\n\r*]*)\s+([A-Za-z_][A-Za-z0-9_]*)\s*\([^)]*\)\s*\{/g;

    let match: RegExpExecArray | null;
    while ((match = funcRegex.exec(code)) !== null) {
      const name = match[2];
      const start = match.index;

      /* 找到對應的 '}' */
      let braceCnt = 1;
      let idx = funcRegex.lastIndex;
      while (braceCnt > 0 && idx < code.length) {
        if (code[idx] === '{') braceCnt++;
        else if (code[idx] === '}') braceCnt--;
        idx++;
      }

      if (braceCnt === 0) {
        funcMap.set(name, { start, end: idx });
      }
    }
    return funcMap;
  }

  private static insertDebugRecursive(
    code: string,
    funcMap: Map<string, { start: number; end: number }>,
    funcName: string,
    depth: number,
    visited: Set<string>,
    fullCode: string,
  ): string {
    if (depth <= 0 || visited.has(funcName) || !funcMap.has(funcName)) {
      return code;
    }
    visited.add(funcName);

    const { start, end } = funcMap.get(funcName)!;
    let funcBody = code.slice(start, end);

    /* DEBUG_ENTRY */
    const debugEntry = ENHANCED_DEBUG_CONSTANTS.DEBUG_ENTRY_PATTERN.replace(
      '{functionName}',
      funcName,
    );
    funcBody = funcBody.replace(/\{/, `{\n  ${debugEntry}`);

    /* DEBUG_EXIT － 對每個 return */
    let hasReturn = false;
    funcBody = funcBody.replace(
      /return\s+([^;]+);/g,
      (_match, retExpr: string) => {
        hasReturn = true;
        const debugExitForRet = ENHANCED_DEBUG_CONSTANTS.DEBUG_EXIT_PATTERN
          .replace('{functionName}', funcName)
          .replace('{returnValue}', retExpr.trim());
        return `${debugExitForRet}\n  return ${retExpr};`;
      },
    );

    /* 若無顯式 return，於結尾插入 */
    if (!hasReturn) {
      const debugExitNoRet = ENHANCED_DEBUG_CONSTANTS.DEBUG_EXIT_PATTERN
        .replace('{functionName}', funcName)
        .replace('{returnValue}', 'EFI_SUCCESS');
      funcBody = funcBody.replace(/\}\s*$/, `\n  ${debugExitNoRet}\n}`);
    }

    /* 探索下一層呼叫 */
    const called = Array.from(funcMap.keys()).filter(
      (n) => n !== funcName && new RegExp(`\\b${n}\\s*\\(`).test(funcBody),
    );
    for (const callee of called) {
      if (depth > 1) {
        code = this.insertDebugRecursive(code, funcMap, callee, depth - 1, visited, fullCode);
      }
    }

    /* 以修改後內容覆蓋 */
    return code.slice(0, start) + funcBody + code.slice(end);
  }
}
