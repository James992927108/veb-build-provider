import * as vscode from 'vscode';
import { MyTreeProvider } from './TreeProvider'
import { Edk2FdfProvider } from './edk2Language';
import { Edk2DscProvider } from './edk2Language';
import { Edk2DecProvider } from './edk2Language';
import { Edk2InfProvider } from './edk2Language';
import { Edk2VfrProvider } from './edk2Language';
import Edk2Formatter from "./edk2Formatter";
import AsusSnippetTools from "./AsusSnippetTools";

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const path = require('path');
const fs = require('fs');
const util = require('util');

let NumOfarray = 0;
let MaxSizeofarray = 0;
let BuildToolFileName = 'AsusBuildCommandList.ini';
// Task file define
const Taskfile = '{\n\
    "version": "3.0.2",\n\
    "tasks": \n\
    [\n\
        {\n\
            "label": "------------------------------------Internal command------------------------------------------",\n\
            "type": "shell",\n\
            "command": ""\n\
        },\n\
        {\n\
            "label": "AsusBuildAllTask",\n\
            "type": "shell",\n\
            "command": "cmd /V /C \\"SET VEB=%s&&echo !VEB! &&%s 2>&1| %s Build.log\\""\n\
        },\n\
        {\n\
            "label": "AsusReBuildAllTask",\n\
            "type": "shell",\n\
            "command": "cmd /V /C \\"SET VEB=%s&&echo !VEB! &&%s 2>&1| %s Build.log\\""\n\
        },\n\
        {\n\
            "label": "AsusBuildSingleModule",\n\
            "type": "shell",\n\
            "command": "cmd /V /C \\".vscode\\\\TargetModule.bat&&SET VEB=%s&&echo !VEB! &&%s 2>&1| %s Build.log\\""\n\
        },\n\
        {\n\
            "label": "Asus Release Bios",\n\
            "type": "shell",\n\
            "command": "cmd /V /C \\"SET VEB=%s&&set PATH=%PATH%;C:\\\\Program Files\\\\7-Zip&&echo !VEB! &&%s 2>&1| %s Build.log\\""\n\
        },\n\
        {\n\
            "label": "Asus Clean Command",\n\
            "type": "shell",\n\
            "command": "cmd /V /C \\"SET VEB=%s&&echo !VEB! &&set PATH=%PATH%;D:\\\\BIOS\\\\AmiAptio5Tools\\\\BuildTools&&SET AMIEFITOOLS=D:\\\\BIOS\\\\AmiAptio5Tools&&SET TOOLS_DIR=D:\\\\BIOS\\\\AmiAptio5Tools\\\\BuildTools&&SET ASUSBUILDTOOLS=D:\\\\BIOS\\\\AmiAptio5Tools&&%s 2>&1| %s Build.log\\""\n\
        },\n\
        {\n\
            "label": "------------------------------------External command------------------------------------------",\n\
            "type": "shell",\n\
            "command": ""\n\
        },\n\
        {\n\
            "label": "AsusAitModuleSync",\n\
            "type": "shell",\n\
            "command": "ait subm %s --sync"\n\
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

async function BuildDefaulTask(folderpath, selection, TaskfileUpdate) {
    return new Promise(resolve => {
        let fileStream = fs.createReadStream(path.join(folderpath, selection));
        let BuildCommand = [];
        let ReBuildCommand = [];
        let ExecuteCommand = [];
        let CleanCmdCommand = [];
        const extension = vscode.extensions.getExtension("AsusBios.asus-veb-provider");
        let extensionPath = "";

        if (extension !== undefined) {
            extensionPath = path.join(extension.extensionPath, "Tool", "tee.exe").replace(/\\/g, '\\\\');
        } else {
            console.log("getExtension AsusBios.asus-veb-provider failed");
        }
        console.log("BuildDefaulTask");
        fileStream.on('data', function (chunk) {
            ReBuildCommand = chunk.toString().slice(chunk.toString().indexOf('Build'), chunk.toString().indexOf('BuildAll')).split('"')[1].replace(/\\/g, '\\\\');
            BuildCommand = chunk.toString().slice(chunk.toString().indexOf('BuildAll'), chunk.toString().indexOf('Execute')).split('"')[1].replace(/\\/g, '\\\\');
            ExecuteCommand = chunk.toString().slice(chunk.toString().indexOf('Execute'), chunk.toString().indexOf('BuildLog')).split('"')[1].replace(/\\/g, '\\\\');
            CleanCmdCommand = chunk.toString().slice(chunk.toString().indexOf('CleanCmd'), chunk.toString().indexOf('[files]')).split('"')[1].replace(/\\/g, '\\\\');
            fileStream.destroy();
        });
        fileStream.on('close', () => {
            console.log('Build: %s\nrebuild: %s\nExecuteCommand: %s\nCleanCmdCommand: %s', BuildCommand, ReBuildCommand, ExecuteCommand, CleanCmdCommand);
            TaskfileUpdate = util.format(Taskfile,
                selection.split('.')[0],
                BuildCommand,
                extensionPath,
                selection.split('.')[0],
                ReBuildCommand,
                extensionPath,
                selection.split('.')[0],
                ReBuildCommand,
                extensionPath,
                selection.split('.')[0],
                ExecuteCommand,
                extensionPath,
                selection.split('.')[0],
                CleanCmdCommand,
                extensionPath,
                selection, // ait sync %s
            );
            resolve(TaskfileUpdate);
        });
    });
}

function AmendTaskByFile(folderpath, selection, TaskfileUpdate, project) {
    console.log("AmendTaskByFile");
    var array;
    try {
        array = fs.readFileSync(path.join(folderpath, selection)).toString().split(/\r?\n/);
    } catch (err) {
        console.log("EEER");
        return new Promise(resolve => {
            resolve(TaskfileUpdate);
        });
    }
    array.forEach(line => {
        line = line.toString().replace(new RegExp("%project","ig"), project.split('.')[0]);
        console.log(line)
        if (line.split(/:/)[0].replace(/[ |\t]/g, "") == "shell") {
            console.log('shell');
            TaskfileUpdate = TaskfileUpdate + util.format(TaskSampleShell, line.split(/:/)[1].replace(/[\t]/g, ""), line.split(/:/)[2]);
        } else {
            TaskfileUpdate = TaskfileUpdate + util.format(TaskSample, line.split(/:/)[1].replace(/[\t]/g, ""), line.split(/:/)[0].replace(/[ |\t]/g, ""), line.split(/:/)[2]);
        }
    });
    return new Promise(resolve => {
        resolve(TaskfileUpdate);
    });
}


//showType: 0 = showInformationMessage Type, 1 = showQuickPick Type.
function CreateBuildtask(folderpath, targetFiles, start, end, showType) {
    let TaskfileUpdate = [];

    console.log('Show Veb array from(%d) to(%d)', start, end);
    if (showType) {
        vscode.window.showQuickPick([...targetFiles.slice(start, end)], { placeHolder: 'Start Build for ?' })
            .then(async selection => {
                // check selection is selected or not.
                if (!selection)
                    return;
                // make Task content
                let TaskfileUpdate: unknown = [];
                const buildTaskUpdate = await BuildDefaulTask(folderpath, selection, TaskfileUpdate);
                const amendTaskUpdate = await AmendTaskByFile(folderpath, BuildToolFileName, buildTaskUpdate, selection);
                TaskfileUpdate = amendTaskUpdate;
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
                    TaskfileUpdate = TaskfileUpdate + "\t]\n}";
                    console.log("writeFile Start\n");
                    fs.writeFile(path.join(folderpath, ".vscode", "tasks.json"), TaskfileUpdate, err => {
                        if (err) {
                            console.error(err);
                            vscode.window.showErrorMessage("Create task.json fail.");
                        } else {
                            //console.log('YES! %s',TaskfileUpdate);
                            vscode.window.showInformationMessage("Create task.json Success.");
                        }
                    });
                });
            });
    }
    else {
        vscode.window.showInformationMessage('Start Build for ?', ...targetFiles.slice(start, end))
            .then(async selection => {
                // check selection is selected or not.
                if (!selection)
                    return;
                // make Task content
                let TaskfileUpdate: unknown = [];
                TaskfileUpdate = await BuildDefaulTask(folderpath, selection, TaskfileUpdate);

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
                    fs.writeFile(path.join(folderpath, ".vscode", "tasks.json"), TaskfileUpdate, err => {
                        if (err) {
                            console.error(err);
                            vscode.window.showErrorMessage("Create task.json fail.");
                        } else {
                            //console.log('YES! %s',TaskfileUpdate);
                            vscode.window.showInformationMessage("Create task.json Success.");
                        }
                    });
                });
            });
    }
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
    //
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    let start = 0;
    let end = 0;
    let EXTENSION = '.veb';
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

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json

    // Asus Build initialize task Command
    let disposable0 = vscode.commands.registerCommand('extension.AsusInitTask', function () {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        fs.readdir(folderpath, function (err, files) {
            if (err) {
                console.log('Can\'t search .veb file.');
                return;
            }

            let targetFiles = files.filter(function (file) {
                return path.extname(file).toLowerCase() === EXTENSION;
            });

            if (NumOfarray != 0) {
                for (let index = 0; index < NumOfarray; index++) {
                    start = end = 0;
                    let TempDynamicArraySize = Math.ceil(targetFiles.length / NumOfarray);
                    if (index == NumOfarray - 1) {
                        start = index * TempDynamicArraySize;
                        end = targetFiles.length;

                    } else {
                        start = index * TempDynamicArraySize;
                        end = (index + 1) * TempDynamicArraySize;
                    }
                    CreateBuildtask(folderpath, targetFiles, start, end, 0);
                }
            } else if (MaxSizeofarray != 0) {
                for (let index = 0; index < targetFiles.length / MaxSizeofarray; index++) {
                    start = end = 0;
                    start = index * MaxSizeofarray;
                    end = (index + 1) * MaxSizeofarray;
                    CreateBuildtask(folderpath, targetFiles, start, end, 0);
                }
            }
            else {
                start = 0;
                end = targetFiles.length;
                CreateBuildtask(folderpath, targetFiles, start, end, 1);
            }

        });
    });

    context.subscriptions.push(disposable0);

    // Asus Build all Command
    let disposable1 = vscode.commands.registerCommand('extension.AsusBuildAll', function () {
        fs.exists(path.join(folderpath, ".vscode", "tasks.json"), exists => {
            if (!exists) {
                vscode.window.showErrorMessage("Asus Build fail: initialize the task.json by pressing the shortcut key (F8).");
            } else {
                vscode.commands.executeCommand("workbench.action.tasks.runTask", "AsusBuildAllTask");
            }
        });
    });
    context.subscriptions.push(disposable1);

    // Asus ReBuild Command
    let disposable2 = vscode.commands.registerCommand('extension.AsusReBuild', function () {
        fs.exists(path.join(folderpath, ".vscode", "tasks.json"), exists => {
            if (!exists) {
                vscode.window.showErrorMessage("Asus Build fail: initialize the task.json by pressing the shortcut key (F8).");
            } else {
                fs.exists(path.join(folderpath, BuildToolFileName), exists1 => {
                    if (!exists1) {
                        vscode.commands.executeCommand("workbench.action.tasks.runTask", "AsusReBuildAllTask");
                    } else {
                        const CommandList: string[] = [];
                        let TasksJson = fs.readFileSync(path.join(folderpath, ".vscode", "tasks.json"), "utf8");
                        let arr = TasksJson.split(/\r?\n/);
                        arr.forEach((line, idx) => {
                            if (line.includes("label")) {
                                console.log((idx + 1) + ':' + line);
                                CommandList.push(line.split(/"/)[3])
                            }
                        });
                        console.log(CommandList);

                        vscode.window.showQuickPick(CommandList, { placeHolder: 'select command from command list' }).then(selection => {
                            // check selection is selected or not.
                            if (!selection)
                                return;
                            vscode.commands.executeCommand("workbench.action.tasks.runTask", selection);
                        });
                    }
                });
            }
        });
    });
    context.subscriptions.push(disposable2);

    // Asus Build Single Module Command
    let disposable3 = vscode.commands.registerCommand('extension.AsusBuildSingleModule', function () {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            var currentlyOpenTabfilePath = activeEditor.document.fileName;
            var currentlyOpenTabextname = path.extname(currentlyOpenTabfilePath);
            if (currentlyOpenTabextname != '.inf') {
                vscode.window.showErrorMessage("請標記INF檔再進行Asus Build Single Module");
                vscode.window.showErrorMessage(path.basename(currentlyOpenTabfilePath) + " can't be builed");
            } else {
                fs.writeFile(path.join(folderpath, ".vscode", "TargetModule.bat"), 'set VEB_BUILD_MODULE=' + currentlyOpenTabfilePath, err => {
                    if (err) {
                        console.error(err);
                        vscode.window.showErrorMessage("Create task.json fail.");
                    } else {
                        //console.log('YES! %s',TaskfileUpdate);
                        vscode.window.showInformationMessage("Start to build module:  " + path.basename(currentlyOpenTabfilePath));
                        vscode.commands.executeCommand("workbench.action.tasks.runTask", "AsusBuildSingleModule");
                    }
                });
            }
        }
    });
    context.subscriptions.push(disposable3);

    let disposable4 = vscode.commands.registerCommand('extension.AsusAitSync', function () {
        fs.exists(path.join(folderpath, ".vscode", "tasks.json"), exists => {
            if (!exists) {
                vscode.window.showErrorMessage("Asus Build fail: initialize the task.json by pressing the shortcut key (F8).");
            } else {
                vscode.commands.executeCommand("workbench.action.tasks.runTask", "AsusAitModuleSync");
            }
        });
    });
    context.subscriptions.push(disposable4);

    // Uni/Sdl Formatter Documentation
    let disposable5 = vscode.commands.registerCommand('formatter.Edk2Formatter', () => Edk2Formatter());
    context.subscriptions.push(disposable5);

    //
    const AsusSnippet = new AsusSnippetTools(vscode);
    let disposable6 = vscode.commands.registerCommand('AsusSnippetTools.DebugToAsusPrint', () => AsusSnippet.processFile());
    context.subscriptions.push(disposable6);

    let disposable7 = vscode.commands.registerCommand('AsusSnippetTools.AsusPrintToDebug', () => AsusSnippet.processFile1());
    context.subscriptions.push(disposable7);

    let disposable8 = vscode.commands.registerCommand('other.KillGitProcess', function () {
        fs.exists(path.join(folderpath, ".vscode", "tasks.json"), exists => {
            if (!exists) {
                vscode.window.showErrorMessage("Asus other fail: Kill git process fail.");
            } else {
                vscode.commands.executeCommand("workbench.action.tasks.runTask", "KillGitProcess");
            }
        });
    });
    context.subscriptions.push(disposable8);

    let disposable9 = vscode.commands.registerCommand('extension.AsusVebExcute', function () {
        fs.exists(path.join(folderpath, ".vscode", "tasks.json"), exists => {
            if (!exists) {
                vscode.window.showErrorMessage("Asus Build fail: initialize the task.json by pressing the shortcut key (F8).");
            }
            else {
                vscode.commands.executeCommand("workbench.action.tasks.runTask", "Asus Release Bios");
            }
        });
    });
    context.subscriptions.push(disposable9);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
    activate,
    deactivate
}