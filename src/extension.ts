// src/extension.ts

import * as vscode from 'vscode';
import { initLogger, disposeLogger, logInfo, outputChannel } from './shared/utils/logger';
import { registerStatusBarItems } from './shared/ui/statusBar';

// Import all modules
import { registerVebBuildModule } from './veb-build';
import { registerEdk2DebugModule } from './edk2-debug';
import { registerLanguageSupportModule } from './language-support';

export function activate(context: vscode.ExtensionContext): void {
    initLogger(context);
    logInfo(`Extension activated at: ${new Date().toISOString()}`);

    outputChannel.show();

    // Register all modules
    registerVebBuildModule(context);
    registerEdk2DebugModule(context);
    registerLanguageSupportModule(context);

    // Register Status Bar (InitTask(F8), VebBuild(F7), VebReBuild(F9), stopTerminal)
    registerStatusBarItems(context);

    // Set workspace context (if needed for UI)
    vscode.commands.executeCommand('setContext', 'vebBuild.hasEdk2Workspace', !!vscode.workspace.workspaceFolders?.length);

    logInfo('Extension activation completed successfully');
}

export function deactivate(): void {
    logInfo(`Extension deactivated at: ${new Date().toISOString()}`);
    disposeLogger();
}
