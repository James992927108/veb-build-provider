import * as fs from 'fs';
import * as vscode from 'vscode';
import Parser from 'tree-sitter';
import C from 'tree-sitter-c';
import { Edk2InfMeta } from '../types';
import { logMessage } from '../../utils/logger';
import { ENHANCED_DEBUG_CONSTANTS } from '../constants';

export class ModuleEnhancer {
  static async enhance(
    infMeta: Edk2InfMeta,
    maxDepth: number = 3
  ): Promise<boolean> {
    // 1. 備份 INF
    const infBackup = `${infMeta.filePath}.bak`;
    if (!fs.existsSync(infBackup)) {
      fs.copyFileSync(infMeta.filePath, infBackup);
    }

    // 2. 更新 INF
    let infContent = fs.readFileSync(infMeta.filePath, 'utf-8');
    if (!infContent.includes(ENHANCED_DEBUG_CONSTANTS.LIBRARY_NAME)) {
      infContent = infContent.replace(
        /\[LibraryClasses\][\r\n]+/,
        (m) => `${m} ${ENHANCED_DEBUG_CONSTANTS.LIBRARY_NAME}\n`
      );
    }
    if (!infContent.includes(ENHANCED_DEBUG_CONSTANTS.AMI_MODULE_PKG)) {
      infContent = infContent.replace(
        /\[Packages\][\r\n]+/,
        (m) => `${m} ${ENHANCED_DEBUG_CONSTANTS.AMI_MODULE_PKG}\n`
      );
    }
    fs.writeFileSync(infMeta.filePath, infContent, 'utf-8');

    // 3. 處理所有 C Source
    for (const srcFile of infMeta.sourceFiles) {
      const cBackup = `${srcFile}.bak`;
      if (!fs.existsSync(cBackup)) {
        fs.copyFileSync(srcFile, cBackup);
      }
      let cContent = fs.readFileSync(srcFile, 'utf-8');

      // 插入 include EnhancedDebugLib.h
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

      // AST 解析與巨集插入
      cContent = await this.insertDebugMacrosTreeSitter(
        cContent,
        infMeta.entryPoint,
        maxDepth
      );
      fs.writeFileSync(srcFile, cContent, 'utf-8');
    }

    return true;
  }

  static async restore(
    infMeta: Edk2InfMeta
  ): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];
    // 還原 INF
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
    // 還原所有 C 檔
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

  // ====== Tree-sitter AST 巨集插入 ======
  private static async insertDebugMacrosTreeSitter(
    code: string,
    entryPoint: string,
    maxDepth: number
  ): Promise<string> {
    const parser = new Parser();
    parser.setLanguage(C as any);
    const tree = parser.parse(code);

    // 1. 收集所有函式定義
    const funcDefs = this.collectFunctionDefinitions(tree.rootNode, code);

    // 2. 以 entryPoint 為起點，遞迴插入巨集
    const visited = new Set<string>();
    let newCode = code;
    await this.insertDebugRecursiveTreeSitter(
      funcDefs,
      entryPoint,
      maxDepth,
      visited,
      (fnName, fnRange) => {
        newCode = this.insertDebugMacrosForFunction(newCode, fnName, fnRange, funcDefs);
      },
      code  // 傳遞原始程式碼
    );
    return newCode;
  }

  private static collectFunctionDefinitions(rootNode: any, code: string) {
    const funcDefs: Record<
      string,
      { startIndex: number; endIndex: number; bodyStart: number; bodyEnd: number }
    > = {};

    // 加入安全檢查
    const functionDefs = rootNode.descendantsOfType?.('function_definition') || [];

    functionDefs.forEach((fn: any) => {
      const nameNode = fn.childForFieldName?.('declarator')?.descendantForType?.('identifier');
      if (!nameNode) {
        return;
      }
      const name = nameNode.text;
      const bodyNode = fn.childForFieldName?.('body');
      if (!bodyNode) {
        return;
      }
      funcDefs[name] = {
        startIndex: fn.startIndex,
        endIndex: fn.endIndex,
        bodyStart: bodyNode.startIndex,
        bodyEnd: bodyNode.endIndex,
      };
    });
    return funcDefs;
  }

  private static async insertDebugRecursiveTreeSitter(
    funcDefs: Record<
      string,
      { startIndex: number; endIndex: number; bodyStart: number; bodyEnd: number }
    >,
    funcName: string,
    depth: number,
    visited: Set<string>,
    insertFn: (
      fnName: string,
      fnRange: { startIndex: number; endIndex: number; bodyStart: number; bodyEnd: number }
    ) => void,
    originalCode: string  // 新增參數
  ) {
    if (depth <= 0 || visited.has(funcName) || !funcDefs[funcName]) {
      return;
    }
    visited.add(funcName);

    insertFn(funcName, funcDefs[funcName]);

    // 找出第一層呼叫 - 修正這部分
    const bodyCode = originalCode.slice(
      funcDefs[funcName].bodyStart,
      funcDefs[funcName].bodyEnd
    );

    const parser = new Parser();
    parser.setLanguage(C as any);
    const bodyTree = parser.parse(bodyCode);

    // 加入安全檢查
    const callExpressions = bodyTree.rootNode.descendantsOfType?.('call_expression') || [];
    const called = new Set<string>();

    callExpressions.forEach((call: any) => {
      const callee = call.childForFieldName('function');
      if (callee && funcDefs[callee.text]) {
        called.add(callee.text);
      }
    });

    for (const callee of called) {
      await this.insertDebugRecursiveTreeSitter(
        funcDefs,
        callee,
        depth - 1,
        visited,
        insertFn,
        originalCode  // 傳遞原始程式碼
      );
    }
  }

  private static insertDebugMacrosForFunction(
    code: string,
    funcName: string,
    fnRange: { startIndex: number; endIndex: number; bodyStart: number; bodyEnd: number },
    funcDefs: Record<string, any>
  ): string {
    // 取得函式主體
    const before = code.slice(0, fnRange.bodyStart + 1);
    const body = code.slice(fnRange.bodyStart + 1, fnRange.bodyEnd - 1);
    const after = code.slice(fnRange.bodyEnd - 1);

    // 插入 DEBUG_ENTRY
    const debugEntry =
      ENHANCED_DEBUG_CONSTANTS.DEBUG_ENTRY_PATTERN.replace('{functionName}', funcName) +
      '\n';
    let newBody = debugEntry + body;

    // 插入 DEBUG_EXIT（每個 return 前）
    newBody = newBody.replace(
      /return\s+([^;]+);/g,
      (_match, retExpr: string) => {
        const debugExitForRet = ENHANCED_DEBUG_CONSTANTS.DEBUG_EXIT_PATTERN
          .replace('{functionName}', funcName)
          .replace('{returnValue}', retExpr.trim());
        return `${debugExitForRet}\n return ${retExpr};`;
      }
    );
    // 若無 return，於結尾插入
    if (!/return\s+[^;]+;/.test(newBody)) {
      const debugExitNoRet = ENHANCED_DEBUG_CONSTANTS.DEBUG_EXIT_PATTERN
        .replace('{functionName}', funcName)
        .replace('{returnValue}', 'EFI_SUCCESS');
      newBody = newBody.replace(/\}\s*$/, `\n ${debugExitNoRet}\n}`);
    }

    // 合併
    return before + newBody + after;
  }
}
