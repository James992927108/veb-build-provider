import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';
import { logDebug } from '../utils/logger';
import { readFile } from '../utils/file';
import { extractVebNameFromJson } from '../utils/taskConfig';

let projectStatusBar: vscode.StatusBarItem;
let updateTimeout: NodeJS.Timeout | undefined;
let isBuilding = false;
let buildingProject = '';

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
    logDebug("Created status bar item: projectStatus");

    // VebBuild Button
    const vebBuildButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 102);
    vebBuildButton.command = 'vebBuild.buildTool.vebBuild';
    vebBuildButton.text = '$(play) Build';
    vebBuildButton.tooltip = 'Run VEB Build (F7)';
    vebBuildButton.show();
    context.subscriptions.push(vebBuildButton);
    logDebug("Created status bar button: vebBuild");

    // VebReBuild Button
    const runRebuildButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 101);
    runRebuildButton.command = 'vebBuild.buildTool.vebReBuild';
    runRebuildButton.text = '$(run-all) ReBuild';
    runRebuildButton.tooltip = 'Run VEB ReBuild (F9)';
    runRebuildButton.show();
    context.subscriptions.push(runRebuildButton);
    logDebug("Created status bar button: vebReBuild");

    // stopTerminal Button
    const closeTerminalButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    closeTerminalButton.command = "vebBuild.buildTool.stopTerminal";
    closeTerminalButton.text = "$(stop) Stop Terminal";
    closeTerminalButton.tooltip = "Stop the active terminal";
    closeTerminalButton.show();
    context.subscriptions.push(closeTerminalButton);
    logDebug("Created status bar button: stopTerminal");

    // Check current project status during initialization
    updateProjectStatus();
    
    // Watch for file changes and automatically update status with debouncing
    const watcher = vscode.workspace.createFileSystemWatcher('**/.vscode/tasks.json');
    watcher.onDidChange(() => debouncedUpdateProjectStatus());
    watcher.onDidCreate(() => debouncedUpdateProjectStatus());
    watcher.onDidDelete(() => resetToInitTask());
    context.subscriptions.push(watcher);
}

/**
 * Debounced version of updateProjectStatus to prevent multiple rapid updates
 */
function debouncedUpdateProjectStatus(): void {
    // Clear any existing timeout
    if (updateTimeout) {
        clearTimeout(updateTimeout);
    }
    
    // Set a new timeout to update after 100ms of inactivity
    updateTimeout = setTimeout(() => {
        updateProjectStatus();
        updateTimeout = undefined;
    }, 100);
}

/**
 * Update the project status display in status bar
 */
export async function updateProjectStatus(): Promise<void> {
    if (!projectStatusBar) {return;}

    // Keep showing the building spinner while a build is in progress
    if (isBuilding) {
        const name = buildingProject || '...';
        projectStatusBar.text = `$(sync~spin) Building ${name}`;
        projectStatusBar.tooltip = 'VEB build in progress...';
        projectStatusBar.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
        return;
    }

    try {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            // Show InitTask when no workspace is opened
            projectStatusBar.text = '$(tools) InitTask';
            projectStatusBar.tooltip = 'No workspace opened';
            projectStatusBar.backgroundColor = undefined;
            logDebug("Status bar: No workspace");
            return;
        }

        const folderPath = workspaceFolder.uri.fsPath;
        const tasksJsonPath = path.join(folderPath, '.vscode', 'tasks.json');
        
        // Check if tasks.json exists before trying to read it
        try {
            await fs.access(tasksJsonPath);
        } catch {
            // File doesn't exist, show InitTask
            resetToInitTask();
            return;
        }
        
        // Try to read current project from tasks.json
        const tasksJson = await readFile(tasksJsonPath);
        const tasksObject = JSON.parse(tasksJson);

        // Keep the "no VebBuildTask" distinction (InitTask) separate from an
        // unextractable project name (Unknown); reuse the extraction rules the
        // build-time tracking uses so the two never drift apart.
        const buildTaskFound = !!tasksObject.tasks?.find((task: any) => task.label === "VebBuildTask");
        if (!buildTaskFound) {
            // Display InitTask when tasks.json exists but no VebBuildTask
            resetToInitTask();
            return;
        }

        // Shared parser returns 'Name.veb'; the status bar shows the bare name.
        const vebName = extractVebNameFromJson(tasksJson, 'VebBuildTask').replace(/\.veb$/, '');
        projectStatusBar.text = `$(project) ${vebName}`;
        projectStatusBar.tooltip = `Current VEB project: ${vebName}\nClick to switch project (F8)`;
        projectStatusBar.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');

        logDebug(`Status bar updated: Current project is ${vebName}`);

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
        logDebug('Status bar reset to InitTask');
    }
}

/**
 * Update the status bar to reflect a VEB build's running / finished state.
 * Called from the task lifecycle listeners (onDidStartTask / onDidEndTaskProcess).
 *
 * @param running   TRUE while the build is in progress, FALSE when it has ended.
 * @param project   Project name to display while building (optional; falls back
 *                  to the last-known project).
 */
export function setBuildState(running: boolean, project?: string): void {
    if (!projectStatusBar) { return; }

    if (running) {
        isBuilding = true;
        buildingProject = project || buildingProject;
        const name = buildingProject || '...';
        projectStatusBar.text = `$(sync~spin) Building ${name}`;
        projectStatusBar.tooltip = 'VEB build in progress...';
        projectStatusBar.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
        logDebug(`Status bar: building ${name}`);
    } else {
        isBuilding = false;
        buildingProject = '';
        // Restore the normal project / InitTask display
        updateProjectStatus();
        logDebug('Status bar: build finished');
    }
}


