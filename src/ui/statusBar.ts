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
    // Dynamic Project/InitTask Button (動態顯示)
    projectStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 103);
    projectStatusBar.command = 'vebBuild.buildTool.initTask';
    projectStatusBar.text = '$(tools) InitTask';  // 預設顯示 InitTask
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

    // 初始化時檢查當前專案狀態
    updateProjectStatus();
    
    // 監聽檔案變化，自動更新狀態
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
            // 無工作區時顯示 InitTask
            projectStatusBar.text = '$(tools) InitTask';
            projectStatusBar.tooltip = 'No workspace opened';
            projectStatusBar.backgroundColor = undefined;
            logMessage("Status bar: No workspace");
            return;
        }

        const folderPath = workspaceFolder.uri.fsPath;
        const tasksJsonPath = path.join(folderPath, '.vscode', 'tasks.json');
        
        // 嘗試從 tasks.json 讀取當前專案
        const tasksJson = await readFile(tasksJsonPath);
        const tasksObject = JSON.parse(tasksJson);
        
        const buildTask = tasksObject.tasks?.find((task: any) => task.label === "VebBuildTask");
        if (buildTask) {
            // 已配置專案時顯示專案名稱
            const command = buildTask.command;
            const vebMatch = command.match(/SET VEB=(\w+)/);
            const currentProject = vebMatch ? vebMatch[1] : 'Unknown';
            
            projectStatusBar.text = `$(project) ${currentProject}`;
            projectStatusBar.tooltip = `Current VEB project: ${currentProject}\nClick to switch project (F8)`;
            projectStatusBar.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
            
            logMessage(`Status bar updated: Current project is ${currentProject}`);
        } else {
            // tasks.json 存在但沒有 VebBuildTask 時顯示 InitTask
            resetToInitTask();
        }
        
    } catch (error) {
        // 沒有 tasks.json 或讀取失敗時顯示 InitTask
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
 * Refresh the project status display (可以被外部呼叫)
 */
export function refreshProjectStatus(): void {
    updateProjectStatus();
}
