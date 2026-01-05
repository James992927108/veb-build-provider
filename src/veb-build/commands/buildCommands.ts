// src/veb-build/commands/buildCommands.ts

import * as vscode from 'vscode';
import * as path from 'path';
import * as util from 'util';
import * as fs from 'fs/promises';
import { logInfo, logDebug, logError, logWarn, logSummary, handleError, outputChannel } from '../../shared/utils/logger';
import { readFile, writeFile, copyFile, escapePath } from '../../shared/utils/file';
import { EXTENSION_ID } from '../../shared/utils/constants';
import { registerCommandWithLog } from '../../shared/utils/commandRegistry';
import { expandMakefileVars } from '../tools/expandMakefileVars';
import { PROJECT_CONFIG } from '../../shared/config';

// Constants & Enums

const VSCODE_FOLDER = ".vscode";
const TASKS_JSON = "tasks.json";
const VEB_EXTENSION = '.veb';
const PREPARE_ENV_WIN_SCRIPT = 'PrepareEnvScript.bat';
const PREPARE_ENV_LINUX_SCRIPT = 'PrepareEnvLinuxScript.sh';
const ASKPASS_SCRIPT = 'askpass.sh';
const CUSTOM_BUILD_SCRIPT = 'CustomBuild.sh';

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

// Environment Selection Types
type TargetEnvironment = 'windows' | 'linux';

interface EnvironmentOption {
  label: string;
  description: string;
  detail: string;
  value: TargetEnvironment;
}

// Utility Functions

// Environment Selection Functions

async function showEnvironmentSelection(): Promise<TargetEnvironment | undefined> {
  const items: EnvironmentOption[] = [
    {
      label: '$(terminal-powershell) Windows',
      description: 'Use Windows batch script (PrepareEnvScript.bat)',
      detail: 'For Windows native development environment',
      value: 'windows'
    },
    {
      label: '$(terminal-bash) Linux/WSL',
      description: 'Use Linux shell script (PrepareEnvLinuxScript.sh)',
      detail: 'For Linux or Windows Subsystem for Linux development',
      value: 'linux'
    }
  ];

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'Select target build environment'
  });

  return selected?.value;
}

// Task Creation Functions

async function BuildDefaultTask(folderpath: string, selection: string, targetEnvironment: TargetEnvironment): Promise<string> {
  logDebug("BuildDefaultTask Start");
  const vebExtension = vscode.extensions.getExtension(EXTENSION_ID);
  if (!vebExtension) {
    throw new Error("Unable to get VEB build provider extension");
  }

  let result: string;
  logInfo(`Target environment: ${targetEnvironment}`);

  if (targetEnvironment === 'windows') {
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
      "version": "${PROJECT_CONFIG.VERSION}",
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
  } else if (targetEnvironment === 'linux') {
    // Linux/WSL handling
    const Veb = selection.split('.')[0];
    // Create PrepareEnvLinuxScript.sh dynamically for Linux/WSL
    const targetLinuxScriptPath = path.join(folderpath, VSCODE_FOLDER, PREPARE_ENV_LINUX_SCRIPT);
    const askpassScriptPath = path.join(folderpath, VSCODE_FOLDER, ASKPASS_SCRIPT);
    const linuxScriptContent = `export TOOLS_DIR=/home/sut/Desktop/VEB/Linux_x64_Aptio_5.x_TOOLS_54/Tools
# export AARCH64_TOOLS_DIR=/opt/arm-gnu-toolchain-12.3.rel1-x86_64-aarch64-none-linux-gnu/bin
export AARCH64_TOOLS_DIR=/home/sut/gcc-cross-compiler/arm-gnu-toolchain-12.3.rel1-x86_64-aarch64-none-linux-gnu/bin
export AARCH64_TOOL_PREFIX=aarch64-none-linux-gnu-`;

    try {
      // Write file with LF line endings (normalize line endings)
      const contentWithLF = linuxScriptContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      await writeFile(targetLinuxScriptPath, contentWithLF);
      logDebug(`Created Linux prepare script for Linux/WSL at ${targetLinuxScriptPath}`);

      logDebug('Linux prepare script created (permissions will be handled by task execution)');
    } catch (error) {
      logWarn(`Failed to create Linux prepare script: ${error}`);
    }

    // Create askpass.sh dynamically for Linux/WSL sudo operations
    const targetAskpassScriptPath = path.join(folderpath, VSCODE_FOLDER, ASKPASS_SCRIPT);
    const askpassContent = `#!/bin/bash
# Simple askpass script that can be used with sudo -A
# Auto-generated by VEB Build Provider
echo "111111"`;

    try {
      // Write file with LF line endings (normalize line endings)
      const askpassContentWithLF = askpassContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      await writeFile(targetAskpassScriptPath, askpassContentWithLF);
      logDebug(`Created askpass script for Linux/WSL at ${targetAskpassScriptPath}`);

      logDebug('Askpass script created (permissions will be handled by task execution)');
    } catch (error) {
      logWarn(`Failed to create askpass script: ${error}`);
    }

    // Create CustomBuild.sh for user-defined build commands
    const customBuildScriptPath = path.join(folderpath, VSCODE_FOLDER, CUSTOM_BUILD_SCRIPT);
    const customBuildContent = `#!/bin/bash
# VEB Build Provider - Custom Build Script
# Auto-generated by VEB Build Provider
#
# This script is called by VebCustomBuildTask
# Environment variables available:
#   VEB           - Current VEB project name (currently: ${Veb})
#   SUDO_ASKPASS  - Path to askpass script
#
# Usage:
#   Edit this file and add your custom build commands below
#
# Examples:
#   ./GB300_Release_Build.sh GB300Standard
#   ./GB300_Release_Build.sh $VEB
#   make clean && ./custom_build.sh && ./post_process.sh
#
# Add your build commands below:

`;

    try {
      const customBuildContentWithLF = customBuildContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      await writeFile(customBuildScriptPath, customBuildContentWithLF);
      logDebug(`Created CustomBuild.sh template at ${customBuildScriptPath}`);
    } catch (error) {
      logWarn(`Failed to create CustomBuild.sh: ${error}`);
    }

    // No wrapper scripts needed - tasks will call commands directly

    // Use paths directly since extension runs in WSL/Linux environment
    const linuxScriptPath = targetLinuxScriptPath;
    const linuxAskpassPath = targetAskpassScriptPath;
    const logFile = `Build-${Veb}-${getFormattedTimestamp()}.log`;
    const linuxLogFilePath = path.join(folderpath, logFile);

    logDebug(`Linux script path: ${linuxScriptPath}`);
    logDebug(`Linux askpass path: ${linuxAskpassPath}`);
    logDebug(`Linux log file path: ${linuxLogFilePath}`);

    const taskfileLinux = `{
      "version": "${PROJECT_CONFIG.VERSION}",
      "tasks": [
        {
          "label": "VebBuildTask",
          "type": "shell",
          "command": "chmod +x %s && chmod +x %s && sudo -A bash -c 'export VEB=%s && source %s && make 2>&1 | tee %s'",
          "options": {
            "env": {
              "VEB": "%s",
              "SUDO_ASKPASS": "%s"
            }
          }
        },
        {
          "label": "VebReBuildTask",
          "type": "shell",
          "command": "chmod +x %s && chmod +x %s && sudo -A bash -c 'export VEB=%s && source %s && make rebuild 2>&1 | tee %s'",
          "options": {
            "env": {
              "VEB": "%s",
              "SUDO_ASKPASS": "%s"
            }
          }
        },
        {
          "label": "VebCustomBuildTask",
          "type": "shell",
          "command": "chmod +x %s %s ./.vscode/CustomBuild.sh && sudo -A ./.vscode/CustomBuild.sh",
          "options": {
            "env": {
              "VEB": "%s",
              "SUDO_ASKPASS": "%s"
            }
          }
        },
        {
          "label": "VebCleanTask",
          "type": "shell",
          "command": "chmod +x %s && chmod +x %s && sudo -A bash -c 'export VEB=%s && source %s && make clean 2>&1 | tee %s'",
          "options": {
            "env": {
              "VEB": "%s",
              "SUDO_ASKPASS": "%s"
            }
          }
        }
      ]
    }`;

    result = util.format(taskfileLinux,
      // VebBuildTask parameters
      linuxAskpassPath, linuxScriptPath, Veb, linuxScriptPath, linuxLogFilePath, Veb, linuxAskpassPath,
      // VebReBuildTask parameters
      linuxAskpassPath, linuxScriptPath, Veb, linuxScriptPath, linuxLogFilePath, Veb, linuxAskpassPath,
      // VebCustomBuildTask parameters
      linuxAskpassPath, linuxScriptPath, Veb, linuxAskpassPath,
      // VebCleanTask parameters
      linuxAskpassPath, linuxScriptPath, Veb, linuxScriptPath, linuxLogFilePath, Veb, linuxAskpassPath
    );
  } else {
    throw new Error(`Unsupported target environment: ${targetEnvironment}`);
  }
  
  logDebug("BuildDefaultTask completed");
  return result;
}

async function createVscodeFolder(folderpath: string): Promise<void> {
  const vscodePath = path.join(folderpath, VSCODE_FOLDER);
  try {
    await fs.mkdir(vscodePath, { recursive: true });
    logDebug(".vscode folder created successfully");
  } catch (error) {
    handleError(`Failed to create .vscode folder: ${error instanceof Error ? error.stack || error.message : String(error)}`);
  }
}

async function writeTasksJson(folderpath: string, TaskfileUpdate: string): Promise<void> {
  try {
    await writeFile(path.join(folderpath, VSCODE_FOLDER, TASKS_JSON), TaskfileUpdate);
    logDebug("Successfully created tasks.json");
    vscode.window.showInformationMessage("Create tasks.json Success.");
  } catch (error) {
    handleError(`Failed to write tasks.json: ${error instanceof Error ? error.stack || error.message : String(error)}`);
  }
}

async function CreateBuildtask(folderpath: string, targetFiles: string[], start: number, end: number, showType: ShowType): Promise<void> {
  logDebug("Starting CreateBuildtask");
  logDebug(`Show Veb array from (${start}) to (${end})`);

  if (showType === ShowType.QuickPick) {
    // Stage 1: VEB file selection
    const vebSelection = await vscode.window.showQuickPick([...targetFiles.slice(start, end)], {
      placeHolder: 'Select VEB file to build'
    });
    if (!vebSelection) {
      logInfo("No VEB file selected, operation cancelled");
      return;
    }
    logInfo(`Selected VEB file: ${vebSelection}`);

    // Stage 2: Environment selection
    const environmentSelection = await showEnvironmentSelection();
    if (!environmentSelection) {
      logInfo("No environment selected, operation cancelled");
      return;
    }
    logInfo(`Selected environment: ${environmentSelection}`);

    // Stage 3: Generate task configuration
    await createVscodeFolder(folderpath);
    const taskConfig = await BuildDefaultTask(folderpath, vebSelection, environmentSelection);
    await writeTasksJson(folderpath, taskConfig);
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
            logDebug(`Found task: ${task ? 'yes' : 'no'}, selected task: ${selection}`);

            if (task) {
              if (task.command && task.command.includes('SET VEB=')) {
                // Windows: extract VEB from command
                const vebMatch = task.command.match(/SET VEB=(\w+)/);
                const currentProject = vebMatch ? vebMatch[1] : 'Unknown';
                vebName = `${currentProject}.veb`;
                logDebug(`Windows VEB extracted: ${vebName}`);
              } else if (task.options && task.options.env && task.options.env.VEB) {
                // Linux: get VEB from environment variable
                const currentProject = task.options.env.VEB;
                vebName = `${currentProject}.veb`;
                logDebug(`Linux VEB extracted from env: ${vebName}`);
              } else {
                // Try to extract from command for Linux tasks
                logDebug(`Task command: ${task.command}`);
                logDebug(`Task options: ${JSON.stringify(task.options)}`);
                logWarn(`Unable to extract VEB name from task configuration`);
              }
            } else {
              logWarn(`Selected task ${selection} not found in tasks.json`);
            }
          } catch (error) {
            logError(`Failed to parse VEB name from tasks.json: ${error}`);
          }
          
          buildStartTimes.set(selection, {
            startTime: Date.now(),
            vebFileName: vebName
          });
          logDebug(`Started tracking time for task: ${selection}, veb file: ${vebName}`);
          logInfo(`VEB File: ${vebName}`);
        }
        await vscode.commands.executeCommand("workbench.action.tasks.runTask", selection);
        logInfo(`Task [${selection}] started successfully`);
        vscode.window.showInformationMessage(`Task [${selection}] has been started successfully!`);
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
            logDebug(`Found task: ${task ? 'yes' : 'no'}, task name: ${taskName}`);

            if (task) {
              if (task.command && task.command.includes('SET VEB=')) {
                // Windows: extract VEB from command
                const vebMatch = task.command.match(/SET VEB=(\w+)/);
                const currentProject = vebMatch ? vebMatch[1] : 'Unknown';
                vebName = `${currentProject}.veb`;
                logDebug(`Windows VEB extracted: ${vebName}`);
              } else if (task.options && task.options.env && task.options.env.VEB) {
                // Linux: get VEB from environment variable
                const currentProject = task.options.env.VEB;
                vebName = `${currentProject}.veb`;
                logDebug(`Linux VEB extracted from env: ${vebName}`);
              } else {
                // Try to extract from command for Linux tasks
                logDebug(`Task command: ${task.command}`);
                logDebug(`Task options: ${JSON.stringify(task.options)}`);
                logWarn(`Unable to extract VEB name from task configuration`);
              }
            } else {
              logWarn(`Task ${taskName} not found in tasks.json`);
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
  registerCommandWithLog(context, 'vebBuild.buildTool.vebCustomBuild', handleVebCustomBuild);
  registerCommandWithLog(context, 'vebBuild.buildTool.stopTerminal', handleterminateTerminal);

  // Conditionally register Makefile tools if enabled
  const moduleConfig = vscode.workspace.getConfiguration('vebBuild.modules');
  if (moduleConfig.get('enableMakefileTools', true)) {
    registerCommandWithLog(context, 'extension.expandMakefileVars', expandMakefileVars);
  }
  
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
  return checkAndExecuteTask("VebBuildTask", "VebBuildTask fail: initialize the tasks.json by pressing the shortcut key (F8).", true);
}

export async function handleVebReBuild(): Promise<void> {
  return checkAndExecuteTask("VebReBuildTask", "VebReBuildTask fail: initialize the tasks.json by pressing the shortcut key (F8).", true);
}

export async function handleVebCustomBuild(): Promise<void> {
  return checkAndExecuteTask("VebCustomBuildTask", "VebCustomBuildTask fail: initialize the tasks.json by pressing the shortcut key (F8).", true);
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