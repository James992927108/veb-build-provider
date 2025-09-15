// src/extension.ts

import * as vscode from 'vscode';
import { initLogger, disposeLogger, logInfo, logDebug, outputChannel } from './shared/utils/logger';
import { detectPlatform, formatPlatformInfo } from './shared/utils/platform';
import { registerStatusBarItems } from './shared/ui/statusBar';

// Import all modules
import { registerVebBuildModule } from './veb-build';
import { registerEdk2DebugModule } from './edk2-debug';
import { registerLanguageSupportModule } from './language-support';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    initLogger(context);
    logInfo(`Extension activated at: ${new Date().toISOString()}`);

    // Detect and log platform information
    try {
        const platformInfo = await detectPlatform();
        logInfo(`Operating System: ${formatPlatformInfo(platformInfo)}`);
        logInfo(`Platform details: ${platformInfo.platform}, WSL: ${platformInfo.isWSL}`);
    } catch (error) {
        logInfo(`Platform detection failed: ${error}, using fallback: ${process.platform}`);
    }

    outputChannel.show();

    // Get module configuration
    const moduleConfig = vscode.workspace.getConfiguration('vebBuild.modules');

    // Conditionally register modules based on configuration
    if (moduleConfig.get('enableBuildTools', true)) {
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

    logInfo('Extension activation completed successfully');
}

export function deactivate(): void {
    logInfo(`Extension deactivated at: ${new Date().toISOString()}`);
    disposeLogger();
}
