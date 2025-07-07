// src/commands/formatterCommands.ts

import * as vscode from 'vscode';
import { logMessage, handleError } from '../utils/logger';
import { registerCommandWithLog } from '../utils/commandRegistry';
import { Edk2Formatter } from '../edk2Formatter/edk2Formatter';

export function registerFormatterCommands(context: vscode.ExtensionContext): void {
    registerCommandWithLog(context, 'vebBuild.formatter.formatEdk2', handleEdk2Formatter);
}

async function handleEdk2Formatter(): Promise<void> {
    try {
        logMessage("Starting Edk2Formatter");
        await Edk2Formatter();
        logMessage("Edk2Formatter completed successfully");
    } catch (error) {
        handleError(`Edk2Formatter failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}
