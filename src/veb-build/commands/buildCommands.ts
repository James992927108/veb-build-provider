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
import { setBuildState } from '../../shared/ui/statusBar';
import { isModuleFeatureEnabled } from '../../shared/utils/moduleConfig';
import { extractVebNameFromJson } from '../../shared/utils/taskConfig';
import {
  CONTAINER_VEB_ROOT,
  DiscoveredEnv,
  DockerMode,
  DockerSettings,
  deriveVebRoot,
  renderEnvScript,
  shouldUseDocker,
  toContainerEnv,
} from '../core/dockerConfig';

// Constants & Enums

const VSCODE_FOLDER = ".vscode";
const TASKS_JSON = "tasks.json";
const VEB_EXTENSION = '.veb';
const PREPARE_ENV_WIN_SCRIPT = 'PrepareEnvScript.bat';
const PREPARE_ENV_LINUX_SCRIPT = 'PrepareEnvLinuxScript.sh';
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


export function getFormattedTimestamp(): string {
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
      setBuildState(false);

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

    // Flip the status-bar to a "building" state for a tracked build task
    const buildInfo = buildStartTimes.get(taskName);
    if (buildInfo) {
      const project = buildInfo.vebFileName.replace(/\.veb$/i, '');
      setBuildState(true, project);
    }
  });

  // Reliably reset the status bar once the build process actually terminates
  // (onDidEndTaskProcess fires per process end; needed for shell/terminal tasks).
  const taskProcessEndListener = vscode.tasks.onDidEndTaskProcess((e) => {
    const taskName = e.execution.task.name;
    const buildInfo = buildStartTimes.get(taskName);
    if (buildInfo) {
      setBuildState(false);
    }
  });

  context.subscriptions.push(taskEndListener, taskStartListener, taskProcessEndListener);
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

/**
 * Extract the value of a quoted `key = "value"` entry from a .veb file.
 * Pure helper, hoisted to module scope for reuse and testability.
 */
export function extractValue(data: string, key: string): string {
  const match = data.match(new RegExp(`^\\s*${key} = \"(.*?)\"`, 'm'));
  return match ? match[1] : "";
}

/** Build the Windows tasks.json body from objects instead of %s templates (OPT-12). */
export function buildWindowsTasksJson(
  veb: string,
  prepareScript: string,
  buildCommand: string,
  rebuildCommand: string,
  cleanCommand: string,
  teePath: string,
  logFile: string,
  version: string
): string {
  const buildCmd = (body: string) =>
    `cmd /V /C "SET VEB=${veb}&&echo veb = !VEB! &&${body} 2>&1| ${teePath} ${logFile}"`;
  const shellTask = (label: string, command: string) => ({
    label,
    type: 'shell',
    command,
    options: { shell: { executable: 'cmd.exe', args: ['/c'] } },
  });
  const tasks = [
    shellTask('VebBuildTask', buildCmd(`${prepareScript} && ${buildCommand}`)),
    shellTask('VebReBuildTask', buildCmd(`${prepareScript} && ${rebuildCommand}`)),
    shellTask('VebCleanTask', buildCmd(`${prepareScript} && ${cleanCommand}`)),
  ];
  return JSON.stringify({ version: '2.0.0', vebBuildProviderVersion: version, tasks }, null, 2);
}

/**
 * 產生 tasks.json 時要嵌入的 docker 設定。undefined 代表走宿主 build。
 * 這些值會寫進 tasks.json 的 options.env，由 .vscode/DockerBuild.sh 讀取，
 * 所以 DockerBuild.sh 可以是隨 extension 出貨的靜態檔，不必每個專案各產一份。
 */
export interface DockerTaskConfig {
  image: string;
  /** 宿主 VEB 根目錄，同時是 docker build 的 context。 */
  hostVebRoot: string;
  autoBuildImage: boolean;
  /** docker 不可用時是否回落到宿主 build（mode=auto 為 true）。 */
  allowFallback: boolean;
}

/** Build the Linux tasks.json body from objects instead of %s templates (OPT-12). */
export function buildLinuxTasksJson(veb: string, version: string, docker?: DockerTaskConfig): string {
  // docker 模式下 make 的參數交給 DockerBuild.sh，由它決定在容器內怎麼跑（含 log/tee）。
  // 宿主模式維持原本的行為，不受影響。
  const cmd = docker
    ? (action: string) => {
        const makeArgs = action.replace(/^make\s*/, '');
        return `chmod +x \${workspaceFolder}/.vscode/DockerBuild.sh && \${workspaceFolder}/.vscode/DockerBuild.sh ${makeArgs}`.trimEnd();
      }
    : (action: string) =>
        `bash -c 'source \${workspaceFolder}/.vscode/PrepareEnvLinuxScript.sh && ${action} 2>&1 | tee \${workspaceFolder}/Build-$VEB-$(date +%Y%m%d-%H%M%S).log'`;

  const env: Record<string, string> = docker
    ? {
        VEB: veb,
        VEB_DOCKER_IMAGE: docker.image,
        VEB_HOST_VEB_ROOT: docker.hostVebRoot,
        VEB_DOCKER_AUTOBUILD: docker.autoBuildImage ? '1' : '0',
        VEB_DOCKER_FALLBACK: docker.allowFallback ? '1' : '0',
      }
    : { VEB: veb };
  const tasks = [
    { label: 'VebBuildTask', type: 'shell', command: cmd('make'), options: { env }, group: 'build' },
    { label: 'VebReBuildTask', type: 'shell', command: cmd('make rebuild'), options: { env }, group: 'build' },
    { label: 'VebCleanTask', type: 'shell', command: cmd('make clean'), options: { env } },
    {
      label: 'VebReleaseBuildTask',
      type: 'shell',
      command: `chmod +x \${workspaceFolder}/GB300_Release_Build.sh && bash -c 'source \${workspaceFolder}/.vscode/PrepareEnvLinuxScript.sh && \${workspaceFolder}/GB300_Release_Build.sh $VEB'`,
      options: { env },
    },
    {
      label: 'VebCustomBuildTask',
      type: 'shell',
      command: `chmod +x \${workspaceFolder}/.vscode/CustomBuild.sh && bash -c 'source \${workspaceFolder}/.vscode/PrepareEnvLinuxScript.sh && \${workspaceFolder}/.vscode/CustomBuild.sh'`,
      options: { env },
    },
  ];
  return JSON.stringify({ version: '2.0.0', vebBuildProviderVersion: version, tasks }, null, 2);
}

// Docker Build Support

const PREPARE_ENV_DOCKER_SCRIPT = 'PrepareEnvDockerScript.sh';
const DOCKER_BUILD_SCRIPT = 'DockerBuild.sh';
/** 放在宿主 VEB 根目錄底下，存 Dockerfile；build context 就是該根目錄。 */
const DOCKER_ASSET_DIR = '.veb-docker';

function readDockerSettings(): DockerSettings {
  const cfg = vscode.workspace.getConfiguration('vebBuild');
  return {
    mode: cfg.get<DockerMode>('docker.mode', 'auto'),
    image: cfg.get<string>('docker.image', 'veb-bios-build:24.04'),
    autoBuildImage: cfg.get<boolean>('docker.autoBuildImage', true),
  };
}

/** docker CLI 是否可用且 daemon 有回應。任何錯誤都視為不可用。 */
async function probeDocker(): Promise<boolean> {
  try {
    const { execFile } = require('child_process');
    const execFilePromise = util.promisify(execFile);
    await execFilePromise('docker', ['info', '--format', '{{.ServerVersion}}'], { timeout: 10000 });
    return true;
  } catch (error) {
    logDebug(`Docker probe failed: ${error}`);
    return false;
  }
}

/**
 * 佈署 docker build 需要的檔案並回傳 tasks.json 用的設定。
 * 回傳 undefined 代表這次走宿主 build。
 *
 * 產生的檔案：
 *   <專案>/.vscode/PrepareEnvDockerScript.sh   容器內用的環境（路徑指向 /opt/veb）
 *   <專案>/.vscode/DockerBuild.sh              執行器（隨 extension 出貨的靜態檔）
 *   <VEB根>/.veb-docker/Dockerfile             image 定義
 *   <VEB根>/.dockerignore                      context 排除清單（已存在則不覆寫）
 */
async function prepareDockerBuild(
  folderpath: string,
  envVars: DiscoveredEnv,
  extensionPath: string
): Promise<DockerTaskConfig | undefined> {
  const settings = readDockerSettings();
  if (settings.mode === 'never') {
    logDebug('Docker mode = never; using host build.');
    return undefined;
  }

  const hostVebRoot = deriveVebRoot(envVars.TOOLS_DIR);
  const dockerAvailable = await probeDocker();
  const use = shouldUseDocker(settings, {
    dockerAvailable,
    vebRootResolved: hostVebRoot !== undefined,
  });

  if (!use) {
    // mode=auto 且條件不足：安靜回落，不打擾使用者。
    logInfo(
      `Docker build not used (mode=${settings.mode}, dockerAvailable=${dockerAvailable}, ` +
      `vebRoot=${hostVebRoot ?? 'unresolved'}); falling back to host build.`
    );
    return undefined;
  }

  if (!hostVebRoot) {
    // mode=always 但推不出 VEB 根：仍產生設定，讓 DockerBuild.sh 報出明確錯誤，
    // 而不是在這裡靜靜地變成宿主 build（那會違背 always 的語意）。
    logWarn(`Docker mode = always but VEB root could not be derived from TOOLS_DIR=${envVars.TOOLS_DIR}`);
  }

  try {
    // 1) 容器內的環境腳本：把宿主 VEB 根前綴換成 image 內的固定路徑
    const containerEnv = hostVebRoot ? toContainerEnv(envVars, hostVebRoot) : envVars;
    const dockerEnvPath = path.join(folderpath, VSCODE_FOLDER, PREPARE_ENV_DOCKER_SCRIPT);
    await writeFile(dockerEnvPath, renderEnvScript(containerEnv).replace(/\r\n?/g, '\n'));
    logDebug(`Created container env script at ${dockerEnvPath} (VEB root -> ${CONTAINER_VEB_ROOT})`);

    // 2) 執行器
    const srcRunner = path.join(extensionPath, 'tools', 'scripts', 'docker_build.sh');
    const dstRunner = path.join(folderpath, VSCODE_FOLDER, DOCKER_BUILD_SCRIPT);
    await copyFile(srcRunner, dstRunner);
    await fs.chmod(dstRunner, 0o755).catch(() => { /* 權限失敗不致命，task 會再 chmod +x */ });

    // 3) Dockerfile 與 .dockerignore 放到 VEB 根（= build context）
    if (hostVebRoot) {
      const assetDir = path.join(hostVebRoot, DOCKER_ASSET_DIR);
      await fs.mkdir(assetDir, { recursive: true });
      await copyFile(path.join(extensionPath, 'tools', 'docker', 'Dockerfile'), path.join(assetDir, 'Dockerfile'));

      // .dockerignore 已存在就不覆寫 —— 使用者可能有自己的調整。
      const ignorePath = path.join(hostVebRoot, '.dockerignore');
      const ignoreExists = await fs.access(ignorePath).then(() => true).catch(() => false);
      if (!ignoreExists) {
        await copyFile(path.join(extensionPath, 'tools', 'docker', 'dockerignore.template'), ignorePath);
        logDebug(`Created ${ignorePath}`);
      } else {
        logDebug(`${ignorePath} already exists; left untouched.`);
      }
    }
  } catch (error) {
    logWarn(`Failed to prepare docker build assets: ${error}`);
    if (settings.mode === 'auto') {
      logWarn('Falling back to host build.');
      return undefined;
    }
  }

  logInfo(`Docker build enabled (image=${settings.image}, context=${hostVebRoot ?? 'unresolved'})`);
  return {
    image: settings.image,
    hostVebRoot: hostVebRoot ?? '',
    autoBuildImage: settings.autoBuildImage,
    allowFallback: settings.mode === 'auto',
  };
}

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

    const buildCommand = extractValue(fileData, 'Build');
    const reBuildCommand = extractValue(fileData, 'BuildAll');
    const cleanCommand = extractValue(fileData, 'CleanCmd');
    if (!buildCommand) {
      logWarn(`Build command is empty in ${selection}; check the 'Build' entry in the .veb file`);
    }
    const Veb = selection.split('.')[0];
    const logFile = `Build-${Veb}-${getFormattedTimestamp()}.log`;

    result = buildWindowsTasksJson(
      Veb, targetScriptPath, buildCommand, reBuildCommand, cleanCommand,
      teePath, logFile, PROJECT_CONFIG.VERSION
    );
  } else if (targetEnvironment === 'linux') {
    // Linux/WSL handling
    const Veb = selection.split('.')[0];
    let dockerTaskConfig: DockerTaskConfig | undefined;
    // Create PrepareEnvLinuxScript.sh dynamically for Linux/WSL
    const targetLinuxScriptPath = path.join(folderpath, VSCODE_FOLDER, PREPARE_ENV_LINUX_SCRIPT);
    
    // Discover environment using python script
    let envVars = {
      TOOLS_DIR: "/home/sut/Desktop/VEB/Linux_x64_Aptio_5.x_TOOLS_59/Tools",
      TOOLS_VERSION: 59,
      TOOLS_SOURCE: "fallback",
      PROFILE: "vr",
      AARCH64_TOOLS_DIR: "/home/sut/Desktop/VEB/toolchains/arm-gnu-toolchain-12.3.rel1-x86_64-aarch64-none-linux-gnu/bin",
      AARCH64_TOOL_PREFIX: "aarch64-none-linux-gnu-",
      JAVA_HOME: "/usr/lib/jvm/java-8-openjdk-amd64"
    };

    try {
      const pythonScript = path.join(vebExtension.extensionPath, "tools", "scripts", "env_discovery.py");
      const { execFile } = require('child_process');
      const execFilePromise = util.promisify(execFile);
      logDebug(`Running environment discovery for ${selection} in ${folderpath}`);
      const { stdout } = await execFilePromise('python3', [
        pythonScript,
        '--json',
        '--workspace', folderpath,
        '--veb', selection
      ]);
      envVars = JSON.parse(stdout);
      logDebug(`Environment discovered: ${JSON.stringify(envVars)}`);
    } catch (error) {
      logWarn(`Failed to run environment discovery script, using defaults: ${error}`);
    }

    const linuxScriptContent = renderEnvScript(envVars);

    try {
      // Write file with LF line endings (normalize line endings)
      const contentWithLF = linuxScriptContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      await writeFile(targetLinuxScriptPath, contentWithLF);
      logDebug(`Created Linux prepare script for Linux/WSL at ${targetLinuxScriptPath}`);

      logDebug('Linux prepare script created (permissions will be handled by task execution)');
    } catch (error) {
      logWarn(`Failed to create Linux prepare script: ${error}`);
    }

    // Docker 模式準備。即使最後決定走宿主，也不會有副作用 —— 只是不產生這些檔案。
    dockerTaskConfig = await prepareDockerBuild(folderpath, envVars, vebExtension.extensionPath);


    // Create CustomBuild.sh — auto-configure if GB300_Release_Build.sh exists
    const customBuildScriptPath = path.join(folderpath, VSCODE_FOLDER, CUSTOM_BUILD_SCRIPT);
    const releaseBuildScriptPath = path.join(folderpath, 'GB300_Release_Build.sh');
    const hasReleaseBuild = await fs.access(releaseBuildScriptPath).then(() => true).catch(() => false);
    logDebug(`[CustomBuild] GB300_Release_Build.sh detected: ${hasReleaseBuild}`);

    const customBuildContent = hasReleaseBuild
      ? `#!/bin/bash
# VEB Build Provider - Custom Build Script
# Auto-configured: GB300_Release_Build.sh detected in project root
#
# VEB is injected by VebCustomBuildTask via tasks.json options.env.VEB (currently: ${Veb})
# To build a different VEB, run F8 and select another .veb file

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
chmod +x "$PROJECT_ROOT/GB300_Release_Build.sh"
"$PROJECT_ROOT/GB300_Release_Build.sh" "$VEB"
`
      : `#!/bin/bash
# VEB Build Provider - Custom Build Script
# Auto-generated by VEB Build Provider
#
# This script is called by VebCustomBuildTask
# Environment variables available:
#   VEB           - Current VEB project name (currently: ${Veb})
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
      logDebug(`[CustomBuild] Written to ${customBuildScriptPath} (release-build mode: ${hasReleaseBuild})`);
    } catch (error) {
      logWarn(`Failed to create CustomBuild.sh: ${error}`);
    }

    // No wrapper scripts needed - tasks will call commands directly

    result = buildLinuxTasksJson(Veb, PROJECT_CONFIG.VERSION, dockerTaskConfig);
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
          // Reuse the tasksJson already read above; extract the VEB file name (OPT-4/17)
          const vebName = extractVebNameFromJson(tasksJson, selection);
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
          const vebName = extractVebNameFromJson(await readFile(tasksJsonPath), taskName);
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

// Docker Command Handlers

/**
 * 從已產生的 PrepareEnvLinuxScript.sh 讀回 TOOLS_DIR。
 * 比重跑一次 env_discovery 便宜，且保證與目前 tasks.json 用的是同一份環境。
 */
export function parseToolsDirFromEnvScript(scriptContent: string): string | undefined {
  const m = scriptContent.match(/^export TOOLS_DIR="([^"]+)"/m);
  return m ? m[1] : undefined;
}

/** 兩個 docker 命令共用：定位 VEB 根目錄，找不到就提示先跑 init task。 */
async function resolveHostVebRoot(): Promise<string | undefined> {
  const folderPath = getFolderPath();
  if (!folderPath) { return undefined; }
  const scriptPath = path.join(folderPath, VSCODE_FOLDER, PREPARE_ENV_LINUX_SCRIPT);
  try {
    const content = await readFile(scriptPath);
    const toolsDir = parseToolsDirFromEnvScript(content);
    if (!toolsDir) {
      vscode.window.showErrorMessage(`Could not read TOOLS_DIR from ${PREPARE_ENV_LINUX_SCRIPT}.`);
      return undefined;
    }
    const root = deriveVebRoot(toolsDir);
    if (!root) {
      vscode.window.showErrorMessage(`Could not derive the VEB root from TOOLS_DIR=${toolsDir}.`);
      return undefined;
    }
    return root;
  } catch (error) {
    vscode.window.showErrorMessage(
      `Could not read ${PREPARE_ENV_LINUX_SCRIPT}. Run the VEB init task (F8) first. (${error})`
    );
    return undefined;
  }
}

/** 在終端機建置 image。放終端機而非背景，是因為這一步要好幾分鐘且使用者需要看到進度。 */
export async function handleDockerBuildImage(): Promise<void> {
  const root = await resolveHostVebRoot();
  if (!root) { return; }
  const settings = readDockerSettings();
  const dockerfile = path.join(root, DOCKER_ASSET_DIR, 'Dockerfile');

  const terminal = vscode.window.createTerminal({ name: 'VEB Docker Image' });
  terminal.show();
  terminal.sendText(`echo "Building ${settings.image} (context: ${root})"`);
  terminal.sendText('echo "This image contains NDA-licensed AMI BuildTools - do NOT push it."');
  terminal.sendText(`docker build -f "${dockerfile}" -t "${settings.image}" "${root}"`);
  logInfo(`Docker image build started: ${settings.image} (context ${root})`);
}

/** 檢查容器內環境是否完整 —— 對應 build 曾經踩過的那幾個坑。 */
export async function handleDockerDoctor(): Promise<void> {
  const settings = readDockerSettings();
  const terminal = vscode.window.createTerminal({ name: 'VEB Docker Doctor' });
  terminal.show();
  const script = [
    'set -u',
    'echo "=== OS ==="; . /etc/os-release; echo "$PRETTY_NAME"',
    'echo "=== required binaries ==="',
    'for f in /usr/bin/cpp /usr/bin/dtc /usr/bin/gawk /usr/bin/7z /usr/bin/make /usr/bin/python3; do',
    '  [ -x "$f" ] && echo "  OK  $f" || echo "  MISSING  $f"; done',
    'echo "=== python modules ==="',
    'for m in yaml requests; do python3 -c "import $m" 2>/dev/null && echo "  OK  $m" || echo "  MISSING  $m"; done',
    'echo "=== java ==="',
    'for j in /usr/lib/jvm/java-8-openjdk-amd64 /usr/lib/jvm/java-21-openjdk-amd64; do',
    '  [ -x "$j/bin/java" ] && echo "  OK  $j" || echo "  MISSING  $j"; done',
    'echo "=== AMI tools ==="',
    'for t in /opt/veb/Linux_x64_Aptio_5.x_TOOLS_*/Tools; do',
    '  [ -f "$t/BuildToolsVersion.mak" ] && echo "  OK  $t" || echo "  MISSING  $t"; done',
    'echo "=== cross toolchain ==="',
    'ls /opt/veb/toolchains/*/bin/aarch64-none-linux-gnu-gcc 2>/dev/null | head -1 | xargs -r -I{} sh -c \'{} --version | head -1\'',
  ].join('; ');
  terminal.sendText(`docker run --rm "${settings.image}" bash -c '${script.replace(/'/g, `'"'"'`)}'`);
  logInfo(`Docker doctor started for image ${settings.image}`);
}

// Command Registration

export function registerVebBuildCommands(context: vscode.ExtensionContext): void {
  registerCommandWithLog(context, 'vebBuild.buildTool.initTask', handleInitTask);
  registerCommandWithLog(context, 'vebBuild.buildTool.vebBuild', handleVebBuild);
  registerCommandWithLog(context, 'vebBuild.buildTool.vebReBuild', handleVebReBuild);
  registerCommandWithLog(context, 'vebBuild.buildTool.vebCustomBuild', handleVebCustomBuild);
  registerCommandWithLog(context, 'vebBuild.buildTool.stopTerminal', handleterminateTerminal);
  registerCommandWithLog(context, 'vebBuild.buildTool.dockerBuildImage', handleDockerBuildImage);
  registerCommandWithLog(context, 'vebBuild.buildTool.dockerDoctor', handleDockerDoctor);

  // Level-2 build feature switch: Makefile variable expansion tools
  if (isModuleFeatureEnabled('build', 'enableMakefileTools')) {
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
