// src/commands/index.ts

import * as vscode from 'vscode';
import { registerBuildCommands } from './buildCommands';
import { registerFormatterCommands } from './formatterCommands';
import { registerEdk2DebugCommands } from './edk2DebugCommands';
import { registerLogAnalysisCommands } from './logAnalysisCommands';

export function registerAllCommands(context: vscode.ExtensionContext): void {
    registerBuildCommands(context);
    registerFormatterCommands(context);
    registerEdk2DebugCommands(context);
    registerLogAnalysisCommands(context);
}
