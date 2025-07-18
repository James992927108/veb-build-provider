// src/language-support/commands/formatterCommandsEntry.ts

import * as vscode from 'vscode';
import { logMessage, handleError } from '../../shared/utils/logger';
import { registerCommandWithLog } from '../../shared/utils/commandRegistry';
import { Edk2Formatter } from './formatterCommands';

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
