import * as vscode from 'vscode';
import { logMessage } from '../utils/logger';

/**
 * Initialize all VEB-related Status Bar buttons.
 * @param context VS Code extension context
 */
export function registerStatusBarItems(context: vscode.ExtensionContext) {
    // InitTask Button
    const initTaskButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 102);
    initTaskButton.command = 'vebBuild.buildTool.initTask';
    initTaskButton.text = '$(tools) InitTask';
    initTaskButton.tooltip = 'Initialize VEB Tasks (F8)';
    initTaskButton.show();
    context.subscriptions.push(initTaskButton);
    logMessage("Created status bar button: initTask");

    // VebBuild Button
    const vebBuildButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 101);
    vebBuildButton.command = 'vebBuild.buildTool.vebBuild';
    vebBuildButton.text = '$(play) Build';
    vebBuildButton.tooltip = 'Run VEB Build (F7)';
    vebBuildButton.show();
    context.subscriptions.push(vebBuildButton);
    logMessage("Created status bar button: vebBuild");

    // VebReBuild Button
    const runRebuildButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    runRebuildButton.command = 'vebBuild.buildTool.vebReBuild';
    runRebuildButton.text = '$(run-all) ReBuild';
    runRebuildButton.tooltip = 'Run VEB ReBuild (F9)';
    runRebuildButton.show();
    context.subscriptions.push(runRebuildButton);
    logMessage("Created status bar button: vebReBuild");

    // stopTerminal Button
    const closeTerminalButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99);
    closeTerminalButton.command = "vebBuild.buildTool.stopTerminal";
    closeTerminalButton.text = "$(stop) Stop Terminal";
    closeTerminalButton.tooltip = "Stop the active terminal";
    closeTerminalButton.show();
    context.subscriptions.push(closeTerminalButton);
    logMessage("Created status bar button: stopTerminal");
}
