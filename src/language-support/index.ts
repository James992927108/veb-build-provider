// src/language-support/index.ts

import * as vscode from 'vscode';
import { registerLanguageProviders } from './registry';
import { registerFormatterCommands } from './commands/formatterCommandsEntry';

export function registerLanguageSupportModule(context: vscode.ExtensionContext): void {
    registerLanguageProviders(context);
    registerFormatterCommands(context);
}

// Export all language support functionality
export * from './registry';
export * from './commands/formatterCommandsEntry';
export * from './providers/definitionProvider';
export * from './providers/formattingProvider';
export * from './providers/symbolProvider';
export * from './core/edk2Formatter';
