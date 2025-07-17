// src/edk2Debug/scanner/infParser.ts
import * as path from 'path';
import { Edk2InfMeta, Edk2ModuleType, Edk2Architecture } from '../types';
import { Edk2Parser } from '../../edk2Language/edk2Language';

export class InfParser {
  async parse(content: string, filePath: string): Promise<Edk2InfMeta | null> {
    try {
      const baseName = Edk2Parser.parseKeyValue(content, 'BASE_NAME');
      if (!baseName) { return null; }

      const moduleTypeString = Edk2Parser.parseKeyValue(content, 'MODULE_TYPE');
      if (!moduleTypeString) { return null; }

      const entryPoint = Edk2Parser.parseKeyValue(content, 'ENTRY_POINT') || '';
      const architectures = this.parseArchitectures(content);
      const enhanced = this.checkIfEnhanced(content);
      const sourceFiles = this.parseSourceFiles(content, path.dirname(filePath));
      const dependencies = this.parseDependencies(content);

      const meta: Edk2InfMeta = {
        baseName: baseName,
        moduleType: this.parseModuleType(moduleTypeString),
        entryPoint: entryPoint,
        filePath: filePath,
        enhanced: enhanced,
        architectures: architectures,
        sourceFiles: sourceFiles,
        dependencies: dependencies,
        guid: Edk2Parser.parseKeyValue(content, 'FILE_GUID') || '',
        version: Edk2Parser.parseKeyValue(content, 'VERSION_STRING') || '1.0'
      };

      return meta;
    } catch (error) {
      console.error(`Failed to parse INF file:`, error);
      return null;
    }
  }

  private parseModuleType(moduleTypeString: string): Edk2ModuleType {
    // Remove comments after '#' and trim whitespace
    const cleanedType = moduleTypeString.split('#')[0].trim().toUpperCase();
    return Object.values(Edk2ModuleType).includes(cleanedType as Edk2ModuleType)
      ? cleanedType as Edk2ModuleType
      : Edk2ModuleType.USER_DEFINED;
  }

  private parseArchitectures(content: string): Edk2Architecture[] {
    const archStrings = Edk2Parser.parseArchitectures(content);
    return archStrings.map(arch => arch as Edk2Architecture);
  }

  private checkIfEnhanced(content: string): boolean {
    return content.includes('EnhancedDebugLib') ||
      content.includes('AmiModulePkg/AmiModulePkg.dec');
  }

  private parseSourceFiles(content: string, infDir: string): string[] {
    const sourceFiles: string[] = [];
    const sourcesLines = Edk2Parser.parseSection(content, 'Sources');

    for (const line of sourcesLines) {
      if (line.endsWith('.c') || line.endsWith('.h')) {
        const fullPath = path.resolve(infDir, line);
        sourceFiles.push(fullPath);
      }
    }

    return sourceFiles;
  }

  private parseDependencies(content: string): string[] {
    return Edk2Parser.parseSection(content, 'LibraryClasses');
  }
}
