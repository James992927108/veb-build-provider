// src/edk2Debug/scanner/infParser.ts
import * as path from 'path';
import { Edk2InfMeta, Edk2ModuleType, Edk2Architecture } from '../types';

export class InfParser {
  async parse(content: string, filePath: string): Promise<Edk2InfMeta | null> {
    try {
      const baseNameMatch = content.match(/^\s*BASE_NAME\s*=\s*(.+)$/m);
      if (!baseNameMatch) { return null; }

      const moduleTypeMatch = content.match(/^\s*MODULE_TYPE\s*=\s*(.+)$/m);
      if (!moduleTypeMatch) { return null; }

      const entryPointMatch = content.match(/^\s*ENTRY_POINT\s*=\s*(.+)$/m);

      const architectures = this.parseArchitectures(content);
      const enhanced = this.checkIfEnhanced(content);
      const sourceFiles = this.parseSourceFiles(content, path.dirname(filePath));
      const dependencies = this.parseDependencies(content);

      const meta: Edk2InfMeta = {
        baseName: baseNameMatch[1].trim(),
        moduleType: this.parseModuleType(moduleTypeMatch[1].trim()),
        entryPoint: entryPointMatch?.[1]?.trim() || '',
        filePath: filePath,
        enhanced: enhanced,
        architectures: architectures,
        sourceFiles: sourceFiles,
        dependencies: dependencies,
        guid: this.parseGuid(content),
        version: this.parseVersion(content)
      };

      return meta;
    } catch (error) {
      console.error(`Failed to parse INF file:`, error);
      return null;
    }
  }

  private parseModuleType(moduleTypeString: string): Edk2ModuleType {
    const normalizedType = moduleTypeString.toUpperCase();
    return Object.values(Edk2ModuleType).includes(normalizedType as Edk2ModuleType)
      ? normalizedType as Edk2ModuleType
      : Edk2ModuleType.USER_DEFINED;
  }

  private parseArchitectures(content: string): Edk2Architecture[] {
    const archMatch = content.match(/^\s*SUPPORTED_ARCHITECTURES\s*=\s*(.+)$/m);
    if (!archMatch) { return [Edk2Architecture.IA32, Edk2Architecture.X64]; }

    const archString = archMatch[1].trim();
    const supportedArchs: Edk2Architecture[] = [];

    if (archString.includes('IA32')) { supportedArchs.push(Edk2Architecture.IA32); }
    if (archString.includes('X64')) { supportedArchs.push(Edk2Architecture.X64); }
    if (archString.includes('ARM')) { supportedArchs.push(Edk2Architecture.ARM); }
    if (archString.includes('AARCH64')) { supportedArchs.push(Edk2Architecture.AARCH64); }
    if (archString.includes('RISCV64')) { supportedArchs.push(Edk2Architecture.RISCV64); }

    return supportedArchs.length > 0 ? supportedArchs : [Edk2Architecture.IA32, Edk2Architecture.X64];
  }

  private checkIfEnhanced(content: string): boolean {
    return content.includes('EnhancedDebugLib') ||
      content.includes('AmiModulePkg/AmiModulePkg.dec');
  }

  private parseSourceFiles(content: string, infDir: string): string[] {
    const sourceFiles: string[] = [];
    const sourcesMatch = content.match(/\[Sources[^\]]*\](.*?)(?=\[|\Z)/s);

    if (sourcesMatch) {
      const sourcesSection = sourcesMatch[1];
      const lines = sourcesSection.split('\n');

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') &&
          (trimmed.endsWith('.c') || trimmed.endsWith('.h'))) {
          const fullPath = path.resolve(infDir, trimmed);
          sourceFiles.push(fullPath);
        }
      }
    }

    return sourceFiles;
  }

  private parseDependencies(content: string): string[] {
    const dependencies: string[] = [];

    const libMatch = content.match(/\[LibraryClasses[^\]]*\](.*?)(?=\[|\Z)/s);
    if (libMatch) {
      const lines = libMatch[1].split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          dependencies.push(trimmed);
        }
      }
    }

    return dependencies;
  }

  private parseGuid(content: string): string {
    const guidMatch = content.match(/^\s*FILE_GUID\s*=\s*(.+)$/m);
    return guidMatch?.[1]?.trim() || '';
  }

  private parseVersion(content: string): string {
    const versionMatch = content.match(/^\s*VERSION_STRING\s*=\s*(.+)$/m);
    return versionMatch?.[1]?.trim() || '1.0';
  }
}
