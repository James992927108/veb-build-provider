import * as vscode from 'vscode';
import { logMessage } from '../../utils/logger';

/**
 * Initialize all VEB-related Status Bar buttons.
 * @param context VS Code extension context
 */
export function registerStatusBarItems(context: vscode.ExtensionContext) {
    // InitTask Button
    const initTaskButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 102);
    initTaskButton.command = 'extension.InitTask';
    initTaskButton.text = '$(tools) InitTask';
    initTaskButton.tooltip = 'Initialize VEB Tasks (F8)';
    initTaskButton.show();
    context.subscriptions.push(initTaskButton);
    logMessage("Created status bar button: InitTask");

    // VebBuild Button
    const vebBuildButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 101);
    vebBuildButton.command = 'extension.VebBuild';
    vebBuildButton.text = '$(play) Build';
    vebBuildButton.tooltip = 'Run VEB Build (F7)';
    vebBuildButton.show();
    context.subscriptions.push(vebBuildButton);
    logMessage("Created status bar button: VebBuild");

    // VebReBuild Button
    const runRebuildButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    runRebuildButton.command = 'extension.VebReBuild';
    runRebuildButton.text = '$(run-all) ReBuild';
    runRebuildButton.tooltip = 'Run VEB ReBuild (F9)';
    runRebuildButton.show();
    context.subscriptions.push(runRebuildButton);
    logMessage("Created status bar button: Run Veb ReBuild");

    // terminateTerminal Button
    const closeTerminalButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99);
    closeTerminalButton.command = "extension.terminateTerminal";
    closeTerminalButton.text = "$(stop) Close Terminal";
    closeTerminalButton.tooltip = "Terminate the active terminal";
    closeTerminalButton.show();
    context.subscriptions.push(closeTerminalButton);
    logMessage("Created status bar button: Close Terminal");
}
