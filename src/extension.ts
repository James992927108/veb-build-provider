import * as vscode from 'vscode';
import { MyTreeProvider } from './TreeProvider';
import { Edk2FdfProvider } from './edk2Language';
import { Edk2DscProvider } from './edk2Language';
import { Edk2DecProvider } from './edk2Language';
import { Edk2InfProvider } from './edk2Language';
import { Edk2VfrProvider } from './edk2Language';
import Edk2Formatter from "./edk2Formatter";
import SnippetTools from "./SnippetTools";

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const fs = require('fs');
const path = require('path');
const util = require('util');

enum ShowType {
    InformationMessage = 0,
    QuickPick = 1,
}

let BuildToolFileName = 'BuildCommandList.ini';
// Task file define
const Taskfile = '{\n\
    "version": "1.0.0",\n\
    "tasks": \n\
    [\n\
        {\n\
            "label": "------------------------------------Internal command------------------------------------------",\n\
            "type": "shell",\n\
            "command": ""\n\
        },\n\
        {\n\
            "label": "VebBuildTask",\n\
            "type": "shell",\n\
            "command": "cmd /V /C \\"SET VEB=%s&&echo veb = !VEB! &&%s && %s 2>&1| %s Build.log\\""\n\
        },\n\
        {\n\
            "label": "VebReBuildTask",\n\
            "type": "shell",\n\
            "command": "cmd /V /C \\"SET VEB=%s&&echo veb = !VEB! &&%s && %s 2>&1| %s Build.log\\""\n\
        },\n\
        {\n\
            "label": "------------------------------------External command------------------------------------------",\n\
            "type": "shell",\n\
            "command": ""\n\
        },\n\
        {\n\
            "label": "KillGitProcess",\n\
            "type": "shell",\n\
            "command": "taskkill /F /IM  git.exe",\n\
            "presentation": {\n\
                "reveal": "always"\n\
            },\n\
        },\n\
';

const TaskSampleShell = '\
        {\n\
            "label": "%s",\n\
            "type": "shell",\n\
            "command": "cmd /V /C \\"%s\\""\n\
        },\n\
';
const TaskSample = '\
        {\n\
            "label": "%s",\n\
            "type": "%s",\n\
            "command": "%s"\n\
        },\n\
';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

async function BuildDefaulTask(folderpath: string, selection: string, TaskfileUpdate: unknown) {
    return new Promise(resolve => {
        console.log("BuildDefaulTask Start");
        let fileStream = fs.createReadStream(path.join(folderpath, selection));
        let BuildCommand = [];
        let ReBuildCommand = [];
        const extension = vscode.extensions.getExtension("ieibios.veb-build-provider");
        let teePath = "";
        let sourcePrepareScriptPath = path.join(folderpath, ".vscode", "PrepareEnvScript.bat").replace(/\\/g, '\\\\');
        if (extension !== undefined) {
            teePath = path.join(extension.extensionPath, "Tool", "tee.exe").replace(/\\/g, '\\\\');
        } else {
            console.log("getExtension ieibios.veb-build-provider failed");
        }
        fileStream.on('data', function (chunk) {
            BuildCommand = chunk.toString().slice(chunk.toString().indexOf('Build'), chunk.toString().indexOf('BuildAll')).split('"')[1].replace(/\\/g, '\\\\');
            ReBuildCommand = chunk.toString().slice(chunk.toString().indexOf('BuildAll'), chunk.toString().indexOf('BuildLog')).split('"')[1].replace(/\\/g, '\\\\');
            fileStream.destroy();
        });
        fileStream.on('close', () => {
            TaskfileUpdate = util.format(Taskfile,
                // BuildAllTask
                selection.split('.')[0], // VEB=
                sourcePrepareScriptPath,
                BuildCommand,
                teePath,
                // ReBuildAllTask
                selection.split('.')[0],
                sourcePrepareScriptPath,
                ReBuildCommand,
                teePath,
            );
            // console.log(TaskfileUpdate);
            resolve(TaskfileUpdate);
        });
    });
}

function AmendTaskByFile(folderpath, selection, TaskfileUpdate, project) {
    console.log("AmendTaskByFile Start");
    var array;
    try {
        array = fs.readFileSync(path.join(folderpath, selection)).toString().split(/\r?\n/);
    } catch (err) {
        console.log("AmendTaskByFile -> readFileSync Error");
        return new Promise(resolve => {
            resolve(TaskfileUpdate);
        });
    }
    array.forEach(line => {
        line = line.toString().replace(new RegExp("%project", "ig"), project.split('.')[0]);
        console.log(line);
        if (line.split(/:/)[0].replace(/[ |\t]/g, "") === "shell") {
            // console.log('shell');
            TaskfileUpdate = TaskfileUpdate + util.format(TaskSampleShell, line.split(/:/)[1].replace(/[\t]/g, ""), line.split(/:/)[2]);
        } else {
            // console.log('process');
            TaskfileUpdate = TaskfileUpdate + util.format(TaskSample, line.split(/:/)[1].replace(/[\t]/g, ""), line.split(/:/)[0].replace(/[ |\t]/g, ""), line.split(/:/)[2]);
        }
    });
    return new Promise(resolve => {
        resolve(TaskfileUpdate);
    });
}

function copyPrepareEnvScript(folderpath: string) {
    const vebExtension = vscode.extensions.getExtension("ieibios.veb-build-provider");
    
    if (!vebExtension) {
        console.error("Fail to get ieibios.veb-build-provider");
        return;
    }

    const sourceScriptPath = path.join(vebExtension.extensionPath, "Tool", "PrepareEnvScript.bat");
    const targetFolderPath = path.join(folderpath, ".vscode");
    const targetScriptPath = path.join(targetFolderPath, "PrepareEnvScript.bat");

    try {
        // Create target directory if it doesn't exist
        if (!fs.existsSync(targetFolderPath)) {
            fs.mkdirSync(targetFolderPath, { recursive: true });
        }
        
        // Check if the file already exists at the target location
        if (fs.existsSync(targetScriptPath)) {
            console.log('PrepareEnvScript.bat already exists at ' + targetScriptPath);
        } else {
            fs.copyFileSync(sourceScriptPath, targetScriptPath);
            console.log('Copied PrepareEnvScript.bat to ' + targetScriptPath + ' successfully');
        }
    } catch (error) {
        const err = error as Error;  // Type assertion to Error
        console.error('Error copying PrepareEnvScript.bat: ' + err.message);
    }
}

function CreateBuildtask(folderpath: string, targetFiles: string | any[], start: number, end: number, showType: number) {
    console.log("CreateBuildtask Start");
    console.log('Show Veb array from (%d) to (%d)', start, end);
    if (showType) {
        vscode.window.showQuickPick([...targetFiles.slice(start, end)], { placeHolder: 'Start Build for ?' })
            .then(async selection => {
                // check selection is selected or not.
                if (!selection) {
                    return;
                }
                // make Task content
                let TaskfileUpdate: unknown = [];
                const buildTaskUpdate = await BuildDefaulTask(folderpath, selection, TaskfileUpdate);
                const amendTaskUpdate = await AmendTaskByFile(folderpath, BuildToolFileName, buildTaskUpdate, selection);
                TaskfileUpdate = amendTaskUpdate;
                TaskfileUpdate = TaskfileUpdate + "\t]\n}";
                // Create Task file
                fs.exists(path.join(folderpath, ".vscode"), exists => {
                    if (!exists) {
                        console.log(".vscode not exists and create it.");
                        fs.mkdir(path.join(folderpath, ".vscode"), err => {
                            if (err) {
                                console.log("makdir .vscode fail.");
                                return;
                            }
                        });
                    }
                    // 將 PrepareEnvScript.bat 複製到 .vscode 資料夾下
                    copyPrepareEnvScript(folderpath);

                    console.log("CreateBuildtask -> writeFile tasks.json Start\n");
                    fs.writeFile(path.join(folderpath, ".vscode", "tasks.json"), TaskfileUpdate, err => {
                        if (err) {
                            console.error(err);
                            vscode.window.showErrorMessage("Create tasks.json fail.");
                        } else {
                            vscode.window.showInformationMessage("Create tasks.json Success.");
                        }
                    });
                });
            });
    }else {
        vscode.window.showInformationMessage('!!! Not support yet !!!');
    }
}

function getFolderPath() {
    let folderpath = "";

    if (vscode.workspace.workspaceFolders !== undefined && vscode.workspace.workspaceFolders.length > 0) {
        const workspaceFolder = vscode.workspace.workspaceFolders[0];
        const uri = workspaceFolder.uri.toString();
        const splitUri = uri.split(":///");

        if (splitUri.length > 1) {
            const splitPath = splitUri[1].split("%3A");

            if (splitPath.length > 1) {
                folderpath = splitPath[0] + ":" + splitPath[1];
            }
        }
    }
    console.log('Folderpath: %s', folderpath);
    return folderpath;
}

function handleInitTask() {
    let start = 0;
    let end = 0;
    let EXTENSION = '.veb';
    const folderpath = getFolderPath();
    fs.readdir(folderpath, function (err: any, files: any[]) {
        if (err) {
            console.log('Can\'t search .veb file.');
            return;
        }

        let targetFiles = files.filter(function (file) {
            return path.extname(file).toLowerCase() === EXTENSION;
        });
        console.log('targetFiles.length = %d', targetFiles.length);

        CreateBuildtask(folderpath, targetFiles, start = 0, end = targetFiles.length, ShowType.QuickPick);
    });
}

function checkAndExecuteTask(taskName: string, errorMessage: string) {
    const folderpath = getFolderPath();
    if (!folderpath) {
        vscode.window.showErrorMessage("Error folder is Empty");
        return;
    }

    const tasksJsonPath = path.join(folderpath, ".vscode", "tasks.json");
    fs.exists(tasksJsonPath, (exists: any) => {
        if (!exists) {
            vscode.window.showErrorMessage(errorMessage);
        } else {
            // F7 need to check BuildCommandList.ini
            if (taskName === "VebBuildTask") {
                fs.exists(path.join(folderpath, BuildToolFileName), exists1 => {
                    if (!exists1) {
                        console.log("Not found BuildCommandList.ini");
                        vscode.commands.executeCommand("workbench.action.tasks.runTask", "VebReBuildTask");
                    } else {
                        const CommandList: string[] = [];
                        let TasksJson = fs.readFileSync(path.join(folderpath, ".vscode", "tasks.json"), "utf8");
                        let arr = TasksJson.split(/\r?\n/);
                        arr.forEach((line: string, idx: number) => {
                            if (line.includes("label")) {
                                console.log((idx + 1) + ':' + line);
                                CommandList.push(line.split(/"/)[3]);
                            }
                        });
                        console.log(CommandList);

                        vscode.window.showQuickPick(CommandList, { placeHolder: 'select command from command list' }).then(selection => {
                            // check selection is selected or not.
                            if (!selection) {
                                return;
                            }
                            vscode.commands.executeCommand("workbench.action.tasks.runTask", selection);
                        });
                    }
                });
            } else {
                vscode.commands.executeCommand("workbench.action.tasks.runTask", taskName);
            }
        }
    });
}

// F7
function handleVebBuild() {
    checkAndExecuteTask("VebBuildTask", "VebBuildTask fail: initialize the tasks.json by pressing the shortcut key (F8).");
}
// F9
function handleVebReBuild() {
    checkAndExecuteTask("VebReBuildTask", "VebReBuildTask fail: initialize the tasks.json by pressing the shortcut key (F8).");
}

function handleKillGitProcess() {
    checkAndExecuteTask("KillGitProcess", "handleKillGitProcess fail.");
}

function registerCommand(context, commandName, callback) {
    const disposable = vscode.commands.registerCommand(commandName, callback);
    context.subscriptions.push(disposable);
}
/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context: vscode.ExtensionContext) {
    // tree provider
    MyTreeProvider.initMyTreeList();
    //
    // edl2 language provider
    vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'edk2_fdf' }, new Edk2FdfProvider());
    vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'edk2_dsc' }, new Edk2DscProvider());
    vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'edk2_dec' }, new Edk2DecProvider());
    vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'edk2_inf' }, new Edk2InfProvider());
    vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'edk2_vfr' }, new Edk2VfrProvider());

    // F8: Build initialize task Command
    registerCommand(context, 'extension.InitTask', () => handleInitTask());
    // F7: Build Command
    registerCommand(context, 'extension.VebBuild', () => handleVebBuild());
    // F9: ReBuild Command
    registerCommand(context, 'extension.VebReBuild', () => handleVebReBuild());


    // Shift + Alt + F: Uni/Sdl Formatter Documentation
    registerCommand(context, 'formatter.Edk2Formatter', () => Edk2Formatter());
    // Alt + F1
    registerCommand(context, 'SnippetTools.DebugToAsusPrint', () => new SnippetTools(vscode).DebugToAsusPrint());
    // Alt + shift + F1
    registerCommand(context, 'SnippetTools.AsusPrintToDebug', () => new SnippetTools(vscode).AsusPrintToDebug());
    // shift + F12
    registerCommand(context, 'other.KillGitProcess', () => handleKillGitProcess());

}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
    activate,
    deactivate
};