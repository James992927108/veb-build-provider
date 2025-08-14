// src/edk2-debug/index.ts
// EDK2 Enhanced Debug Library - Main module entry

import * as vscode from 'vscode';
import { registerEdk2DebugCommands } from './commands/edk2DebugCommands';
import { LogLinkProvider, registerEnhancedDebugUriHandler } from './providers/logLinkProvider';
import { EnhancedLogParser } from './analysis/enhancedLogParser';
import { logMessage } from '../shared/utils/logger';

export function registerEdk2DebugModule(context: vscode.ExtensionContext): void {
    logMessage('[EDK2DebugModule] 註冊 EDK2 Debug 模組');

    // 註冊命令
    registerEdk2DebugCommands(context);

    // 註冊 DocumentLinkProvider 支援多種檔案類型
    const logLinkProvider = new LogLinkProvider();
    
    // 支援 .log 和 .txt 檔案
    context.subscriptions.push(
        vscode.languages.registerDocumentLinkProvider(
            [
                { scheme: 'file', pattern: '**/*.log' },
                { scheme: 'file', pattern: '**/*.txt' }
            ],
            logLinkProvider
        )
    );

    // 註冊 URI 處理器
    registerEnhancedDebugUriHandler(context);

    // 監聽活動編輯器變更，自動檢測 Enhanced Debug 檔案
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor && editor.document) {
                const fileName = editor.document.fileName;
                
                // 檢查是否為可能的日誌檔案
                if (fileName.match(/\.(log|txt)$/i)) {
                    // 異步檢查是否包含 Enhanced Debug 內容
                    setTimeout(() => {
                        if (EnhancedLogParser.hasEnhancedDebugContent(editor.document)) {
                            logMessage(`[EDK2DebugModule] 檢測到 Enhanced Debug 日誌檔案: ${fileName}`);
                            
                            // 狀態列提示使用者
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

    logMessage('[EDK2DebugModule] EDK2 Debug 模組註冊完成');
}