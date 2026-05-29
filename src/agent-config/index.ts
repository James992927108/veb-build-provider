// src/agent-config/index.ts

import * as vscode from 'vscode';
import { registerAgentConfigCommands } from './commands/agentConfigCommands';

export function registerAgentConfigModule(context: vscode.ExtensionContext): void {
    registerAgentConfigCommands(context);
}

export * from './commands/agentConfigCommands';
