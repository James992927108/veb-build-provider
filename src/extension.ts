// src/extension.ts

import * as vscode from 'vscode';
import { initLogger, disposeLogger, logInfo, logDebug, outputChannel } from './shared/utils/logger';
import { registerStatusBarItems } from './shared/ui/statusBar';
import { isMasterModuleEnabled } from './shared/utils/moduleConfig';

// Import all modules
import { registerVebBuildModule } from './veb-build';
import { registerEdk2DebugModule } from './edk2-debug';
import { registerLanguageSupportModule } from './language-support';

export function activate(context: vscode.ExtensionContext): void {
    initLogger(context);
    logDebug(`Extension activated at: ${new Date().toISOString()}`);

    // Level-1 master switches gate each top-level module. Per-module feature
    // switches are consumed inside each module itself.
    if (isMasterModuleEnabled('enableBuildTools')) {
        // Surface the build output channel at startup only when the user opted
        // in (default off) - calling show() every launch pops the Output panel
        // open, which is noisy. preserveFocus keeps the editor focused even
        // when the channel is revealed.
        if (vscode.workspace.getConfiguration('vebBuild.outputChannel').get('revealOnStartup', false)) {
            outputChannel.show(true);
        }
        logDebug('Loading VEB Build Tools module');
        registerVebBuildModule(context);
        // Register Status Bar only if build tools are enabled
        registerStatusBarItems(context);
    }

    if (isMasterModuleEnabled('enableDebugTools')) {
        logDebug('Loading EDK2 Debug Tools module');
        registerEdk2DebugModule(context);
    }

    if (isMasterModuleEnabled('enableLanguageSupport')) {
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
