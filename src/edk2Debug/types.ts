// src/edk2Debug/types.ts

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

export enum Edk2Enhancement {
  NOT_ENHANCED = 'NOT_ENHANCED',
  ENHANCED = 'ENHANCED',
  PARTIALLY_ENHANCED = 'PARTIALLY_ENHANCED',
  ENHANCEMENT_FAILED = 'ENHANCEMENT_FAILED'
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

// Backward compatible type aliases
export type InfMeta = Edk2InfMeta;
export type ModuleType = Edk2ModuleType;
export type Architecture = Edk2Architecture;
export type ScanOptions = Edk2ScanOptions;

// --- Log analysis and visualization related types ---

/**
 * 時間軸事件型別，用於前端 vis.js Timeline
 */
export interface TimelineEvent {
  timestamp: string;       // 原始時間戳字串（微秒或毫秒）
  function: string;        // 函數名稱
  module?: string;         // 模組名，可選
  type: 'entry' | 'exit' | 'event';  // 事件類型
  duration?: number;       // 若已計算，則為毫秒數
  status?: string;         // EXIT 時的狀態（如 Success、Error）
  depth?: number;          // 呼叫深度
}

/**
 * 分析結果的標準格式
 */
export interface AnalysisResult {
  summary: {
    totalEntries: number;
    totalFunctions: number;
    totalDuration: number;
    errorCount: number;
    analysisTime: string;
  };
  callChains: CallChainNode[];
  performance: PerformanceMetrics;
  errors: Array<{
    timestamp: string;
    function: string;
    module?: string;
    message: string;
  }>;
  timeline: TimelineEvent[];
}

/**
 * 強化後的分析結果，包含階段與詳細呼叫對應
 */
export interface EnhancedAnalysisResult extends AnalysisResult {
  phases: {
    pei_start: number;
    dxe_start: number;
  };
  detailedTimeline: Array<{
    timestamp: number;
    event_type: string;
    phase: string;
    function: string;
    module?: string;
    duration?: number;
    depth: number;
    status: string;
  }>;
  callChainPairs: Array<{
    function: string;
    phase: string;
    entry_time: number;
    exit_time: number;
    duration?: number;
    status: string;
    depth: number;
  }>;
}

// 其他輔助型別
export interface DebugLogEntry {
  timestamp: string;
  module: string;
  function: string;
  level: 'ENTRY' | 'EXIT' | 'INFO' | 'ERROR';
  message: string;
  data?: any;
}

export interface CallChainNode {
  function: string;
  module?: string;
  timestamp: string;
  duration?: number;
  children: CallChainNode[];
  performance: {
    entryTime: number;
    exitTime?: number;
    duration?: number;
  };
}

export interface PerformanceMetrics {
  totalFunctions: number;
  functionMetrics: {
    [functionName: string]: {
      callCount: number;
      totalDuration: number;
      avgDuration: number;
      maxDuration: number;
      minDuration: number;
    };
  };
  bootTime?: number;
  criticalPath?: string[];
}

export interface JSONLogFormat {
  timestamp: string;
  level: string;
  module: string;
  function: string;
  message: string;
  metadata?: {
    phase: 'PEI' | 'DXE' | 'BDS' | 'TSL';
    guid?: string;
    returnValue?: any;
    parameters?: any[];
  };
}

export interface StructInfo {
  name: string;
  members: string[];
  start: number;
  end: number;
}
