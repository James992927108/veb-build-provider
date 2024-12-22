// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as util from 'util';
import * as fs from 'fs/promises';
import { Edk2FdfDefinitionProvider, Edk2DscDefinitionProvider, Edk2DecDefinitionProvider, Edk2InfDefinitionProvider, Edk2VfrDefinitionProvider } from './edk2Language';
import { Edk2DscSymbolProvider, Edk2DecSymbolProvider, Edk2FdfSymbolProvider, Edk2InfSymbolProvider} from './edk2Language';
import { Edk2CCompletionItemProvider} from './edk2Language';
import Edk2Formatter from "./edk2Formatter";
import SnippetTools from "./SnippetTools";

// Constants
const EXTENSION_ID = "ieibios.veb-build-provider";
const VSCODE_FOLDER = ".vscode";
const TASKS_JSON = "tasks.json";
const VEB_EXTENSION = '.veb';
const PREPARE_ENV_SCRIPT = 'PrepareEnvScript.bat';
const BUILD_COMMAND_LIST = 'BuildCommandList.ini';

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

const TaskSampleShell = `
        {
            "label": "%s",
            "type": "shell",
            "command": "cmd /V /C \\"%s\\""
        },
`;

const TaskSample = `
        {
            "label": "%s",
            "type": "%s",
            "command": "%s"
        },
`;

// Helper functions
function handleError(error: Error, message: string) {
    console.error(`${message}: ${error.message}`);
    vscode.window.showErrorMessage(`${message}: ${error.message}`);
}

function escapePath(filePath: string): string {
    return filePath.replace(/\\/g, '\\\\');
}

async function readFile(filePath: string): Promise<string> {
    try {
        return await fs.readFile(filePath, 'utf8');
    } catch (error) {
        handleError(error as Error, `Error reading file: ${filePath}`);
        return '';
    }
}

async function writeFile(filePath: string, content: string): Promise<void> {
    try {
        await fs.writeFile(filePath, content, 'utf8');
    } catch (error) {
        handleError(error as Error, `Error writing file: ${filePath}`);
    }
}

async function copyFile(source: string, target: string): Promise<void> {
    try {
        await fs.access(target);
        console.log(`${target} already exists`);
    } catch {
        try {
            await fs.copyFile(source, target);
            console.log(`Copied ${source} to ${target} successfully`);
        } catch (error) {
            handleError(error as Error, `Error copying file`);
        }
    }
}

function extractCommand(data: string, startTag: string, endTag: string): string {
    const command = data.slice(data.indexOf(startTag), data.indexOf(endTag)).split('"')[1];
    return escapePath(command);
}

async function BuildDefaultTask(folderpath: string, selection: string, TaskfileUpdate: string): Promise<string> {
    console.log("BuildDefaultTask Start");

    const vebExtension = vscode.extensions.getExtension(EXTENSION_ID);
    if (!vebExtension) {
        throw new Error("Failed to get VEB build provider extension");
    }

    const teePath = escapePath(path.join(vebExtension.extensionPath, "Tool", "tee.exe"));
    const sourceScriptPath = path.join(vebExtension.extensionPath, "Tool", PREPARE_ENV_SCRIPT);
    const targetScriptPath = escapePath(path.join(folderpath, VSCODE_FOLDER, PREPARE_ENV_SCRIPT));

    await copyFile(sourceScriptPath, targetScriptPath);

    const fileData = await readFile(path.join(folderpath, selection));

    const buildCommand = extractCommand(fileData, 'Build', 'BuildAll');
    const reBuildCommand = extractCommand(fileData, 'BuildAll', 'BuildLog');

    const Veb = selection.split('.')[0];

    return util.format(Taskfile,
        Veb, targetScriptPath, buildCommand, teePath,
        Veb, targetScriptPath, reBuildCommand, teePath
    );
}

async function AmendTaskByFile(folderpath: string, TaskfileUpdate: string, project: string): Promise<string> {
    console.log("AmendTaskByFile Start");

    const vebExtension = vscode.extensions.getExtension(EXTENSION_ID);
    if (!vebExtension) {
        throw new Error("Failed to get VEB build provider extension");
    }

    const sourceScriptPath = path.join(vebExtension.extensionPath, "Tool", BUILD_COMMAND_LIST);
    const targetScriptPath = path.join(folderpath, VSCODE_FOLDER, BUILD_COMMAND_LIST);

    await copyFile(sourceScriptPath, targetScriptPath);

    const fileData = await readFile(targetScriptPath);
    const lines = fileData.split(/\r?\n/);

    for (const line of lines) {
        const processedLine = line.replace(new RegExp("%project", "ig"), project.split('.')[0]);
        console.log(processedLine);

        const [commandType, ...rest] = processedLine.split(/:/);
        const trimmedCommandType = commandType.trim();

        if (trimmedCommandType === "shell") {
            TaskfileUpdate += util.format(TaskSampleShell, rest[0].trim(), rest[1]);
        } else {
            TaskfileUpdate += util.format(TaskSample, rest[0].trim(), trimmedCommandType, rest[1]);
        }
    }

    return TaskfileUpdate;
}

async function createVscodeFolder(folderpath: string): Promise<void> {
    const vscodePath = path.join(folderpath, VSCODE_FOLDER);
    try {
        await fs.mkdir(vscodePath, { recursive: true });
        console.log(".vscode folder created successfully.");
    } catch (error) {
        handleError(error as Error, "Failed to create .vscode folder");
    }
}

async function writeTasksJson(folderpath: string, TaskfileUpdate: string): Promise<void> {
    try {
        await writeFile(path.join(folderpath, VSCODE_FOLDER, TASKS_JSON), TaskfileUpdate);
        vscode.window.showInformationMessage("Create tasks.json Success.");
    } catch (error) {
        handleError(error as Error, "Failed to write tasks.json");
    }
}

async function CreateBuildtask(folderpath: string, targetFiles: string[], start: number, end: number, showType: ShowType): Promise<void> {
    console.log("CreateBuildtask Start");
    console.log('Show Veb array from (%d) to (%d)', start, end);
    
    if (showType === ShowType.QuickPick) {
        const selection = await vscode.window.showQuickPick([...targetFiles.slice(start, end)], { placeHolder: 'Start Build for ?' });
        if (!selection) {
            return;
        }

        let TaskfileUpdate = await BuildDefaultTask(folderpath, selection, '');
        TaskfileUpdate = await AmendTaskByFile(folderpath, TaskfileUpdate, selection);
        TaskfileUpdate += "\t]\n}";

        await createVscodeFolder(folderpath);
        await writeTasksJson(folderpath, TaskfileUpdate);
    } else {
        vscode.window.showInformationMessage('!!! Not support yet !!!');
    }
}

function getFolderPath(): string {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) { return ""; }

    const uri = workspaceFolder.uri.toString();
    const [, path] = uri.split(":///");
    const [drive, rest] = path?.split("%3A") ?? [];

    return rest ? `${drive}:${rest}` : "";
}

async function handleInitTask(): Promise<void> {
    const folderpath = getFolderPath();
    if (!folderpath) {
        vscode.window.showErrorMessage("No workspace folder found");
        return;
    }

    try {
        const files = await fs.readdir(folderpath);
        const targetFiles = files.filter(file => path.extname(file).toLowerCase() === VEB_EXTENSION);
        console.log('targetFiles.length = %d', targetFiles.length);

        await CreateBuildtask(folderpath, targetFiles, 0, targetFiles.length, ShowType.QuickPick);
    } catch (error) {
        handleError(error as Error, "Can't search .veb file");
    }
}

async function checkAndExecuteTask(taskName: string, errorMessage: string): Promise<void> {
    const folderpath = getFolderPath();
    if (!folderpath) {
        vscode.window.showErrorMessage("Error folder is Empty");
        return;
    }

    const tasksJsonPath = path.join(folderpath, VSCODE_FOLDER, TASKS_JSON);
    
    try {
        await fs.access(tasksJsonPath);
        console.log(taskName);

        if (taskName === "VebBuildTask") {
            const tasksJson = await readFile(tasksJsonPath);
            const commandList = tasksJson.split(/\r?\n/)
                .filter(line => line.includes("label"))
                .map(line => line.split(/"/)[3]);

            console.log(commandList);

            const selection = await vscode.window.showQuickPick(commandList, { placeHolder: 'select command from command list' });
            if (selection) {
                await vscode.commands.executeCommand("workbench.action.tasks.runTask", selection);
            }
        } else {
            try {
                await vscode.commands.executeCommand("workbench.action.tasks.runTask", taskName);
                vscode.window.showInformationMessage(`Task [${taskName}] has been started successfully!`);
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to start task [${taskName}]: ${error}`);
            }
        }
    } catch (error) {
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
    // 註冊命令：終止當前活動終端窗口
    const activeTerminal = vscode.window.activeTerminal;

    if (activeTerminal) {
        // 模擬向終端發送 Ctrl+C 的中斷信號
        activeTerminal.sendText("\x03"); // \x03 是 Ctrl+C 的 ASCII 控制碼
        vscode.window.showInformationMessage("Sent Ctrl+C to the active terminal.");
    } else {
        vscode.window.showWarningMessage("No active terminal to send Ctrl+C.");
    }
}

function registerCommand(context: vscode.ExtensionContext, commandName: string, callback: (...args: any[]) => any): void {
    const disposable = vscode.commands.registerCommand(commandName, callback);
    context.subscriptions.push(disposable);
}

export function activate(context: vscode.ExtensionContext): void {
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

    vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'c'   }, new Edk2CCompletionItemProvider());
    vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'cpp' }, new Edk2CCompletionItemProvider());
    // Register commands
    registerCommand(context, 'extension.InitTask', handleInitTask);
    registerCommand(context, 'extension.VebBuild', handleVebBuild);
    registerCommand(context, 'extension.VebReBuild', handleVebReBuild);
    registerCommand(context, 'extension.terminateTerminal', handleterminateTerminal);

    // 創建狀態欄按鈕
    const runRebuildButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    runRebuildButton.command = 'extension.VebReBuild'; // 按鈕點擊時觸發的命令
    runRebuildButton.text = '$(play) Run Veb ReBuild'; // 顯示按鈕的圖示與文字
    runRebuildButton.tooltip = 'Click to run Veb ReBuild'; // 滑鼠懸停時顯示的提示文字
    runRebuildButton.show(); // 顯示按鈕

    // 註冊到 context，這樣按鈕和命令都會在擴展卸載時正確清除
    context.subscriptions.push(runRebuildButton);

    // 創建狀態欄按鈕：關閉終端
    const closeTerminalButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99); // 使用較低的優先權，顯示在右側
    closeTerminalButton.text = "$(stop) Close Terminal"; // 使用 "stop" 圖示
    closeTerminalButton.tooltip = "Terminate the active terminal"; // 滑鼠懸停提示文字
    closeTerminalButton.command = "extension.terminateTerminal"; // 綁定命令
    closeTerminalButton.show(); // 顯示按鈕

    // 將按鈕與命令添加到 context
    context.subscriptions.push(closeTerminalButton);
    
    registerCommand(context, 'formatter.Edk2Formatter', Edk2Formatter);
    registerCommand(context, 'SnippetTools.DebugToAsusPrint', () => new SnippetTools(vscode).DebugToAsusPrint());
    registerCommand(context, 'SnippetTools.AsusPrintToDebug', () => new SnippetTools(vscode).AsusPrintToDebug());
}

export function deactivate(): void {}
