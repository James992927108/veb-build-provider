// src/edk2-debug/constants.ts
// EDK2 Enhanced Debug Library - Core Constants Definition

export const EDK2_DEBUG_COMMANDS = {
  SCAN_PROJECT: 'edk2Debug.scanProject',
  ENHANCE_MODULE: 'edk2Debug.enhanceModule',
  BATCH_ENHANCE: 'edk2Debug.batchEnhance',
  ANALYZE_LOG: 'edk2Debug.analyzeLog',
  GENERATE_REPORT: 'edk2Debug.generateReport'
} as const;


/**
 * EDK2 file related constants
 */
export const EDK2_FILE_CONSTANTS = {
  /** INF file extension */
  INF_EXTENSION: '.inf',
  /** DSC file extension */
  DSC_EXTENSION: '.dsc',
  /** DEC file extension */
  DEC_EXTENSION: '.dec',
  /** FDF file extension */
  FDF_EXTENSION: '.fdf',
  /** C source file extension */
  C_EXTENSION: '.c',
  /** Header file extension */
  H_EXTENSION: '.h',
  /** Assembly file extensions */
  ASM_EXTENSIONS: ['.asm', '.s', '.S']
} as const;

/**
 * INF file section names
 */
export const INF_SECTIONS = {
  DEFINES: 'Defines',
  SOURCES: 'Sources',
  INCLUDES: 'Includes',
  PACKAGES: 'Packages',
  LIBRARY_CLASSES: 'LibraryClasses',
  PROTOCOLS: 'Protocols',
  GUIDS: 'Guids',
  PPIS: 'Ppis',
  PCDS_FIXED_AT_BUILD: 'PcdsFixedAtBuild',
  PCDS_PATCHABLE: 'PcdsPatchableInModule',
  PCDS_FEATURE_FLAG: 'PcdsFeatureFlag',
  PCDS_DYNAMIC: 'PcdsDynamic',
  PCDS_DYNAMIC_EX: 'PcdsDynamicEx',
  BUILD_OPTIONS: 'BuildOptions',
  BINARIES: 'Binaries',
  DEPEX: 'Depex'
} as const;

/**
 * INF file Defines section keywords
 */
export const INF_DEFINES_KEYS = {
  INF_VERSION: 'INF_VERSION',
  BASE_NAME: 'BASE_NAME',
  FILE_GUID: 'FILE_GUID',
  MODULE_TYPE: 'MODULE_TYPE',
  VERSION_STRING: 'VERSION_STRING',
  ENTRY_POINT: 'ENTRY_POINT',
  UNLOAD_IMAGE: 'UNLOAD_IMAGE',
  CONSTRUCTOR: 'CONSTRUCTOR',
  DESTRUCTOR: 'DESTRUCTOR',
  LIBRARY_CLASS: 'LIBRARY_CLASS',
  MODULE_UNI_FILE: 'MODULE_UNI_FILE',
  PCD_IS_DRIVER: 'PCD_IS_DRIVER'
} as const;

/**
 * Enhanced Debug Library related constants
 */
export const ENHANCED_DEBUG_CONSTANTS = {
  /** Enhanced Debug Library name */
  LIBRARY_NAME: 'EnhancedDebugLib',
  /** AmiModulePkg path */
  AMI_MODULE_PKG: 'AmiModulePkg/AmiModulePkg.dec',
  /** Enhanced Debug Library header file */
  HEADER_FILE: '#include <Library/EnhancedDebugLib.h>',
  /** DEBUG_ENTRY function call pattern */
  DEBUG_ENTRY_PATTERN: 'DEBUG_ENTRY("{functionName}");',
  /** DEBUG_EXIT function call pattern */
  DEBUG_EXIT_PATTERN: 'DEBUG_EXIT("{functionName}", {returnValue});',
  /** DEBUG_JSON_LOG function call pattern */
  DEBUG_JSON_LOG_PATTERN: 'DEBUG_JSON_LOG("module_start", "{moduleName}", "DRIVER");'
} as const;

/**
 * Default scan options
 */
export const DEFAULT_SCAN_OPTIONS = {
  recursive: true,
  excludePatterns: [
    '**/Build/**',
    '**/build/**',
    '**/BUILD/**',
    '**/BuildBrh/**',
    'Build/**',
    'build/**',
    'BUILD/**',
    'BuildBrh/**',
    '**/Conf/**',
    'Conf/**',
    '**/.git/**',
    '**/node_modules/**',
    '**/.vscode/**'
  ],
  includePatterns: ['**/*.inf'],
  showProgress: true,
  maxDepth: 10
} as const;

/**
 * Supported EDK2 module type icon mapping
 */
export const MODULE_TYPE_ICONS = {
  'BASE': 'library',
  'SEC': 'shield',
  'PEI_CORE': 'gear',
  'PEIM': 'puzzle',
  'DXE_CORE': 'settings-gear',
  'DXE_DRIVER': 'circuit-board',
  'DXE_RUNTIME_DRIVER': 'clock',
  'DXE_SAL_DRIVER': 'cpu',
  'DXE_SMM_DRIVER': 'lock',
  'UEFI_DRIVER': 'device-desktop',
  'UEFI_APPLICATION': 'play',
  'USER_DEFINED': 'question'
} as const;

/**
 * Module type color theme
 */
export const MODULE_TYPE_COLORS = {
  'BASE': 'charts.blue',
  'SEC': 'charts.red',
  'PEI_CORE': 'charts.orange',
  'PEIM': 'charts.yellow',
  'DXE_CORE': 'charts.green',
  'DXE_DRIVER': 'charts.purple',
  'DXE_RUNTIME_DRIVER': 'charts.pink',
  'DXE_SAL_DRIVER': 'charts.gray',
  'DXE_SMM_DRIVER': 'errorForeground',
  'UEFI_DRIVER': 'charts.foreground',
  'UEFI_APPLICATION': 'textLink.foreground',
  'USER_DEFINED': 'descriptionForeground'
} as const;

/**
 * Regular expression patterns
 */
export const REGEX_PATTERNS = {
  /** Base name match */
  BASE_NAME: /^\s*BASE_NAME\s*=\s*([^\s#]+)/i,
  /** File GUID match */
  FILE_GUID: /^\s*FILE_GUID\s*=\s*([a-f0-9-]+)/i,
  /** Module type match */
  MODULE_TYPE: /^\s*MODULE_TYPE\s*=\s*([^\s#]+)/i,
  /** Entry point match */
  ENTRY_POINT: /^\s*ENTRY_POINT\s*=\s*([^\s#]+)/i,
  /** Version string match */
  VERSION_STRING: /^\s*VERSION_STRING\s*=\s*([^\s#]+)/i,
  /** Library class match */
  LIBRARY_CLASS: /^\s*LIBRARY_CLASS\s*=\s*([^\s#|]+)(\|([^\s#]+))?/i,
  /** Section header match */
  SECTION_HEADER: /^\s*\[([^\]]+)\]\s*$/,
  /** Comment line match */
  COMMENT_LINE: /^\s*(#|;|\/\/)/,
  /** Empty line match */
  EMPTY_LINE: /^\s*$/,
  /** Include path match */
  INCLUDE_PATH: /^\s*([^\s#]+)/,
  /** C function definition match */
  C_FUNCTION_DEF: /^\s*\w+\s+\*?\s*EFIAPI\s+(\w+)\s*\(/m,
  /** Return statement match */
  RETURN_STATEMENT: /return\s+([^;]+);/g
} as const;

/**
 * VSCode extension related constants
 */
export const VSCODE_CONSTANTS = {
  /** Extension ID */
  EXTENSION_ID: 'veb-build-provider',
  /** Command prefix */
  COMMAND_PREFIX: 'vebBuild.edk2Debug',
  /** Tree view ID */
  TREE_VIEW_ID: 'vebBuildEdk2Modules',
  /** Configuration section name */
  CONFIG_SECTION: 'vebBuild.edk2Debug'
} as const;

/**
 * Error code definitions
 */
export const ERROR_CODES = {
  /** File not found */
  FILE_NOT_FOUND: 'E001',
  /** File read error */
  FILE_READ_ERROR: 'E002',
  /** INF parse error */
  INF_PARSE_ERROR: 'E003',
  /** Unsupported module type */
  UNSUPPORTED_MODULE_TYPE: 'E004',
  /** Missing required field */
  MISSING_REQUIRED_FIELD: 'E005',
  /** Scan cancelled */
  SCAN_CANCELLED: 'E006',
  /** Python script execution failed */
  PYTHON_SCRIPT_ERROR: 'E007',
  /** Enhancement failed */
  ENHANCEMENT_FAILED: 'E008'
} as const;

/**
 * Success message codes
 */
export const SUCCESS_CODES = {
  /** Scan completed */
  SCAN_COMPLETED: 'S001',
  /** Module enhanced successfully */
  MODULE_ENHANCED: 'S002',
  /** Batch enhancement completed */
  BATCH_ENHANCEMENT_COMPLETED: 'S003',
  /** Analysis completed */
  ANALYSIS_COMPLETED: 'S004'
} as const;

