// src/edk2Debug/enhancer/moduleEnhancer.ts
import * as fs from 'fs';
import * as path from 'path';
import { Edk2InfMeta } from '../types';

export class ModuleEnhancer {
  static async enhance(infMeta: Edk2InfMeta): Promise<boolean> {
    // 1. 備份 INF
    const infBackup = infMeta.filePath + '.bak';
    if (!fs.existsSync(infBackup)) {
      fs.copyFileSync(infMeta.filePath, infBackup);
    }
    // 2. 讀取與修改 INF
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

    // 3. 處理 C 檔案
    for (const srcFile of infMeta.sourceFiles) {
      const cBackup = srcFile + '.bak';
      if (!fs.existsSync(cBackup)) {
        fs.copyFileSync(srcFile, cBackup);
      }
      let cContent = fs.readFileSync(srcFile, 'utf-8');
      // 簡單範例：在 ENTRY_POINT 函數前插入 DEBUG_ENTRY，return 前插入 DEBUG_EXIT
      if (infMeta.entryPoint && cContent.includes(infMeta.entryPoint)) {
        cContent = cContent.replace(
          new RegExp(`(${infMeta.entryPoint}\\s*\\([^)]*\\)\\s*\\{)`, 'm'),
          `$1\n  DEBUG_ENTRY();`
        );
        cContent = cContent.replace(/return\s+([^;]+);/g, 'DEBUG_EXIT();\n  return $1;');
      }
      fs.writeFileSync(srcFile, cContent, 'utf-8');
    }
    return true;
  }
}
