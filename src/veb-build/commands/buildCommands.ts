// src/veb-build/commands/buildCommands.ts

import * as vscode from 'vscode';
import * as path from 'path';
import * as util from 'util';
import * as fs from 'fs/promises';
import { logInfo, logDebug, logError, logSummary, handleError, outputChannel } from '../../shared/utils/logger';
import { readFile, writeFile, copyFile, escapePath } from '../../shared/utils/file';
import { EXTENSION_ID } from '../../shared/utils/constants';
import { registerCommandWithLog } from '../../shared/utils/commandRegistry';

// Constants & Enums

const VSCODE_FOLDER = ".vscode";
const TASKS_JSON = "tasks.json";
const VEB_EXTENSION = '.veb';
const PREPARE_ENV_WIN_SCRIPT = 'PrepareEnvScript.bat';
const PREPARE_ENV_LINUX_SCRIPT = 'PrepareEnvLinuxScript.sh';

enum ShowType {
  InformationMessage = 0,
  QuickPick = 1
}

// Interfaces & Types

interface BuildInfo {
  startTime: number;
  vebFileName: string;
}

// Global Variables

const buildStartTimes = new Map<string, BuildInfo>();

// Utility Functions

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

function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

function getFolderPath(): string {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    logError("No workspace folder found. Please open a folder in VSCode.");
    return "";
  }
  return workspaceFolder.uri.fsPath;
}

// Build Time Tracking Functions

function setupTaskListener(context: vscode.ExtensionContext): void {
  
  const taskEndListener = vscode.tasks.onDidEndTask((e) => {
    const taskName = e.execution.task.name;
    if (buildStartTimes.has(taskName)) {
      const buildInfo = buildStartTimes.get(taskName)!;
      const endTime = Date.now();
      const duration = endTime - buildInfo.startTime;
      const formattedDuration = formatDuration(duration);
      const endTimeStr = new Date(endTime).toLocaleTimeString();
      
      buildStartTimes.delete(taskName);
      
      const folderPath = getFolderPath();
      
      // Log build completion info
      logInfo(`Folder: ${folderPath}`);
      logInfo(`VEB File: ${buildInfo.vebFileName}`);
      logInfo(`Build Time: ${formattedDuration}`);
      logInfo(`Task [${taskName}] end at ${endTimeStr}`);
      
      if (outputChannel) {
        outputChannel.show(true);
      }
      
      // Display build info in terminal if available
      setTimeout(() => {
        const terminals = vscode.window.terminals;
        for (const terminal of terminals) {
          if (terminal.name.includes('Task') || terminal.name.includes('VEB')) {
            terminal.sendText('');
            terminal.sendText(`echo "Folder: ${folderPath}"`);
            terminal.sendText(`echo "VEB File: ${buildInfo.vebFileName}"`);
            terminal.sendText(`echo "Build Time: ${formattedDuration}"`);
            terminal.sendText(`echo "Task [${taskName}] end at ${endTimeStr}"`);
            break;
          }
        }
      }, 1000);
    }
  });
  
  const taskStartListener = vscode.tasks.onDidStartTask((e) => {
    const taskName = e.execution.task.name;
    const startTimeStr = new Date().toLocaleTimeString();
    logInfo(`Task [${taskName}] started at ${startTimeStr}`);
  });
  
  context.subscriptions.push(taskEndListener, taskStartListener);
}

// Task Creation Functions

async function BuildDefaultTask(folderpath: string, selection: string, TaskfileUpdate: string): Promise<string> {
  logDebug("BuildDefaultTask Start");
  const vebExtension = vscode.extensions.getExtension(EXTENSION_ID);
  if (!vebExtension) { 
    throw new Error("Unable to get VEB build provider extension");
  }

  const isLinux = process.platform === 'linux';
  const isWindows = process.platform === 'win32';
  let result: string;
  logDebug(`Detected platform: ${process.platform}`);

  if (isWindows) {
    const teePath = escapePath(path.join(vebExtension.extensionPath, "tools", "tee.exe"));
    const sourceScriptPath = path.join(vebExtension.extensionPath, "tools", "scripts", PREPARE_ENV_WIN_SCRIPT);
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
      "version": "3.3.0",
      "tasks": [
        {
          "label": "VebBuildTask",
          "type": "shell",
          "command": "cmd /V /C \\"SET VEB=%s&&echo veb = !VEB! &&%s && %s 2>&1| %s %s\\"",
          "options": {
            "shell": {
              "executable": "cmd.exe",
              "args": ["/c"]
            }
          }
        },
        {
          "label": "VebReBuildTask",
          "type": "shell",
          "command": "cmd /V /C \\"SET VEB=%s&&echo veb = !VEB! &&%s && %s 2>&1| %s %s\\"",
          "options": {
            "shell": {
              "executable": "cmd.exe",
              "args": ["/c"]
            }
          }
        },
        {
          "label": "VebCleanTask",
          "type": "shell",
          "command": "cmd /V /C \\"SET VEB=%s&&echo veb = !VEB! &&%s && %s 2>&1| %s %s\\"",
          "options": {
            "shell": {
              "executable": "cmd.exe",
              "args": ["/c"]
            }
          }
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
    const sourceLinuxScript = path.join(vebExtension.extensionPath, "tools", "scripts", PREPARE_ENV_LINUX_SCRIPT);
    const targetLinuxScriptPath = escapePath(path.join(folderpath, VSCODE_FOLDER, PREPARE_ENV_LINUX_SCRIPT));
    await copyFile(sourceLinuxScript, targetLinuxScriptPath);
    logDebug(`Copied Linux prepare script to ${targetLinuxScriptPath}`);
    const logFile = `Build-${Veb}-${getFormattedTimestamp()}.log`;
    const logFilePath = escapePath(path.join(folderpath, logFile));
    
    const taskfileLinux = `{
      "version": "3.3.0",
      "tasks": [
        {
          "label": "VebBuildTask",
          "type": "shell",
          "command": "source %s && make 2>&1 | tee %s",
          "options": {
            "env": { "VEB": "%s" },
            "shell": {
              "executable": "/bin/bash",
              "args": ["-c"]
            }
          }
        },
        {
          "label": "VebReBuildTask",
          "type": "shell",
          "command": "source %s && make rebuild 2>&1 | tee %s",
          "options": {
            "env": { "VEB": "%s" },
            "shell": {
              "executable": "/bin/bash",
              "args": ["-c"]
            }
          }
        },
        {
          "label": "VebCleanTask",
          "type": "shell",
          "command": "source %s && make clean 2>&1 | tee %s",
          "options": {
            "env": { "VEB": "%s" },
            "shell": {
              "executable": "/bin/bash",
              "args": ["-c"]
            }
          }
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
  
  logDebug("BuildDefaultTask completed");
  return result;
}

async function createVscodeFolder(folderpath: string): Promise<void> {
  const vscodePath = path.join(folderpath, VSCODE_FOLDER);
  try {
    await fs.mkdir(vscodePath, { recursive: true });
    logInfo(".vscode folder created successfully");
  } catch (error) {
    handleError(`Failed to create .vscode folder: ${error instanceof Error ? error.stack || error.message : String(error)}`);
  }
}

async function writeTasksJson(folderpath: string, TaskfileUpdate: string): Promise<void> {
  try {
    await writeFile(path.join(folderpath, VSCODE_FOLDER, TASKS_JSON), TaskfileUpdate);
    logInfo("Successfully created tasks.json");
    vscode.window.showInformationMessage("Create tasks.json Success.");
  } catch (error) {
    handleError(`Failed to write tasks.json: ${error instanceof Error ? error.stack || error.message : String(error)}`);
  }
}

async function CreateBuildtask(folderpath: string, targetFiles: string[], start: number, end: number, showType: ShowType): Promise<void> {
  logDebug("Starting CreateBuildtask");
  logDebug(`Show Veb array from (${start}) to (${end})`);
  
  if (showType === ShowType.QuickPick) {
    const selection = await vscode.window.showQuickPick([...targetFiles.slice(start, end)], { placeHolder: 'Start Build for ?' });
    if (!selection) {
      logInfo("No selection made, operation cancelled");
      return;
    }
    await createVscodeFolder(folderpath);
    let TaskfileUpdate = await BuildDefaultTask(folderpath, selection, '');
    await writeTasksJson(folderpath, TaskfileUpdate);
  } else {
    logError("Unsupported ShowType");
    vscode.window.showInformationMessage('!!! Not support yet !!!');
  }
}

// Task Execution Functions

async function checkAndExecuteTask(taskName: string, errorMessage: string, trackTime: boolean = false): Promise<void> {
  logDebug(`Starting ${taskName}`);
  const folderpath = getFolderPath();
  if (!folderpath) {
    vscode.window.showErrorMessage("Workspace path is empty");
    logError("Workspace path is empty");
    return;
  }
  
  const tasksJsonPath = path.join(folderpath, VSCODE_FOLDER, TASKS_JSON);
  try {
    await fs.access(tasksJsonPath);
    
    if (taskName === "VebBuildTask") {
      const tasksJson = await readFile(tasksJsonPath);
      const commandList = tasksJson.split(/\r?\n/).filter(line => line.includes("label")).map(line => line.split(/"/)[3]);
      logDebug(commandList.join(', '));
      const selection = await vscode.window.showQuickPick(commandList, { placeHolder: 'Select command from command list' });
      
      if (selection) {
        logInfo(`Selected task: ${selection}`);
        if (trackTime) {
          // Parse VEB file name from task configuration
          let vebName = 'Unknown.veb';
          try {
            const tasksJson = await readFile(tasksJsonPath);
            const tasksData = JSON.parse(tasksJson);
            const task = tasksData.tasks?.find((t: any) => t.label === selection);
            
            if (task && task.command) {
              // Windows: extract VEB from command
              const vebMatch = task.command.match(/SET VEB=(\w+)/);
              const currentProject = vebMatch ? vebMatch[1] : 'Unknown';
              vebName = `${currentProject}.veb`;
            } else if (task && task.options && task.options.env && task.options.env.VEB) {
              // Linux: get VEB from environment variable
              const currentProject = task.options.env.VEB;
              vebName = `${currentProject}.veb`;
            }
          } catch (error) {
            logError(`Failed to parse VEB name from tasks.json: ${error}`);
          }
          
          buildStartTimes.set(selection, {
            startTime: Date.now(),
            vebFileName: vebName
          });
          logDebug(`Started tracking time for task: ${selection}, veb file: ${vebName}`);
        }
        await vscode.commands.executeCommand("workbench.action.tasks.runTask", selection);
      } else {
        logInfo("No task selected, operation cancelled");
      }
    } else {
      try {
        if (trackTime) {
          // Parse VEB file name from task configuration
          let vebName = 'Unknown.veb';
          try {
            const tasksJson = await readFile(tasksJsonPath);
            const tasksData = JSON.parse(tasksJson);
            const task = tasksData.tasks?.find((t: any) => t.label === taskName);
            
            if (task && task.command) {
              // Windows: extract VEB from command
              const vebMatch = task.command.match(/SET VEB=(\w+)/);
              const currentProject = vebMatch ? vebMatch[1] : 'Unknown';
              vebName = `${currentProject}.veb`;
            } else if (task && task.options && task.options.env && task.options.env.VEB) {
              // Linux: get VEB from environment variable
              const currentProject = task.options.env.VEB;
              vebName = `${currentProject}.veb`;
            }
          } catch (error) {
            logError(`Failed to parse VEB name from tasks.json: ${error}`);
          }
          
          buildStartTimes.set(taskName, {
            startTime: Date.now(),
            vebFileName: vebName
          });
          logDebug(`Started tracking time for task: ${taskName}, veb file: ${vebName}`);
          
          logInfo(`VEB File: ${vebName}`);
        }
        await vscode.commands.executeCommand("workbench.action.tasks.runTask", taskName);
        logInfo(`Task [${taskName}] started successfully`);
        vscode.window.showInformationMessage(`Task [${taskName}] has been started successfully!`);
      } catch (error) {
        logError(`Failed to start task [${taskName}]: ${error}`);
        vscode.window.showErrorMessage(`Failed to start task [${taskName}]: ${error}`);
      }
    }
  } catch (error) {
    logError(`${errorMessage}`);
    vscode.window.showErrorMessage(errorMessage);
  }
}

// Command Registration

export function registerVebBuildCommands(context: vscode.ExtensionContext): void {
  registerCommandWithLog(context, 'vebBuild.buildTool.initTask', handleInitTask);
  registerCommandWithLog(context, 'vebBuild.buildTool.vebBuild', handleVebBuild);
  registerCommandWithLog(context, 'vebBuild.buildTool.vebReBuild', handleVebReBuild);
  registerCommandWithLog(context, 'vebBuild.buildTool.stopTerminal', handleterminateTerminal);
  
  // Setup task listeners
  setupTaskListener(context);
}

// Command Handlers

export async function handleInitTask(): Promise<void> {
  logDebug("Starting handleInitTask");
  const folderpath = getFolderPath();
  if (!folderpath) {
    logError("No workspace folder found");
    vscode.window.showErrorMessage("No workspace folder found");
    return;
  }
  
  logDebug(`Workspace path: ${folderpath}`);
  try {
    const files = await fs.readdir(folderpath);
    const targetFiles = files.filter(file => path.extname(file).toLowerCase() === VEB_EXTENSION);
    logInfo(`Found ${targetFiles.length} .veb files`);
    await CreateBuildtask(folderpath, targetFiles, 0, targetFiles.length, ShowType.QuickPick);
  } catch (error) {
    handleError(`Unable to search for .veb files: ${error instanceof Error ? error.stack || error.message : String(error)}`);
  }
}

export function handleVebBuild(): Promise<void> {
  return checkAndExecuteTask("VebBuildTask", "VebBuildTask fail: initialize the tasks.json by pressing the shortcut key (F8).");
}

export async function handleVebReBuild(): Promise<void> {
  return checkAndExecuteTask("VebReBuildTask", "VebReBuildTask fail: initialize the tasks.json by pressing the shortcut key (F8).", true);
}

export function handleterminateTerminal(): void {
  logDebug("Starting handleterminateTerminal");
  const activeTerminal = vscode.window.activeTerminal;
  if (activeTerminal) {
    activeTerminal.sendText("\x03"); // Ctrl+C
    logInfo("Sent Ctrl+C to active terminal");
    vscode.window.showInformationMessage("Sent Ctrl+C to the active terminal.");
  } else {
    logInfo("No active terminal to terminate");
    vscode.window.showWarningMessage("No active terminal to send Ctrl+C.");
  }
}