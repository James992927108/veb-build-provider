// src/veb-build/index.ts

import * as vscode from 'vscode';
import { registerVebBuildCommands } from './commands/buildCommands';

export function registerVebBuildModule(context: vscode.ExtensionContext): void {
    registerVebBuildCommands(context);
}

// Export all veb-build functionality
export * from './commands/buildCommands';
export * from './tools/expandMakefileVars';
