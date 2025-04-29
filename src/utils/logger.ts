// src/utils/logger.ts

import * as vscode from 'vscode';

// Create a global output channel
export const outputChannel = vscode.window.createOutputChannel('Veb Build Provider');

// Store original console.log
const originalConsoleLog = console.log;

// Define a unified logging function
export function logMessage(...args: any[]): void {
    const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');
    
    // Output to console (original behavior)
    originalConsoleLog.apply(console, args);
    
    // Output to VS Code's output channel
    outputChannel.appendLine(message);
}

// Error handling function
export function handleError(error: Error, message: string): void {
    const errorMsg = `${message}: ${error.message}`;
    console.error(errorMsg);
    logMessage(errorMsg);
    vscode.window.showErrorMessage(errorMsg);
}