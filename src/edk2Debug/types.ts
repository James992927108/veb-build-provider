// src/edk2Debug/types.ts
export interface Edk2Module {
    name: string;
    infPath: string;
    entryPoint: string;
    moduleType: string;
    enhanced: boolean;
    sourceFiles: string[];
    description?: string;
}

export interface DebugConfig {
    autoScan: boolean;
    pythonPath: string;
    debugLevel: 'ERROR' | 'WARN' | 'INFO' | 'VERBOSE';
    autoBackup: boolean;
    enhancedLibraryPath: string;
}
