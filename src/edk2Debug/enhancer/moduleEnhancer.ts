// src/edk2Debug/enhancer/moduleEnhancer.ts

import * as fs from 'fs';
import { Edk2InfMeta } from '../types';
import { logMessage } from '../../utils/logger';

export class ModuleEnhancer {
  static async enhance(infMeta: Edk2InfMeta, maxDepth: number = 2): Promise<boolean> {
    // 1. Backup INF
    const infBackup = infMeta.filePath + '.bak';
    if (!fs.existsSync(infBackup)) {
      fs.copyFileSync(infMeta.filePath, infBackup);
    }

    // 2. Modify INF
    let infContent = fs.readFileSync(infMeta.filePath, 'utf-8');
    if (!infContent.includes('EnhancedDebugLib')) {
      infContent = infContent.replace(/\[LibraryClasses\][\r\n]+/, match => match + '  EnhancedDebugLib\n');
    }
    if (!infContent.includes('AmiModulePkg/AmiModulePkg.dec')) {
      infContent = infContent.replace(/\[Packages\][\r\n]+/, match => match + '  AmiModulePkg/AmiModulePkg.dec\n');
    }
    fs.writeFileSync(infMeta.filePath, infContent, 'utf-8');

    // 3. Process C source files
    for (const srcFile of infMeta.sourceFiles) {
      const cBackup = srcFile + '.bak';
      if (!fs.existsSync(cBackup)) {
        fs.copyFileSync(srcFile, cBackup);
      }
      let cContent = fs.readFileSync(srcFile, 'utf-8');

      // 插入 include，如果尚未包含
      const includeLine = '#include <Library/EnhancedDebugLib.h>';
      if (!cContent.includes(includeLine)) {
        // 插在所有 #include 之後，或最前面
        const includeRegex = /^(#include.*\n)+/;
        if (includeRegex.test(cContent)) {
          cContent = cContent.replace(includeRegex, match => match + includeLine + '\n');
        } else {
          cContent = includeLine + '\n' + cContent;
        }
        logMessage(`Inserted include for EnhancedDebugLib.h in: ${srcFile}`);
      }

      cContent = this.insertDebugMacros(cContent, infMeta.entryPoint, maxDepth);
      fs.writeFileSync(srcFile, cContent, 'utf-8');
    }

    return true;
  }

  /**
     * Restore INF and C files (.bak → original)
     * @returns { success: boolean, errors: string[] }
     */
  static async restore(infMeta: Edk2InfMeta): Promise<{ success: boolean, errors: string[] }> {
    const errors: string[] = [];

    // Restore INF
    const infBackup = infMeta.filePath + '.bak';
    if (fs.existsSync(infBackup)) {
      try {
        fs.copyFileSync(infBackup, infMeta.filePath);
        logMessage(`Restored INF: ${infMeta.filePath}`);
        // Delete INF .bak
        try {
          fs.unlinkSync(infBackup);
          logMessage(`Deleted INF backup: ${infBackup}`);
        } catch (e) {
          errors.push(`Delete INF backup failed: ${e}`);
          logMessage(`Delete INF backup failed: ${e}`);
        }
      } catch (e) {
        errors.push(`Restore INF failed: ${e}`);
        logMessage(`Restore INF failed: ${e}`);
      }
    } else {
      errors.push(`No backup found for INF: ${infMeta.filePath}`);
      logMessage(`No backup found for INF: ${infMeta.filePath}`);
    }

    // Restore C files
    for (const srcFile of infMeta.sourceFiles) {
      const cBackup = srcFile + '.bak';
      if (fs.existsSync(cBackup)) {
        try {
          fs.copyFileSync(cBackup, srcFile);
          logMessage(`Restored C file: ${srcFile}`);
          // Delete C .bak
          try {
            fs.unlinkSync(cBackup);
            logMessage(`Deleted C backup: ${cBackup}`);
          } catch (e) {
            errors.push(`Delete C backup failed: ${srcFile} (${e})`);
            logMessage(`Delete C backup failed: ${srcFile} (${e})`);
          }
        } catch (e) {
          errors.push(`Restore C file failed: ${srcFile} (${e})`);
          logMessage(`Restore C file failed: ${srcFile} (${e})`);
        }
      } else {
        errors.push(`No backup found for C file: ${srcFile}`);
        logMessage(`No backup found for C file: ${srcFile}`);
      }
    }

    return { success: errors.length === 0, errors };
  }

  private static insertDebugMacros(code: string, entryPoint: string, maxDepth: number): string {
    const funcMap = this.parseAllFunctions(code);

    logMessage(`=== Function Map Debug Information ===`);
    logMessage(`Total functions found: ${funcMap.size}`);
    logMessage(`Entry Point: ${entryPoint}`);
    logMessage(`Max Depth: ${maxDepth}`);
    if (funcMap.size > 0) {
      logMessage(`Function List:`);
      let index = 1;
      for (const [funcName, info] of funcMap.entries()) {
        logMessage(`${index}. Function: ${funcName}`);
        logMessage(`   Position: start=${info.start}, end=${info.end}`);
        logMessage(`   Length: ${info.end - info.start} characters`);
        index++;
      }
    } else {
      logMessage(`No functions found in the source code!`);
    }
    if (entryPoint && funcMap.has(entryPoint)) {
      logMessage(`✅ Entry Point '${entryPoint}' found in function map`);
    } else if (entryPoint) {
      logMessage(`❌ Entry Point '${entryPoint}' NOT found in function map`);
      logMessage(`Available functions: ${Array.from(funcMap.keys()).join(', ')}`);
    } else {
      logMessage(`⚠️ No entry point specified`);
    }
    logMessage(`=== End of Function Map Debug ===\n`);

    const visited = new Set<string>();
    return this.insertDebugRecursive(code, funcMap, entryPoint, maxDepth, visited, code);
  }

  private static parseAllFunctions(code: string): Map<string, { start: number, end: number }> {
    const funcMap = new Map<string, { start: number, end: number }>();
    logMessage(`Starting to parse functions from ${code.length} characters of code...`);
    const funcRegex = /([A-Za-z_][A-Za-z0-9_ \t\n\r*]*)\s+([A-Za-z_][A-Za-z0-9_]*)\s*\([^)]*\)\s*\{/g;
    let match;
    let matchCount = 0;
    while ((match = funcRegex.exec(code)) !== null) {
      matchCount++;
      const returnType = match[1].trim();
      const name = match[2];
      const start = match.index;
      logMessage(`Found function candidate ${matchCount}: ${name} (return type: ${returnType})`);
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
      if (braceCount === 0) {
        funcMap.set(name, { start, end: i });
        logMessage(`✅ Successfully parsed function: ${name} (${start}-${i})`);
      } else {
        logMessage(`❌ Failed to find closing brace for function: ${name}`);
      }
    }
    logMessage(`Function parsing completed. Found ${funcMap.size} valid functions out of ${matchCount} candidates.`);
    return funcMap;
  }

  private static insertDebugRecursive(
    code: string,
    funcMap: Map<string, { start: number, end: number }>,
    funcName: string,
    depth: number,
    visited: Set<string>,
    fullCode: string
  ): string {
    logMessage(`Processing function: ${funcName}, depth: ${depth}, visited: ${visited.has(funcName)}`);
    if (depth <= 0 || visited.has(funcName) || !funcMap.has(funcName)) {
      if (depth <= 0) { logMessage(`Skipping ${funcName}: max depth reached`); }
      if (visited.has(funcName)) { logMessage(`Skipping ${funcName}: already visited`); }
      if (!funcMap.has(funcName)) { logMessage(`Skipping ${funcName}: not found in function map`); }
      return code;
    }
    visited.add(funcName);
    logMessage(`✅ Processing ${funcName} at depth ${depth}`);

    const { start, end } = funcMap.get(funcName)!;
    let funcBody = code.slice(start, end);

    // Insert DEBUG_ENTRY() after first {
    funcBody = funcBody.replace(/\{/, '{\n  DEBUG_ENTRY();');

    // Insert DEBUG_EXIT(): before each return, or at the end if no return
    let hasReturn = false;
    funcBody = funcBody.replace(/(^|\s)(return\s+[^;]+;)/g, (match, prefix, retStmt) => {
      hasReturn = true;
      return `${prefix}DEBUG_EXIT();\n  ${retStmt}`;
    });
    if (!hasReturn) {
      funcBody = funcBody.replace(/\}\s*$/, '\n  DEBUG_EXIT();\n}');
    }

    logMessage(`✅ Inserted DEBUG_ENTRY and DEBUG_EXIT into ${funcName} (hasReturn=${hasReturn})`);

    // Find other functions called within this function
    const calledFuncs = Array.from(funcMap.keys()).filter(name => {
      if (name === funcName) {
        return false;
      }
      const regex = new RegExp(`\\b${name}\\s*\\(`);
      return regex.test(funcBody);
    });

    // NotifyPpi recursion
    const notifyPpiRegex = /NotifyPpi\s*\(\s*([^\),]+),\s*([A-Za-z_][A-Za-z0-9_]*)\s*\)/g;
    let notifyMatch;
    while ((notifyMatch = notifyPpiRegex.exec(funcBody)) !== null) {
      const notifyListName = notifyMatch[2];
      if (notifyListName) {
        logMessage(`Found NotifyPpi call with list: ${notifyListName}`);
        const notifyListRegex = new RegExp(
          `EFI_PEI_NOTIFY_DESCRIPTOR\\s+${notifyListName}\\s*\\[\\s*\\][^=]*=\\s*\\{([\\s\\S]*?)\\};`,
          'm'
        );
        const notifyListStruct = notifyListRegex.exec(fullCode);
        if (notifyListStruct) {
          const notifyItemRegex = /\{[^}]*?,\s*[^}]*?,\s*([A-Za-z_][A-ZaZ0-9_]*)\s*\}/g;
          let cbMatch;
          while ((cbMatch = notifyItemRegex.exec(notifyListStruct[1])) !== null) {
            const cbFuncName = cbMatch[1];
            if (funcMap.has(cbFuncName)) {
              logMessage(`NotifyPpi callback found: ${cbFuncName}, will process as next depth`);
              calledFuncs.push(cbFuncName);
            } else {
              logMessage(`NotifyPpi callback ${cbFuncName} not found in function map`);
            }
          }
        } else {
          logMessage(`NotifyList ${notifyListName} structure not found in code`);
        }
      } else {
        logMessage(`Cannot parse NotifyList name in NotifyPpi call`);
      }
    }

    if (calledFuncs.length > 0) {
      logMessage(`Found ${calledFuncs.length} function calls in ${funcName}: ${calledFuncs.join(', ')}`);
    } else {
      logMessage(`No function calls found in ${funcName}`);
    }

    // Recursively process next level
    for (const callee of calledFuncs) {
      if (depth > 1) {
        logMessage(`Recursing into ${callee} from ${funcName}`);
        code = this.insertDebugRecursive(code, funcMap, callee, depth - 1, visited, fullCode);
      } else {
        logMessage(`Skipping ${callee}: max depth would be exceeded`);
      }
    }

    // Replace original function body with new content
    code = code.slice(0, start) + funcBody + code.slice(end);
    return code;
  }
}
