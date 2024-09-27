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

async function BuildDefaultTask(folderpath: string, selection: string, TaskfileUpdate: unknown) {
    console.log("BuildDefaultTask Start");

    // Retrieve the veb-build-provider extension
    const vebExtension = vscode.extensions.getExtension("ieibios.veb-build-provider");
    if (!vebExtension) {
        console.error("Failed to get ieibios.veb-build-provider");
        return Promise.reject("Failed to get VEB build provider extension");
    }

    // Construct paths for tee.exe and the PrepareEnvScript.bat file
    const teePath = escapePath(path.join(vebExtension.extensionPath, "Tool", "tee.exe"));
    const filename = 'PrepareEnvScript.bat';
    const sourceScriptPath = path.join(vebExtension.extensionPath, "Tool", filename);
    const targetScriptPath = escapePath(path.join(folderpath, ".vscode", filename));

    // Copy the resource file
    copyBuildResource(sourceScriptPath, targetScriptPath);

    // Read the selected file
    const fileData = await readFile(path.join(folderpath, selection));

    // Extract build and rebuild commands from the file data
    const buildCommand = extractCommand(fileData, 'Build', 'BuildAll');
    const reBuildCommand = extractCommand(fileData, 'BuildAll', 'BuildLog');

    const Veb = selection.split('.')[0];

    // Format TaskfileUpdate with the extracted commands and paths
    TaskfileUpdate = util.format(Taskfile,
        Veb, targetScriptPath, buildCommand, teePath,  // BuildAllTask
        Veb, targetScriptPath, reBuildCommand, teePath // ReBuildAllTask
    );

    return TaskfileUpdate;
}

async function AmendTaskByFile(folderpath: string, TaskfileUpdate: unknown, project: string) {
    console.log("AmendTaskByFile Start");

    // Retrieve the veb-build-provider extension
    const vebExtension = vscode.extensions.getExtension("ieibios.veb-build-provider");
    if (!vebExtension) {
        console.error("Failed to get ieibios.veb-build-provider");
        return Promise.reject("Failed to get VEB build provider extension");
    }

    // Construct paths for the BuildCommandList.ini file
    const filename = 'BuildCommandList.ini';
    const sourceScriptPath = path.join(vebExtension.extensionPath, "Tool", filename);
    const targetScriptPath = path.join(folderpath, ".vscode", filename);

    // Copy the resource file
    copyBuildResource(sourceScriptPath, targetScriptPath);

    // Read the contents of the target script file
    let array: string[];
    try {
        const fileData = await readFile(targetScriptPath); // Use the async readFile function
        array = fileData.split(/\r?\n/); // Split the file data into lines
    } catch (err) {
        console.log("AmendTaskByFile -> readFile Error");
        return Promise.resolve(TaskfileUpdate); // Resolve with the current TaskfileUpdate on error
    }

    // Process each line in the file
    array.forEach(line => {
        line = line.toString().replace(new RegExp("%project", "ig"), project.split('.')[0]);
        console.log(line);

        // Determine whether the line is a shell command or a process command
        const lineParts = line.split(/:/);
        const commandType = lineParts[0].replace(/[ |\t]/g, "");

        if (commandType === "shell") {
            TaskfileUpdate += util.format(TaskSampleShell, lineParts[1].replace(/[\t]/g, ""), lineParts[2]);
        } else {
            TaskfileUpdate += util.format(TaskSample, lineParts[1].replace(/[\t]/g, ""), commandType, lineParts[2]);
        }
    });

    return TaskfileUpdate; // Return the updated TaskfileUpdate
}

// Helper function: Reads the contents of a file
function readFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        let fileStream = fs.createReadStream(filePath);
        let data = '';

        fileStream.on('data', chunk => {
            data += chunk.toString(); // Accumulate data chunks
        });

        fileStream.on('end', () => {
            resolve(data); // Resolve promise with file data
        });

        fileStream.on('error', err => {
            reject(err); // Reject promise on error
        });
    });
}

// Helper function: Extracts a command from the file data based on start and end tags
function extractCommand(data: string, startTag: string, endTag: string): string {
    const command = data.slice(data.indexOf(startTag), data.indexOf(endTag)).split('"')[1];
    return escapePath(command); // Escape backslashes in the command
}

// Helper function: Escapes backslashes in a file path
function escapePath(filePath: string): string {
    return filePath.replace(/\\/g, '\\\\'); // Replace single backslashes with double backslashes
}

function copyBuildResource(sourceScriptPath: string, targetScriptPath: string) {
    const vebExtension = vscode.extensions.getExtension("ieibios.veb-build-provider");

    if (!vebExtension) {
        console.error("Fail to get ieibios.veb-build-provider");
        return;
    }

    try {
        // Check if the file already exists at the target location
        if (fs.existsSync(targetScriptPath)) {
            console.log(targetScriptPath + ' already exists at ' + targetScriptPath);
        } else {
            fs.copyFileSync(sourceScriptPath, targetScriptPath);
            console.log('Copied ' + targetScriptPath + ' to ' + targetScriptPath + ' successfully');
        }
    } catch (error) {
        const err = error as Error;  // Type assertion to Error
        console.error('Error copying ' + targetScriptPath + ': ' + err.message);
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
                const buildTaskUpdate = await BuildDefaultTask(folderpath, selection, TaskfileUpdate);
                const amendTaskUpdate = await AmendTaskByFile(folderpath, buildTaskUpdate, selection);
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
    } else {
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
            console.log(taskName);
            // F7 need to check BuildCommandList.ini
            if (taskName === "VebBuildTask") {
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
            } else {
                // F9
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

    // Edk2 language provider
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

}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
    activate,
    deactivate
};