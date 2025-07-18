// src/language-support/index.ts

import * as vscode from 'vscode';
import { registerLanguageProviders } from './commands/providerCommands';
import { registerFormatterCommands } from './commands/formatterCommands';

export function registerLanguageSupportModule(context: vscode.ExtensionContext): void {
    registerLanguageProviders(context);
    registerFormatterCommands(context);
}

// Export all language support functionality
export * from './commands/providerCommands';
export * from './commands/formatterCommands';
