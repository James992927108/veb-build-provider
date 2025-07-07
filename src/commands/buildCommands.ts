// src/commands/buildCommands.ts

import * as vscode from 'vscode';
import * as path from 'path';
import * as util from 'util';
import * as fs from 'fs/promises';
import { logMessage, handleError } from '../utils/logger';
import { readFile, writeFile, copyFile, escapePath } from '../utils/file';
import { EXTENSION_ID } from '../constants';
import { registerCommandWithLog } from '../utils/commandRegistry';

const VSCODE_FOLDER = ".vscode";
const TASKS_JSON = "tasks.json";
const VEB_EXTENSION = '.veb';
const PREPARE_ENV_WIN_SCRIPT = 'PrepareEnvScript.bat';
const PREPARE_ENV_LINUX_SCRIPT = 'PrepareEnvLinuxScript.sh';

enum ShowType {
  InformationMessage = 0,
  QuickPick = 1
}

// ----------- VSBuild 任務相關函式 -----------

function getFormattedTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}

async function BuildDefaultTask(folderpath: string, selection: string, TaskfileUpdate: string): Promise<string> {
  logMessage("BuildDefaultTask Start");
  const vebExtension = vscode.extensions.getExtension(EXTENSION_ID);
  if (!vebExtension) { 
    throw new Error("Unable to get VEB build provider extension");
  }

  const isLinux = process.platform === 'linux';
  const isWindows = process.platform === 'win32';
  let result: string;
  logMessage(`Detected platform: ${process.platform}`);

  if (isWindows) {
    const teePath = escapePath(path.join(vebExtension.extensionPath, "Tool", "tee.exe"));
    const sourceScriptPath = path.join(vebExtension.extensionPath, "scripts", PREPARE_ENV_WIN_SCRIPT);
    const targetScriptPath = escapePath(path.join(folderpath, VSCODE_FOLDER, PREPARE_ENV_WIN_SCRIPT));
    await copyFile(sourceScriptPath, targetScriptPath);
    const fileData = await readFile(path.join(folderpath, selection));
    function extractValue(data: string, key: string): string {
      const match = data.match(new RegExp(`^\\s*${key} = \"(.*?)\"`, 'm'));
      return match ? match[1] : "";
    }
    const buildCommand = extractValue(fileData, 'Build');
    const reBuildCommand = extractValue(fileData, 'BuildAll');
    const cleanCommand = extractValue(fileData, 'CleanCmd');
    const Veb = selection.split('.')[0];
    const logFile = `Build-${Veb}-${getFormattedTimestamp()}.log`;

    const TaskfileWindows = `{
      "version": "3.0.0",
      "tasks": [
        {
          "label": "VebBuildTask",
          "type": "shell",
          "command": "cmd /V /C \\"SET VEB=%s&&echo veb = !VEB! &&%s && %s 2>&1| %s %s\\""
        },
        {
          "label": "VebReBuildTask",
          "type": "shell",
          "command": "cmd /V /C \\"SET VEB=%s&&echo veb = !VEB! &&%s && %s 2>&1| %s %s\\""
        },
        {
          "label": "VebCleanTask",
          "type": "shell",
          "command": "cmd /V /C \\"SET VEB=%s&&echo veb = !VEB! &&%s && %s 2>&1| %s %s\\""
        }
      ]
    }`;

    result = util.format(TaskfileWindows,
      Veb, targetScriptPath, buildCommand, teePath, logFile,
      Veb, targetScriptPath, reBuildCommand, teePath, logFile,
      Veb, targetScriptPath, cleanCommand, teePath, logFile
    );
  } else if (isLinux) {
    const Veb = selection.split('.')[0];
    const sourceLinuxScript = path.join(vebExtension.extensionPath, "scripts", PREPARE_ENV_LINUX_SCRIPT);
    const targetLinuxScriptPath = escapePath(path.join(folderpath, VSCODE_FOLDER, PREPARE_ENV_LINUX_SCRIPT));
    await copyFile(sourceLinuxScript, targetLinuxScriptPath);
    logMessage(`Copied Linux prepare script to ${targetLinuxScriptPath}`);
    const logFile = `Build-${Veb}-${getFormattedTimestamp()}.log`;
    const logFilePath = escapePath(path.join(folderpath, logFile));
    const taskfileLinux = `{
      "version": "3.0.0",
      "tasks": [
        {
          "label": "VebBuildTask",
          "type": "shell",
          "command": "source %s && make 2>&1 | tee %s",
          "options": { "env": { "VEB": "%s" } }
        },
        {
          "label": "VebReBuildTask",
          "type": "shell",
          "command": "source %s && make rebuild 2>&1 | tee %s",
          "options": { "env": { "VEB": "%s" } }
        },
        {
          "label": "VebCleanTask",
          "type": "shell",
          "command": "source %s && make clean 2>&1 | tee %s",
          "options": { "env": { "VEB": "%s" } }
        }
      ]
    }`;
    result = util.format(taskfileLinux,
      targetLinuxScriptPath, logFilePath, Veb,
      targetLinuxScriptPath, logFilePath, Veb,
      targetLinuxScriptPath, logFilePath, Veb
    );
  } else {
    throw new Error("Unsupported platform");
  }
  logMessage("BuildDefaultTask completed");
  return result;
}

async function createVscodeFolder(folderpath: string): Promise<void> {
  const vscodePath = path.join(folderpath, VSCODE_FOLDER);
  try {
    await fs.mkdir(vscodePath, { recursive: true });
    logMessage(".vscode folder created successfully");
  } catch (error) {
    handleError(`Failed to create .vscode folder: ${error instanceof Error ? error.stack || error.message : String(error)}`);
  }
}

async function writeTasksJson(folderpath: string, TaskfileUpdate: string): Promise<void> {
  try {
    await writeFile(path.join(folderpath, VSCODE_FOLDER, TASKS_JSON), TaskfileUpdate);
    logMessage("Successfully created tasks.json");
    vscode.window.showInformationMessage("Create tasks.json Success.");
  } catch (error) {
    handleError(`Failed to write tasks.json: ${error instanceof Error ? error.stack || error.message : String(error)}`);
  }
}

async function CreateBuildtask(folderpath: string, targetFiles: string[], start: number, end: number, showType: ShowType): Promise<void> {
  logMessage("Starting CreateBuildtask");
  logMessage(`Show Veb array from (${start}) to (${end})`);
  if (showType === ShowType.QuickPick) {
    const selection = await vscode.window.showQuickPick([...targetFiles.slice(start, end)], { placeHolder: 'Start Build for ?' });
    if (!selection) {
      logMessage("No selection made, operation cancelled");
      return;
    }
    await createVscodeFolder(folderpath);
    let TaskfileUpdate = await BuildDefaultTask(folderpath, selection, '');
    await writeTasksJson(folderpath, TaskfileUpdate);
  } else {
    logMessage("Unsupported ShowType");
    vscode.window.showInformationMessage('!!! Not support yet !!!');
  }
}

function getFolderPath(): string {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    logMessage("No workspace folder found. Please open a folder in VSCode.");
    return "";
  }
  return workspaceFolder.uri.fsPath;
}

// ----------- VSBuild 命令註冊 -----------

export function registerBuildCommands(context: vscode.ExtensionContext): void {
  registerCommandWithLog(context, 'vebBuild.buildTool.initTask', handleInitTask);
  registerCommandWithLog(context, 'vebBuild.buildTool.vebBuild', handleVebBuild);
  registerCommandWithLog(context, 'vebBuild.buildTool.vebReBuild', handleVebReBuild);
  registerCommandWithLog(context, 'vebBuild.buildTool.stopTerminal', handleterminateTerminal);
}

// ----------- VSBuild 命令處理函式 -----------

export async function handleInitTask(): Promise<void> {
  logMessage("Starting handleInitTask");
  const folderpath = getFolderPath();
  if (!folderpath) {
    logMessage("No workspace folder found");
    vscode.window.showErrorMessage("No workspace folder found");
    return;
  }
  logMessage(`Workspace path: ${folderpath}`);
  try {
    const files = await fs.readdir(folderpath);
    const targetFiles = files.filter(file => path.extname(file).toLowerCase() === VEB_EXTENSION);
    logMessage(`Found ${targetFiles.length} .veb files`);
    await CreateBuildtask(folderpath, targetFiles, 0, targetFiles.length, ShowType.QuickPick);
  } catch (error) {
    handleError(`Unable to search for .veb files: ${error instanceof Error ? error.stack || error.message : String(error)}`);
  }
}

async function checkAndExecuteTask(taskName: string, errorMessage: string): Promise<void> {
  logMessage(`Starting ${taskName}`);
  const folderpath = getFolderPath();
  if (!folderpath) {
    vscode.window.showErrorMessage("Workspace path is empty");
    logMessage("Workspace path is empty");
    return;
  }
  const tasksJsonPath = path.join(folderpath, VSCODE_FOLDER, TASKS_JSON);
  try {
    await fs.access(tasksJsonPath);
    logMessage(taskName);
    if (taskName === "VebBuildTask") {
      const tasksJson = await readFile(tasksJsonPath);
      const commandList = tasksJson.split(/\r?\n/).filter(line => line.includes("label")).map(line => line.split(/"/)[3]);
      logMessage(commandList.join(', '));
      const selection = await vscode.window.showQuickPick(commandList, { placeHolder: 'Select command from command list' });
      if (selection) {
        logMessage(`Selected task: ${selection}`);
        await vscode.commands.executeCommand("workbench.action.tasks.runTask", selection);
      } else {
        logMessage("No task selected, operation cancelled");
      }
    } else {
      try {
        await vscode.commands.executeCommand("workbench.action.tasks.runTask", taskName);
        logMessage(`Task [${taskName}] started successfully`);
        vscode.window.showInformationMessage(`Task [${taskName}] has been started successfully!`);
      } catch (error) {
        logMessage(`Failed to start task [${taskName}]: ${error}`);
        vscode.window.showErrorMessage(`Failed to start task [${taskName}]: ${error}`);
      }
    }
  } catch (error) {
    logMessage(`${errorMessage}`);
    vscode.window.showErrorMessage(errorMessage);
  }
}

export function handleVebBuild(): Promise<void> {
  return checkAndExecuteTask("VebBuildTask", "VebBuildTask fail: initialize the tasks.json by pressing the shortcut key (F8).");
}

export function handleVebReBuild(): Promise<void> {
  return checkAndExecuteTask("VebReBuildTask", "VebReBuildTask fail: initialize the tasks.json by pressing the shortcut key (F8).");
}

export function handleterminateTerminal(): void {
  logMessage("Starting handleterminateTerminal");
  const activeTerminal = vscode.window.activeTerminal;
  if (activeTerminal) {
    activeTerminal.sendText("\x03"); // Ctrl+C
    logMessage("Sent Ctrl+C to active terminal");
    vscode.window.showInformationMessage("Sent Ctrl+C to the active terminal.");
  } else {
    logMessage("No active terminal to terminate");
    vscode.window.showWarningMessage("No active terminal to send Ctrl+C.");
  }
}
