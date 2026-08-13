// src/extension.ts

import * as vscode from 'vscode';
import { initLogger, disposeLogger, logInfo, logDebug, outputChannel } from './shared/utils/logger';
import { registerStatusBarItems } from './shared/ui/statusBar';

// Import all modules
import { registerVebBuildModule } from './veb-build';
import { registerEdk2DebugModule } from './edk2-debug';
import { registerLanguageSupportModule } from './language-support';

export function activate(context: vscode.ExtensionContext): void {
    initLogger(context);
    logDebug(`Extension activated at: ${new Date().toISOString()}`);

    // Get module configuration
    const moduleConfig = vscode.workspace.getConfiguration('vebBuild.modules');

    // Conditionally register modules based on configuration
    if (moduleConfig.get('enableBuildTools', true)) {
        // Only surface the build output channel when build tools are enabled (OPT-21)
        outputChannel.show();
        logDebug('Loading VEB Build Tools module');
        registerVebBuildModule(context);
        // Register Status Bar only if build tools are enabled
        registerStatusBarItems(context);
    }

    if (moduleConfig.get('enableDebugTools', true)) {
        logDebug('Loading EDK2 Debug Tools module');
        registerEdk2DebugModule(context);
    }

    if (moduleConfig.get('enableLanguageSupport', true)) {
        logDebug('Loading Language Support module');
        registerLanguageSupportModule(context);
    }

    // Set workspace context (if needed for UI)
    vscode.commands.executeCommand('setContext', 'vebBuild.hasEdk2Workspace', !!vscode.workspace.workspaceFolders?.length);

    logDebug('Extension activation completed successfully');
}

export function deactivate(): void {
    logInfo(`Extension deactivated at: ${new Date().toISOString()}`);
    disposeLogger();
}
