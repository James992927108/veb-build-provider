// src/edk2-debug/constants.ts
// EDK2 Enhanced Debug Library - Core Constants Definition

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
  DEBUG_EXIT_PATTERN: 'DEBUG_EXIT("{functionName}", {returnValue});'
} as const;
