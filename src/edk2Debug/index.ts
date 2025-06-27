// src/edk2Debug/index.ts
export * from './types';
export * from './constants';

export function initializeEdk2Debug(): void {
    console.log('EDK2 Enhanced Debug Library module initialized');
}

export function isEdk2DebugReady(): boolean {
    return true;
}
