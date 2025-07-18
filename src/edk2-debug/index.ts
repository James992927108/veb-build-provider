// src/edk2-debug/index.ts
// EDK2 Enhanced Debug Library - Main module entry

import * as vscode from 'vscode';
import { registerEdk2DebugCommands } from './commands/edk2DebugCommands';

export function registerEdk2DebugModule(context: vscode.ExtensionContext): void {
    registerEdk2DebugCommands(context);
}