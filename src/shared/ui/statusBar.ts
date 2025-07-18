import * as vscode from 'vscode';
import * as path from 'path';
import { logMessage } from '../utils/logger';
import { readFile } from '../utils/file';

let projectStatusBar: vscode.StatusBarItem;

/**
 * Initialize all VEB-related Status Bar buttons.
 * @param context VS Code extension context
 */
export function registerStatusBarItems(context: vscode.ExtensionContext) {
    // Dynamic Project/InitTask Button (dynamic display)
    projectStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 103);
    projectStatusBar.command = 'vebBuild.buildTool.initTask';
    projectStatusBar.text = '$(tools) InitTask';  // Default display: InitTask
    projectStatusBar.tooltip = 'Initialize VEB Tasks (F8)';
    projectStatusBar.show();
    context.subscriptions.push(projectStatusBar);
    logMessage("Created status bar item: projectStatus");

    // VebBuild Button
    const vebBuildButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 102);
    vebBuildButton.command = 'vebBuild.buildTool.vebBuild';
    vebBuildButton.text = '$(play) Build';
    vebBuildButton.tooltip = 'Run VEB Build (F7)';
    vebBuildButton.show();
    context.subscriptions.push(vebBuildButton);
    logMessage("Created status bar button: vebBuild");

    // VebReBuild Button
    const runRebuildButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 101);
    runRebuildButton.command = 'vebBuild.buildTool.vebReBuild';
    runRebuildButton.text = '$(run-all) ReBuild';
    runRebuildButton.tooltip = 'Run VEB ReBuild (F9)';
    runRebuildButton.show();
    context.subscriptions.push(runRebuildButton);
    logMessage("Created status bar button: vebReBuild");

    // stopTerminal Button
    const closeTerminalButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    closeTerminalButton.command = "vebBuild.buildTool.stopTerminal";
    closeTerminalButton.text = "$(stop) Stop Terminal";
    closeTerminalButton.tooltip = "Stop the active terminal";
    closeTerminalButton.show();
    context.subscriptions.push(closeTerminalButton);
    logMessage("Created status bar button: stopTerminal");

    // Check current project status during initialization
    updateProjectStatus();
    
    // Watch for file changes and automatically update status
    const watcher = vscode.workspace.createFileSystemWatcher('**/.vscode/tasks.json');
    watcher.onDidChange(() => updateProjectStatus());
    watcher.onDidCreate(() => updateProjectStatus());
    watcher.onDidDelete(() => resetToInitTask());
    context.subscriptions.push(watcher);
}

/**
 * Update the project status display in status bar
 */
export async function updateProjectStatus(): Promise<void> {
    if (!projectStatusBar) return;

    try {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            // Show InitTask when no workspace is opened
            projectStatusBar.text = '$(tools) InitTask';
            projectStatusBar.tooltip = 'No workspace opened';
            projectStatusBar.backgroundColor = undefined;
            logMessage("Status bar: No workspace");
            return;
        }

        const folderPath = workspaceFolder.uri.fsPath;
        const tasksJsonPath = path.join(folderPath, '.vscode', 'tasks.json');
        
        // Try to read current project from tasks.json
        const tasksJson = await readFile(tasksJsonPath);
        const tasksObject = JSON.parse(tasksJson);
        
        const buildTask = tasksObject.tasks?.find((task: any) => task.label === "VebBuildTask");
        if (buildTask) {
            // Display project name when configured
            const command = buildTask.command;
            const vebMatch = command.match(/SET VEB=(\w+)/);
            const currentProject = vebMatch ? vebMatch[1] : 'Unknown';
            
            projectStatusBar.text = `$(project) ${currentProject}`;
            projectStatusBar.tooltip = `Current VEB project: ${currentProject}\nClick to switch project (F8)`;
            projectStatusBar.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
            
            logMessage(`Status bar updated: Current project is ${currentProject}`);
        } else {
            // Display InitTask when tasks.json exists but no VebBuildTask
            resetToInitTask();
        }
        
    } catch (error) {
        // Display InitTask when no tasks.json or read failed
        resetToInitTask();
    }
}

/**
 * Reset to InitTask display when project is not configured
 */
function resetToInitTask(): void {
    if (projectStatusBar) {
        projectStatusBar.text = '$(tools) InitTask';
        projectStatusBar.tooltip = 'Initialize VEB Tasks (F8)';
        projectStatusBar.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        logMessage('Status bar reset to InitTask');
    }
}

/**
 * Refresh the project status display (can be called externally)
 */
export function refreshProjectStatus(): void {
    updateProjectStatus();
}
