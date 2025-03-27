// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as util from 'util';
import * as fs from 'fs/promises';
import { Edk2FdfDefinitionProvider, Edk2DscDefinitionProvider, Edk2DecDefinitionProvider, Edk2InfDefinitionProvider, Edk2VfrDefinitionProvider } from './edk2Language';
import { Edk2DscSymbolProvider, Edk2DecSymbolProvider, Edk2FdfSymbolProvider, Edk2InfSymbolProvider} from './edk2Language';
import { Edk2CCompletionItemProvider as Edk2CCompletionProvider} from './edk2Language';
import Edk2Formatter from "./edk2Formatter/edk2Formatter";
import SnippetTools from "./SnippetTools";
import { logMessage, handleError, outputChannel } from './logger';
import { spawn } from 'child_process';

// Constants
const EXTENSION_ID = "ieibios.veb-build-provider";
const VSCODE_FOLDER = ".vscode";
const TASKS_JSON = "tasks.json";
const VEB_EXTENSION = '.veb';
const PREPARE_ENV_SCRIPT = 'PrepareEnvScript.bat';

// Enums
enum ShowType {
    InformationMessage = 0,
    QuickPick = 1,
}

// Task file templates
const Taskfile = `{
    "version": "1.0.0",
    "tasks": 
    [
        {
            "label": "------------------------------------Internal command------------------------------------------",
            "type": "shell",
            "command": ""
        },
        {
            "label": "VebBuildTask",
            "type": "shell",
            "command": "cmd /V /C \\"SET VEB=%s&&echo veb = !VEB! &&%s && %s 2>&1| %s Build.log\\""
        },
        {
            "label": "VebReBuildTask",
            "type": "shell",
            "command": "cmd /V /C \\"SET VEB=%s&&echo veb = !VEB! &&%s && %s 2>&1| %s Build.log\\""
        },
        {
            "label": "------------------------------------External command------------------------------------------",
            "type": "shell",
            "command": ""
        },
`;

// 處理擴展 Makefile 變數的函數
async function expandMakefileVars(): Promise<void> {
    // 獲取當前活動的編輯器
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage("No active editor found.");
        logMessage("No active editor found.");
        return;
    }

    const filePath = editor.document.uri.fsPath; // 例如 "build\token.mak"
    const fileDir = path.dirname(filePath); // 提取目錄 "build"

    logMessage(`Starting expandMakefileVars for file: ${filePath}`);

    const vebExtension = vscode.extensions.getExtension(EXTENSION_ID);
    if (!vebExtension) {
        vscode.window.showErrorMessage("Unable to get VEB build provider extension");
        return;
    }
    const pythonScriptPath = path.join(vebExtension.extensionPath, "scripts", "ExpandMakefileVars.py");

    try {
        await fs.access(pythonScriptPath);
    } catch {
        vscode.window.showErrorMessage(`Python script not found at: ${pythonScriptPath}`);
        logMessage(`Python script not found at: ${pythonScriptPath}`);
        return;
    }

    const pythonProcess = spawn('python', [pythonScriptPath, filePath], { cwd: fileDir });

    let stdoutData = '';
    let stderrData = '';

    pythonProcess.stdout.on('data', (data) => {
        stdoutData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            logMessage(`Successfully processed ${filePath}: ${stdoutData}`);
            vscode.window.showInformationMessage(`Expanded Makefile variables for ${path.basename(filePath)}`);
        } else {
            logMessage(`Error processing ${filePath}: ${stderrData}`);
            vscode.window.showErrorMessage(`Failed to expand Makefile variables: ${stderrData}`);
        }
    });
}

function escapePath(filePath: string): string {
    return filePath.replace(/\\/g, '\\\\');
}

async function readFile(filePath: string): Promise<string> {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        logMessage(`Successfully read file: ${filePath}`);
        return content;
    } catch (error) {
        handleError(error as Error, `Failed to read file: ${filePath}`);
        return '';
    }
}

async function writeFile(filePath: string, content: string): Promise<void> {
    try {
        await fs.writeFile(filePath, content, 'utf8');
        logMessage(`Successfully wrote to file: ${filePath}`);
    } catch (error) {
        handleError(error as Error, `Failed to write to file: ${filePath}`);
    }
}

async function copyFile(source: string, target: string): Promise<void> {
    try {
        await fs.access(target);
        logMessage(`${target} already exists`);
    } catch {
        try {
            await fs.copyFile(source, target);
            logMessage(`Copied ${source} to ${target} successfully`);
        } catch (error) {
            handleError(error as Error, `Failed to copy file`);
        }
    }
}

function extractCommand(data: string, startTag: string, endTag: string): string {
    const command = data.slice(data.indexOf(startTag), data.indexOf(endTag)).split('"')[1];
    logMessage(`Extracted command: ${command}`);
    return escapePath(command);
}

async function BuildDefaultTask(folderpath: string, selection: string, TaskfileUpdate: string): Promise<string> {
    logMessage("BuildDefaultTask Start");

    const vebExtension = vscode.extensions.getExtension(EXTENSION_ID);
    if (!vebExtension) {
        throw new Error("Unable to get VEB build provider extension");
    }

    const teePath = escapePath(path.join(vebExtension.extensionPath, "Tool", "tee.exe"));
    const sourceScriptPath = path.join(vebExtension.extensionPath, "Tool", PREPARE_ENV_SCRIPT);
    const targetScriptPath = escapePath(path.join(folderpath, VSCODE_FOLDER, PREPARE_ENV_SCRIPT));

    await copyFile(sourceScriptPath, targetScriptPath);

    const fileData = await readFile(path.join(folderpath, selection));

    const buildCommand = extractCommand(fileData, 'Build', 'BuildAll');
    const reBuildCommand = extractCommand(fileData, 'BuildAll', 'BuildLog');

    const Veb = selection.split('.')[0];

    const result = util.format(Taskfile,
        Veb, targetScriptPath, buildCommand, teePath,
        Veb, targetScriptPath, reBuildCommand, teePath
    );
    logMessage("BuildDefaultTask completed");
    return result;
}

async function createVscodeFolder(folderpath: string): Promise<void> {
    const vscodePath = path.join(folderpath, VSCODE_FOLDER);
    try {
        await fs.mkdir(vscodePath, { recursive: true });
        logMessage(".vscode folder created successfully");
    } catch (error) {
        handleError(error as Error, "Failed to create .vscode folder");
    }
}

async function writeTasksJson(folderpath: string, TaskfileUpdate: string): Promise<void> {
    try {
        await writeFile(path.join(folderpath, VSCODE_FOLDER, TASKS_JSON), TaskfileUpdate);
        logMessage("Successfully created tasks.json");
        vscode.window.showInformationMessage("Create tasks.json Success.");
    } catch (error) {
        handleError(error as Error, "Failed to write tasks.json");
    }
}

async function CreateBuildtask(folderpath: string, targetFiles: string[], start: number, end: number, showType: ShowType): Promise<void> {
    logMessage("Starting CreateBuildtask");
    logMessage('Show Veb array from (%d) to (%d)', start, end);
    
    if (showType === ShowType.QuickPick) {
        const selection = await vscode.window.showQuickPick([...targetFiles.slice(start, end)], { placeHolder: 'Start Build for ?' });
        if (!selection) {
            logMessage("No selection made, operation cancelled");
            return;
        }

        let TaskfileUpdate = await BuildDefaultTask(folderpath, selection, '');
        TaskfileUpdate += "\t]\n}";

        await createVscodeFolder(folderpath);
        await writeTasksJson(folderpath, TaskfileUpdate);
    } else {
        logMessage("Unsupported ShowType");
        vscode.window.showInformationMessage('!!! Not support yet !!!');
    }
}

function getFolderPath(): string {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) { return ""; }

    const uri = workspaceFolder.uri.toString();
    const [, path] = uri.split(":///");
    const [drive, rest] = path?.split("%3A") ?? [];

    const folderPath = rest ? `${drive}:${rest}` : "";
    logMessage(`Retrieved workspace path: ${folderPath}`);
    return folderPath;
}

async function handleInitTask(): Promise<void> {
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
        if (error instanceof Error) {
            logMessage(`Error in handleInitTask: ${error.message}`);
        } else {
            logMessage(`Error in handleInitTask: ${String(error)}`);
        }
        handleError(error instanceof Error ? error : new Error(String(error)), "Unable to search for .veb files");
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
            const commandList = tasksJson.split(/\r?\n/)
                .filter(line => line.includes("label"))
                .map(line => line.split(/"/)[3]);

            logMessage(commandList);

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

function handleVebBuild(): Promise<void> {
    return checkAndExecuteTask("VebBuildTask", "VebBuildTask fail: initialize the tasks.json by pressing the shortcut key (F8).");
}

function handleVebReBuild(): Promise<void> {
    return checkAndExecuteTask("VebReBuildTask", "VebReBuildTask fail: initialize the tasks.json by pressing the shortcut key (F8).");
}

function handleterminateTerminal(): void {
    logMessage("Starting handleterminateTerminal");
    const activeTerminal = vscode.window.activeTerminal;

    if (activeTerminal) {
        activeTerminal.sendText("\x03"); // Ctrl+C ASCII code
        logMessage("Sent Ctrl+C to active terminal");
        vscode.window.showInformationMessage("Sent Ctrl+C to the active terminal.");
    } else {
        logMessage("No active terminal to terminate");
        vscode.window.showWarningMessage("No active terminal to send Ctrl+C.");
    }
}

function registerCommand(context: vscode.ExtensionContext, commandName: string, callback: (...args: any[]) => any): void {
    const disposable = vscode.commands.registerCommand(commandName, callback);
    context.subscriptions.push(disposable);
    logMessage(`Registered command: ${commandName}`);
}

export function activate(context: vscode.ExtensionContext): void {
    logMessage(`Extension activated at: ${new Date().toISOString()}`);

    outputChannel.show();
    // Edk2 language provider
    vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'edk2_fdf' }, new Edk2FdfDefinitionProvider());
    vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'edk2_dsc' }, new Edk2DscDefinitionProvider());
    vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'edk2_dec' }, new Edk2DecDefinitionProvider());
    vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'edk2_inf' }, new Edk2InfDefinitionProvider());
    vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'edk2_vfr' }, new Edk2VfrDefinitionProvider());

    vscode.languages.registerDocumentSymbolProvider({ scheme: 'file', language: 'edk2_dsc' }, new Edk2DscSymbolProvider());
    vscode.languages.registerDocumentSymbolProvider({ scheme: 'file', language: 'edk2_dec' }, new Edk2DecSymbolProvider());
    vscode.languages.registerDocumentSymbolProvider({ scheme: 'file', language: 'edk2_fdf' }, new Edk2FdfSymbolProvider());
    vscode.languages.registerDocumentSymbolProvider({ scheme: 'file', language: 'edk2_inf' }, new Edk2InfSymbolProvider());

    vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'c' }, new Edk2CCompletionProvider());
    vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'cpp' }, new Edk2CCompletionProvider());

    // Register commands
    registerCommand(context, 'extension.InitTask', handleInitTask);
    registerCommand(context, 'extension.VebBuild', handleVebBuild);
    registerCommand(context, 'extension.VebReBuild', handleVebReBuild);
    registerCommand(context, 'extension.terminateTerminal', handleterminateTerminal);

    // Create status bar button for ReBuild
    const runRebuildButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    runRebuildButton.command = 'extension.VebReBuild';
    runRebuildButton.text = '$(play) Run Veb ReBuild';
    runRebuildButton.tooltip = 'Click to run Veb ReBuild';
    runRebuildButton.show();
    context.subscriptions.push(runRebuildButton);
    logMessage("Created status bar button: Run Veb ReBuild");

    // Create status bar button for terminating terminal
    const closeTerminalButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99);
    closeTerminalButton.text = "$(stop) Close Terminal";
    closeTerminalButton.tooltip = "Terminate the active terminal";
    closeTerminalButton.command = "extension.terminateTerminal";
    closeTerminalButton.show();
    context.subscriptions.push(closeTerminalButton);
    logMessage("Created status bar button: Close Terminal");

    registerCommand(context, 'formatter.Edk2Formatter', Edk2Formatter);
    registerCommand(context, 'SnippetTools.DebugToAsusPrint', () => new SnippetTools(vscode).DebugToAsusPrint());
    registerCommand(context, 'SnippetTools.AsusPrintToDebug', () => new SnippetTools(vscode).AsusPrintToDebug());
    registerCommand(context, 'extension.expandMakefileVars', () => {expandMakefileVars();});
}

export function deactivate(): void {
    logMessage(`Extension deactivated at: ${new Date().toISOString()}`);
    outputChannel.dispose(); // Clean up output channel
}