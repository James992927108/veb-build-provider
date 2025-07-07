// src/utils/commandRegistry.ts

import * as vscode from 'vscode';
import { logMessage } from './logger';

export function registerCommandWithLog(
  context: vscode.ExtensionContext,
  commandId: string,
  handler: (...args: any[]) => any
): void {
  const disposable = vscode.commands.registerCommand(commandId, handler);
  context.subscriptions.push(disposable);
  logMessage(`Registered command: ${commandId}`);
}
