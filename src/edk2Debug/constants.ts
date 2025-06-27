// src/edk2Debug/constants.ts
export const EDK2_DEBUG_COMMANDS = {
    SCAN_PROJECT: 'edk2Debug.scanProject',
    ENHANCE_MODULE: 'edk2Debug.enhanceModule',
    BATCH_ENHANCE: 'edk2Debug.batchEnhance',
    ANALYZE_LOG: 'edk2Debug.analyzeLog',
    GENERATE_REPORT: 'edk2Debug.generateReport'
} as const;

export const EDK2_MODULE_TYPES = {
    DXE_DRIVER: 'DXE_DRIVER',
    DXE_RUNTIME_DRIVER: 'DXE_RUNTIME_DRIVER',
    DXE_SMM_DRIVER: 'DXE_SMM_DRIVER',
    UEFI_DRIVER: 'UEFI_DRIVER',
    PEIM: 'PEIM'
} as const;
