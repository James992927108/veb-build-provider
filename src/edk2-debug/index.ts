// src/edk2-debug/index.ts
// EDK2 Enhanced Debug Library - Main module entry

import * as vscode from 'vscode';
import { registerEdk2DebugCommands } from './commands/edk2DebugCommands';
import { LogLinkProvider, registerEnhancedDebugUriHandler } from './providers/logLinkProvider';
import { EnhancedLogParser } from './analysis/enhancedLogParser';
import { logDebug } from '../shared/utils/logger';

export function registerEdk2DebugModule(context: vscode.ExtensionContext): void {
    logDebug('[EDK2DebugModule] Registering EDK2 Debug module');

    // Register commands
    registerEdk2DebugCommands(context);

    // Register DocumentLinkProvider for multiple file types
    const logLinkProvider = new LogLinkProvider();
    
    // Support .log and .txt files
    context.subscriptions.push(
        vscode.languages.registerDocumentLinkProvider(
            [
                { scheme: 'file', pattern: '**/*.log' },
                { scheme: 'file', pattern: '**/*.txt' }
            ],
            logLinkProvider
        )
    );

    // Register URI handler
    registerEnhancedDebugUriHandler(context);

    // Listen for active editor changes, auto-detect Enhanced Debug files
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor && editor.document) {
                const fileName = editor.document.fileName;
                
                // Check if this could be a log file
                if (fileName.match(/\.(log|txt)$/i)) {
                    // Asynchronously check if it contains Enhanced Debug content
                    setTimeout(() => {
                        if (EnhancedLogParser.hasEnhancedDebugContent(editor.document)) {
                            logDebug(`[EDK2DebugModule] Detected Enhanced Debug log file: ${fileName}`);
                            
                            // Show status bar notification to user
                            vscode.window.setStatusBarMessage(
                                '$(debug) Enhanced Debug log detected - Ctrl+Click functions to jump to source',
                                5000
                            );
                        }
                    }, 100);
                }
            }
        })
    );

    logDebug('[EDK2DebugModule] EDK2 Debug module registration completed');
}