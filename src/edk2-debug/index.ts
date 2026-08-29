// src/edk2-debug/index.ts
// EDK2 Enhanced Debug Library - Main module entry

import * as vscode from 'vscode';
import { registerEdk2DebugCommands } from './commands/edk2DebugCommands';
import { logDebug } from '../shared/utils/logger';

export function registerEdk2DebugModule(context: vscode.ExtensionContext): void {
    logDebug('[EDK2DebugModule] Registering EDK2 Debug module');

    // Register commands, the Enhanced Debug panel, module management, log
    // analysis and document-link integration. Sub-features are gated by the
    // Level-2 switches inside registerEdk2DebugCommands.
    registerEdk2DebugCommands(context);

    logDebug('[EDK2DebugModule] EDK2 Debug module registration completed');
}