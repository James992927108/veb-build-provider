// src/edk2-debug/types.ts

// --- EDK2 project core types ---
export interface Edk2InfMeta {
  baseName: string;
  moduleType: Edk2ModuleType;
  entryPoint: string;
  filePath: string;
  enhanced: boolean;
  architectures: Edk2Architecture[];
  sourceFiles: string[];
  dependencies: string[];
  guid: string;
  version: string;
}

export enum Edk2ModuleType {
  BASE = 'BASE',
  SEC = 'SEC',
  PEI_CORE = 'PEI_CORE',
  PEIM = 'PEIM',
  DXE_CORE = 'DXE_CORE',
  DXE_DRIVER = 'DXE_DRIVER',
  DXE_RUNTIME_DRIVER = 'DXE_RUNTIME_DRIVER',
  DXE_SMM_DRIVER = 'DXE_SMM_DRIVER',
  DXE_SAL_DRIVER = 'DXE_SAL_DRIVER',
  UEFI_DRIVER = 'UEFI_DRIVER',
  UEFI_APPLICATION = 'UEFI_APPLICATION',
  USER_DEFINED = 'USER_DEFINED'
}

export enum Edk2Architecture {
  IA32 = 'IA32',
  X64 = 'X64',
  ARM = 'ARM',
  AARCH64 = 'AARCH64',
  RISCV64 = 'RISCV64'
}

export interface Edk2ScanOptions {
  recursive: boolean;
  excludePatterns: string[];
  includePatterns: string[];
  showProgress: boolean;
  maxDepth: number;
}

export interface Edk2ProjectStats {
  totalModules: number;
  enhancedModules: number;
  moduleTypes: Record<string, number>;
  architectures: Record<string, number>;
}

export interface StructInfo {
  name: string;
  members: string[];
  start: number;
  end: number;
}
