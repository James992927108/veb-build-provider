// src/edk2Debug/enhancer/moduleEnhancer.ts
import * as fs from 'fs';
import { Edk2InfMeta } from '../types';

export class ModuleEnhancer {
  static async enhance(infMeta: Edk2InfMeta): Promise<boolean> {
    // 1. Backup INF file
    const infBackup = infMeta.filePath + '.bak';
    if (!fs.existsSync(infBackup)) {
      fs.copyFileSync(infMeta.filePath, infBackup);
    }
    // 2. Read and modify INF file
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
      // Simple example: Insert DEBUG_ENTRY before ENTRY_POINT function, insert DEBUG_EXIT before return
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
