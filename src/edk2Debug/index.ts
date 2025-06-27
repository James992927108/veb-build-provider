// src/edk2Debug/index.ts
// EDK2 Enhanced Debug Library - Main module entry

// Export core types
export * from './types';

// Export constants
export * from './constants';

// Export scanner modules
export { InfParser } from './scanner/infParser';
export { ModuleScanner } from './scanner/moduleScanner';

// Export provider modules
export { Edk2ModuleProvider } from './provider/edk2ModuleProvider';

// Module information
export const EDK2_DEBUG_MODULE_INFO = {
  name: 'EDK2 Enhanced Debug Library',
  version: '1.0.0',
  description: 'Enhanced debugging tools for EDK2 BIOS development',
  author: 'VEB Build Provider Team'
} as const;