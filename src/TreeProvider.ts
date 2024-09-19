import * as vscode from 'vscode';
import * as fs from 'fs';
import { join } from 'path';
import { log } from 'console';
const path = require('path');

let projectPath: string = ""; // 存project的路徑，例如:D:\BIOS\CometLake\
let vebCifFile: string[] = []; // 存Veb裡所有的cif檔的路徑(不包含project路徑)
let allCifFile: string[] = []; // 存veb檔[files]底下全部的cif檔案(文字檔轉成單一string)
let openedCifPosition: number[] = []; // 存已經被加到treeview上的cif陣列位置，已利後續將其不再加到treeview上
let allTreesNode: myTreeNode[] = [];
let orphanCif: string[] = [], orphanName: string[] = [];
let missingFile: string[] = [];
missingFile.push("-----------------Missing File Log-----------------");
export class MyTreeProvider implements vscode.TreeDataProvider<myTreeNode>
{
    public static tree: myTreeNode[] = []; //第一層tree node
    public static files: myTreeFilesNode[][] = []; //myTreeNode底下的Files屬性object
    public static infFiles: myTreeFilesNode[][] = []; //myTreeNode底下的Files屬性object (inf資料專用)
    public static infSourcesFiles: myTreeFilesNode[][] = []; //myTreeNode底下的Files屬性object (inf的[Sources]資料專用)
    public static infSourcesFiles1: myTreeFilesNode[] = []; //myTreeNode底下的Files屬性object (inf的[Sources]資料專用)
    public static infBinariesFile: myTreeFilesNode[][] = []; //myTreeNode底下的Files屬性object (inf的[Binaries]資料專用)
    public static infBinariesFile1: myTreeFilesNode[] = []; //myTreeNode底下的Files屬性object (inf的[Binaries]資料專用)
    public static cifFiles: myTreeFilesNode[][] = []; //myTreeNode底下的Files屬性object (cif資料專用)
    public static decFiles: myTreeFilesNode[] = [];

    public static lastOpenedFile: string | undefined;
    public static lastOpenedDate: Date | undefined;

    constructor() { }

    public static initMyTreeList() {
        let myTreeProvider = new MyTreeProvider();
        const treeView = vscode.window.createTreeView("fileExplorer", { treeDataProvider: myTreeProvider, showCollapseAll: true });
        vscode.commands.registerCommand('fileExplorer.openFile', (resource) => this.openResource(resource)); //註冊指令，按下treeitem後要開啟檔案的指令
        vscode.commands.registerCommand('rightclick.openFile', (resource) => this.openCifInfResource(resource));
        vscode.commands.registerCommand('rightclick.copyfilepath', (resource) => this.copyFilePath(resource));
        vscode.commands.registerCommand('rightclick.openFolder', (resource) => {
            let folderUri = vscode.Uri.file(resource.Path);
            vscode.commands.executeCommand("revealFileInOS", folderUri);
        });
        vscode.commands.registerCommand('rightclick.Locate', (resource) => {
            let sameCount: number = 0, position: number = 0;
            let sameNode: myTreeNode[] = [];
            let currentFilePath = resource.fsPath;
            for (let i = 0; i < allTreesNode.length; i++) {
                if (allTreesNode[i].Path === currentFilePath) {
                    sameNode[sameCount] = allTreesNode[i];
                    sameCount++;
                    position = i;
                }
            }
            if (sameCount > 1) {
                let nodeResource: string[] = [];
                for (let i = 0; i < sameNode.length; i++) {
                    if (sameNode[i].resource) {
                        nodeResource[i] = sameNode[i].resource.label;
                    }
                }
                vscode.window.showQuickPick(nodeResource, { placeHolder: 'Which component name ?' }).then(value => {
                    for (let i = 0; i < sameNode.length; i++) {
                        if (value === sameNode[i].resource.label) {
                            treeView.reveal(sameNode[i], { select: true, focus: true, expand: true });
                        }
                    }
                    if (!value) {return;}
                });
            }
            else {
                treeView.reveal(allTreesNode[position], { select: true, focus: true, expand: true });
            }
        });

        let editorUri: vscode.Uri | undefined = vscode.window.activeTextEditor?.document.uri; //取正在開啟中編輯頁面檔案的uri
        let editorPath = editorUri?.fsPath; // 取開啟中編輯頁面檔案的檔案路徑
        let tmpArr: string[] | undefined;
        if (editorPath) {
            if (editorPath.indexOf('.veb') !== -1) {
                // read file from current editor tab
                let dataVeb = fs.readFileSync(editorPath, 'utf-8');
                let exist: boolean = true;
                let index: number = 0;
                let searchPointFiles = dataVeb.indexOf(dataVeb.match(/\[files]/i));
                let searchPointEnd = dataVeb.length - 1;
                let tmpDataVeb: string[] = [];

                // get project path
                tmpArr = editorPath?.split("\\");
                if (tmpArr) {
                    for (let i = 0; i < tmpArr.length - 1; i++)
                        {projectPath += tmpArr[i] + '\\';}
                }
                tmpDataVeb = dataVeb.replace(new RegExp("/", "ig"), "\\").substring(searchPointFiles + 7, searchPointEnd).split('\n');
                for (let i = 0; i < tmpDataVeb.length; i++) {
                    let st: string;
                    st = tmpDataVeb[i].split('=')[0].replace(new RegExp('"', 'gi'), '').replace(/[\n\r]/g, '').trim();
                    if (st !== '')
                        {vebCifFile.push(st);}
                }
                for (let i = 0; i < vebCifFile.length; i++) {
                    let cifPath = projectPath + vebCifFile[i];
                    if (fs.existsSync(cifPath)) {
                        allCifFile[i] = fs.readFileSync(cifPath, 'utf-8'); // read all cif files
                    }
                    else {
                        allCifFile[i] = "File not exist";
                    }
                }
                for (let i = 0; i < vebCifFile.length; i++) {
                    let cifPath = projectPath + vebCifFile[i];
                    if (fs.existsSync(cifPath)) {
                        specifyCif(allCifFile, cifPath, i);
                    }
                }

                for (let i = 0; i < vebCifFile.length; i++) { // handle orphan  
                    for (let j = 0; j < openedCifPosition.length; j++) {
                        if (i === openedCifPosition[j]) {
                            exist = true;
                            break;
                        }
                        else {
                            exist = false;
                        }
                    }
                    if (!exist) {
                        let cifPath = projectPath + vebCifFile[i];
                        if (fs.existsSync(cifPath)) { //只找沒有在任何[parts]底下的
                            handleOrphan(cifPath);
                        }
                    }
                }

                for (let i = 0; i < vebCifFile.length; i++) { // handle specify cif files    
                    for (let j = 0; j < openedCifPosition.length; j++) {
                        if (i === openedCifPosition[j]) {
                            exist = true;
                            break;
                        }
                        else {
                            exist = false;
                        }
                    }
                    if (!exist) {
                        let cifPath = projectPath + vebCifFile[i];
                        if (fs.existsSync(cifPath)) { //只找最上層的node(.cif)
                            let orphanPositionBack = 0;
                            orphanPositionBack = handleCif(cifPath, vebCifFile[i], index, i);
                            index++;
                            index -= orphanPositionBack;
                        }
                        else {
                            fs.exists(path.join(vscode.workspace.rootPath, ".vscode"), exists => {
                                if (!exists) {
                                    fs.mkdir(path.join(vscode.workspace.rootPath, ".vscode"), err => {
                                        if (err) {
                                            return;
                                        }
                                    });
                                }
                            });
                            vscode.window.showInformationMessage(`"${cifPath}" file does *not* exist, missing file log is saved in "${vscode.workspace.rootPath}\\.vscode\\Missing_File_Log.txt".`);
                            pushToMissingFile(cifPath);
                        }
                    }
                }
            }
            else
                {listVeb();}
        }
        else
            {listVeb();}
    }

    static copyFilePath(resource: any): void {
        let file = resource.Path;
        if (file.charAt(0) === '/') {file = file.substr(1);}
        vscode.env.clipboard.writeText(file);
    }
    static openResource(resource: vscode.Uri): void { //執行指令的method
        let file = resource.path;
        if (file.charAt(0) === '/') {file = file.substr(1);}
        let uri = vscode.Uri.parse('file:///' + file);
        if (file.indexOf('.veb') === -1) {
            if (uri.path.indexOf('.chm') !== -1)
                {vscode.commands.executeCommand('vscode.open', resource);}
            else
                {MyTreeProvider.runCommand(uri);}
        }
        else {
            vscode.commands.executeCommand('vscode.open', resource);
            vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
    }
    static openCifInfResource(resource: any): void { //執行指令的method
        let file = resource.Path;
        if (file.charAt(0) === '/') {file = file.substr(1);}
        let uri = vscode.Uri.parse('file:///' + file);
        if (file.indexOf('.veb') === -1) {
            vscode.commands.executeCommand('vscode.open', uri);
        }
        else {
            vscode.commands.executeCommand('vscode.open', uri);
            vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
    }
    static async runCommand(item: any): Promise<void> {
        let options: vscode.TextDocumentShowOptions = {
            preview: !this.checkDoubleClick(item),
            preserveFocus: true
        };
        let filepath = item.path;
        let document = await vscode.workspace.openTextDocument(filepath);
        vscode.window.showTextDocument(document, options);
    }
    static checkDoubleClick(item: any): boolean {
        let result = false;
        if (this.lastOpenedFile && this.lastOpenedDate) {
            let isTheSameFile = this.lastOpenedFile === item.path;
            let dateDiff = <number>(<any>new Date() - <any>this.lastOpenedDate);
            result = isTheSameFile && dateDiff < 500;
        }
        this.lastOpenedFile = item.path;
        this.lastOpenedDate = new Date();
        return result;
    }

    private static _onDidChangeTreeData: vscode.EventEmitter<myTreeNode | undefined> = new vscode.EventEmitter<myTreeNode | undefined>();
    readonly onDidChangeTreeData: vscode.Event<myTreeNode | undefined> = MyTreeProvider._onDidChangeTreeData.event;

    public getTreeItem(element: myTreeNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
        /*
            !Condition Token 判斷寫在這
        */
        let file = element.Path;
        if (file.charAt(0) === '/') {file = file.substr(1);}
        let uri = vscode.Uri.parse('file:///' + file);
        const treeItem = new vscode.TreeItem(element.label, element.Files.length > 0 ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
        treeItem.tooltip = file;
        treeItem.contextValue = 'file';
        if (element.Files.length > 0)
            {treeItem.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;}
        if (element.kind === 1) { // files
            treeItem.command = { command: 'fileExplorer.openFile', title: "Open File", arguments: [uri] };
            treeItem.iconPath = join(__filename, '..', '..', 'media', 'document.svg');
        }
        else if (element.kind === 0) { // .cif
            switch (element.category.toLowerCase()) {
                case "ecore":
                    treeItem.iconPath = join(__filename, '..', '..', 'media', 'eCore.svg');
                    break;
                case "modulepart":
                    treeItem.iconPath = join(__filename, '..', '..', 'media', 'ModulePart.svg');
                    break;
                case "io":
                    treeItem.iconPath = join(__filename, '..', '..', 'media', 'IO.svg');
                    break;
                case "flash":
                    treeItem.iconPath = join(__filename, '..', '..', 'media', 'FLASH.svg');
                    break;
                case "cpu":
                    treeItem.iconPath = join(__filename, '..', '..', 'media', 'cpu.svg');
                    break;
                case "echipset":
                    treeItem.iconPath = join(__filename, '..', '..', 'media', 'eChipset.svg');
                    break;
                case "emodule":
                    treeItem.iconPath = join(__filename, '..', '..', 'media', 'eModule.svg');
                    break;
                case "module":
                    treeItem.iconPath = join(__filename, '..', '..', 'media', 'eModule.svg');
                    break;
                case "eboard":
                    treeItem.iconPath = join(__filename, '..', '..', 'media', 'eBoard.svg');
                    break;
                case "flavor":
                    treeItem.iconPath = join(__filename, '..', '..', 'media', 'Flavor.svg');
                    break;
                default:
                    break;
            }
        }
        else if (element.kind === 2) { // .inf    
            treeItem.iconPath = join(__filename, '..', '..', 'media', 'INF.svg');
        }
        else if (element.kind === 3) { // .veb
            treeItem.command = { command: 'fileExplorer.openFile', title: "Open File", arguments: [uri] };
            treeItem.iconPath = join(__filename, '..', '..', 'media', 'letter-v.svg');
        }
        else if (element.kind === 4) { //dec
            if (treeItem.collapsibleState === 0)
                {treeItem.command = { command: 'fileExplorer.openFile', title: "Open File", arguments: [uri] };}
            treeItem.iconPath = join(__filename, '..', '..', 'media', 'filefolder.svg');
        }
        else if (element.kind === 5) { //error
            treeItem.iconPath = join(__filename, '..', '..', 'media', 'error.svg');
        }
        return treeItem;
    }

    getParent(element: myTreeNode): vscode.ProviderResult<any> {
        return element.resource;
    }

    getChildren(element: myTreeNode): vscode.ProviderResult<any[]> {
        let trees: myTreeNode[] = [];
        if (element === undefined) {
            if (MyTreeProvider.tree !== undefined) {
                for (let i = 0; i < MyTreeProvider.tree.length; i++) {
                    if (MyTreeProvider.tree[i].kind !== myTreeKind.veb) {
                        let currentElement = MyTreeProvider.tree[i];
                        let treeLabel = currentElement.label;
                        let temp: myTreeNode = new myTreeNode(treeLabel, vscode.TreeItemCollapsibleState.Collapsed, MyTreeProvider.files[i], currentElement.Path, myTreeKind.cif, currentElement.LocalRoot, currentElement.RefName, currentElement.category, currentElement.resource);
                        trees.push(temp);
                        allTreesNode.push(temp);
                    }
                    else {
                        let currentElement = MyTreeProvider.tree[i];
                        let treeLabel = currentElement.label;
                        let temp: myTreeNode = new myTreeNode(treeLabel, vscode.TreeItemCollapsibleState.None, [], currentElement.Path, myTreeKind.veb, '', '', '', currentElement.resource);
                        trees.push(temp);
                    }
                }
            }
        }
        else {
            let localRoot: string = element.LocalRoot;
            let refName: string = element.RefName;
            let innerCifFilesCount = 0, outerCifFilesCount = 0;
            if (element.kind === myTreeKind.cif || element.kind === myTreeKind.inf || element.kind === myTreeKind.dec) {
                for (let i = 0; i < element.Files.length; i++) {
                    let currentElement = element.Files[i];
                    if (element.Files[i].fileState === 1) { // parts : file must be .cif
                        let fileName = "", category = "";
                        for (let j = 0; j < allCifFile.length; j++) {
                            let tmp = getLocalRefName(allCifFile, j);// tmp[0]:走遍每一個cif檔的LocalRoot, tmp[1]:走遍每一個cif檔的RefName, tmp[2]:filename
                            if (element.Files[i].fileName.toUpperCase() === tmp[1].toUpperCase()) {
                                let tmpString = "";
                                if (element.Files[i].fileRoot.split('\\').length > 0)
                                    {for (let n = 0; n < element.Files[i].fileRoot.split('\\').length - 1; n++)
                                        {tmpString += element.Files[i].fileRoot.split('\\')[n] + '\\';}}
                                else
                                    {tmpString = "";}
                                localRoot = tmpString;
                                refName = tmp[1];
                                fileName = tmp[2];
                                category = handleParts(allCifFile[j], innerCifFilesCount, j);
                                innerCifFilesCount++;
                                break;
                            }
                        }
                        let filePath = projectPath + element.Files[i].fileRoot;
                        let reviewnode: myTreeNode = new myTreeNode(fileName, vscode.TreeItemCollapsibleState.Collapsed, MyTreeProvider.cifFiles[outerCifFilesCount], filePath, myTreeKind.cif, localRoot, refName, category, element);
                        trees.push(reviewnode);
                        allTreesNode.push(reviewnode);
                        outerCifFilesCount++;
                    }
                    else if (element.Files[i].fileState === 10) { // files in .dec
                        let fileName = currentElement.fileName.replace(new RegExp("/", "ig"), "\\");
                        let filePath = projectPath + localRoot + fileName;
                        let reviewnode: myTreeNode;
                        if (!fs.existsSync(filePath)) {
                            pushToMissingFile(filePath);
                            reviewnode = new myTreeNode(fileName.split('\\')[fileName.split('\\').length - 1], vscode.TreeItemCollapsibleState.None, [], filePath, myTreeKind.error, localRoot, refName, '', element);
                        }
                        else {
                            reviewnode = new myTreeNode(fileName.split('\\')[fileName.split('\\').length - 1], vscode.TreeItemCollapsibleState.None, [], filePath, myTreeKind.files, localRoot, refName, '', element);
                        }
                        trees.push(reviewnode);
                        allTreesNode.push(reviewnode);
                    }
                    else if (element.Files[i].fileState === 0) { // files in .cif
                        let fileName = currentElement.fileName.replace(new RegExp("/", "ig"), "\\");
                        if (fileName.indexOf('..\\') !== -1) { //有..
                            let tmpName = fileName.split('\\');
                            let dotCount: number = 0;
                            fileName = "";
                            for (let j = 0; j < tmpName.length - 1; j++) {
                                if (tmpName[j] === '..')
                                    {dotCount++;}
                                else
                                    {fileName += tmpName[j] + '\\';}
                            }
                            fileName += tmpName[tmpName.length - 1];
                            let tmpLocalRootSplit = localRoot.split('\\');
                            let tmpLocalRoot: string[] = [];
                            for (let j = 0, k = 0; j < tmpLocalRootSplit.length; j++) {
                                if (tmpLocalRootSplit[j] !== "") {
                                    tmpLocalRoot[k] = tmpLocalRootSplit[j];
                                    k++;
                                }
                            }
                            localRoot = "";
                            for (let j = 0; j < tmpLocalRoot.length - dotCount; j++) {
                                localRoot += tmpLocalRoot[j] + '\\';
                            }
                        }
                        else {//沒有..
                            let tmpLocalRootSplit = localRoot.split('\\');
                            let tmpLocalRoot: string[] = [];
                            for (let j = 0, k = 0; j < tmpLocalRootSplit.length; j++) {
                                if (tmpLocalRootSplit[j] !== "") {
                                    tmpLocalRoot[k] = tmpLocalRootSplit[j];
                                    k++;
                                }
                            }
                            localRoot = "";
                            for (let j = 0; j < tmpLocalRoot.length; j++) {
                                localRoot += tmpLocalRoot[j] + '\\';
                            }
                        }
                        if (fileName.indexOf('.dec') !== -1) {
                            if (localRoot === "") {
                                if (fileName.split('\\').length > 1) {
                                    for (let j = 0; j < fileName.split('\\').length - 1; j++) {
                                        localRoot += fileName.split('\\')[j] + '\\';
                                    }
                                    fileName = fileName.split('\\')[fileName.split('\\').length - 1];
                                }
                            }
                            let decFilePath = projectPath + localRoot + fileName;
                            handleDec(decFilePath, localRoot);
                            let reviewnode: myTreeNode = new myTreeNode(fileName, vscode.TreeItemCollapsibleState.Collapsed, MyTreeProvider.decFiles, decFilePath, myTreeKind.dec, localRoot, refName, '', element);
                            trees.push(reviewnode);
                            allTreesNode.push(reviewnode);
                        }
                        else {
                            let filePath = projectPath + localRoot + fileName;
                            let reviewnode: myTreeNode;
                            if (!fs.existsSync(filePath)) {
                                pushToMissingFile(filePath);
                                reviewnode = new myTreeNode(fileName.split('\\')[fileName.split('\\').length - 1], vscode.TreeItemCollapsibleState.None, [], filePath, myTreeKind.error, localRoot, refName, '', element);
                            }
                            else {
                                reviewnode = new myTreeNode(fileName.split('\\')[fileName.split('\\').length - 1], vscode.TreeItemCollapsibleState.None, [], filePath, myTreeKind.files, localRoot, refName, '', element);
                            }
                            trees.push(reviewnode);
                            allTreesNode.push(reviewnode);
                        }
                    }
                    else if (element.Files[i].fileState === 2) { // INF in .cif
                        let infName = currentElement.fileName;
                        infName = infName.replace(new RegExp("/", "ig"), "\\").split('#')[0].trim();
                        let infPath = projectPath + localRoot + infName;
                        if (fs.existsSync(infPath)) {
                            let baseName = handleINF(localRoot, infName, i);
                            refName = infName.split('.')[0] + '.inf';
                            if (refName.split('\\').length > 1)
                                {refName = refName.substring(0, refName.lastIndexOf('\\', refName.indexOf(".inf") + 1)) + '\\';}
                            else
                                {refName = "";}
                            let reviewnode: myTreeNode = new myTreeNode('INF-' + baseName, vscode.TreeItemCollapsibleState.Collapsed, MyTreeProvider.infFiles[i], infPath, myTreeKind.inf, localRoot, refName, '', element);
                            trees.push(reviewnode);
                            allTreesNode.push(reviewnode);
                        }
                        else {
                            fs.exists(path.join(vscode.workspace.rootPath, ".vscode"), exists => {
                                if (!exists) {
                                    fs.mkdir(path.join(vscode.workspace.rootPath, ".vscode"), err => {
                                        if (err) {
                                            return;
                                        }
                                    });
                                }
                            });
                            vscode.window.showInformationMessage(`"${infPath}" file does *not* exist, missing file log is saved in "${vscode.workspace.rootPath}\\.vscode\\Missing_File_Log.txt".`);
                            pushToMissingFile(infPath);
                        }
                    }
                    else if (element.Files[i].fileState === 3) { // sources in .inf
                        let infSourceName = currentElement.fileName;
                        let infSourcePath = projectPath + currentElement.fileRoot + infSourceName;
                        let reviewnode: myTreeNode;
                        if (!fs.existsSync(infSourcePath)) {
                            reviewnode = new myTreeNode(infSourceName.split('\\')[infSourceName.split('\\').length - 1], vscode.TreeItemCollapsibleState.None, [], infSourcePath, myTreeKind.error, localRoot, refName, '', element);
                            if (infSourceName.charAt(0) !== '$')
                                {pushToMissingFile(infSourcePath);}
                        }
                        else {
                            reviewnode = new myTreeNode(infSourceName.split('\\')[infSourceName.split('\\').length - 1], vscode.TreeItemCollapsibleState.None, [], infSourcePath, myTreeKind.files, localRoot, refName, '', element);
                        }
                        trees.push(reviewnode);
                        allTreesNode.push(reviewnode);
                    }
                    else if (element.Files[i].fileState === 4) { // Ia32, X64, ... in .inf 
                        let infSourceFolderName = currentElement.fileName;
                        handleINFSource(element.Path, element.Files[i].fileName);
                        let reviewnode: myTreeNode = new myTreeNode(infSourceFolderName, vscode.TreeItemCollapsibleState.Collapsed, MyTreeProvider.infSourcesFiles1, element.Path, myTreeKind.inf, localRoot, refName, '', element);
                        trees.push(reviewnode);
                        let cleanNode: myTreeNode = new myTreeNode('', vscode.TreeItemCollapsibleState.Collapsed, [], '', myTreeKind.inf, '', '', '');
                        allTreesNode.push(cleanNode);
                    }
                    else if (element.Files[i].fileState === 5) { //sources in Ia32, X64, ... in .inf
                        let infSourceName = currentElement.fileName;
                        let infSourcePath = projectPath + localRoot + element.RefName + infSourceName;
                        let reviewnode: myTreeNode;
                        if (!fs.existsSync(infSourcePath)) {
                            reviewnode = new myTreeNode(infSourceName.split('\\')[infSourceName.split('\\').length - 1], vscode.TreeItemCollapsibleState.None, [], infSourcePath, myTreeKind.error, localRoot, refName, '', element.resource);
                            if (infSourceName.charAt(0) !== '$')
                                {pushToMissingFile(infSourcePath);}
                        }
                        else {
                            reviewnode = new myTreeNode(infSourceName.split('\\')[infSourceName.split('\\').length - 1], vscode.TreeItemCollapsibleState.None, [], infSourcePath, myTreeKind.files, localRoot, refName, '', element.resource);
                        }
                        trees.push(reviewnode);
                        allTreesNode.push(reviewnode);
                    }
                    else if (element.Files[i].fileState === 6) { //Binaries in .inf
                        let infSourceName = currentElement.fileName;
                        let infSourcePath = projectPath + currentElement.fileRoot + infSourceName;
                        let reviewnode: myTreeNode;
                        if (!fs.existsSync(infSourcePath)) {
                            reviewnode = new myTreeNode(infSourceName.split('\\')[infSourceName.split('\\').length - 1], vscode.TreeItemCollapsibleState.None, [], infSourcePath, myTreeKind.error, localRoot, refName, '', element.resource);
                            if (infSourceName.charAt(0) !== '$')
                                {pushToMissingFile(infSourcePath);}
                        }
                        else {
                            reviewnode = new myTreeNode(infSourceName.split('\\')[infSourceName.split('\\').length - 1], vscode.TreeItemCollapsibleState.None, [], infSourcePath, myTreeKind.files, localRoot, refName, '', element.resource);
                        }
                        trees.push(reviewnode);
                        allTreesNode.push(reviewnode);
                    }
                    else if (element.Files[i].fileState === 8) { // Ia32, X64, ... in .inf 
                        let infBinariesFolderName = currentElement.fileName;
                        handleINFBinaries(element.Path, element.Files[i].fileName);
                        let reviewnode: myTreeNode = new myTreeNode(infBinariesFolderName, vscode.TreeItemCollapsibleState.Collapsed, MyTreeProvider.infBinariesFile1, element.Path, myTreeKind.inf, localRoot, refName, '', element);
                        trees.push(reviewnode);
                        let cleanNode: myTreeNode = new myTreeNode('', vscode.TreeItemCollapsibleState.Collapsed, [], '', myTreeKind.inf, '', '', '');
                        allTreesNode.push(cleanNode);
                    }
                    else if (element.Files[i].fileState === 9) {
                        let infBinariesName = currentElement.fileName;
                        let infBinariesPath = projectPath + localRoot + element.RefName + infBinariesName;
                        let reviewnode: myTreeNode;
                        if (!fs.existsSync(infBinariesPath)) {
                            reviewnode = new myTreeNode(infBinariesName.split('\\')[infBinariesName.split('\\').length - 1], vscode.TreeItemCollapsibleState.None, [], infBinariesPath, myTreeKind.error, localRoot, refName, '', element.resource);
                            if (infBinariesName.charAt(0) !== '$')
                                {pushToMissingFile(infBinariesPath);}
                        }
                        else {
                            reviewnode = new myTreeNode(infBinariesName.split('\\')[infBinariesName.split('\\').length - 1], vscode.TreeItemCollapsibleState.None, [], infBinariesPath, myTreeKind.files, localRoot, refName, '', element.resource);
                        }
                        trees.push(reviewnode);
                        allTreesNode.push(reviewnode);
                    }
                    localRoot = element.LocalRoot;
                }
            }
        }
        return new Promise(resolve => {
            return resolve(trees);
        });
    }
}

export function handleDec(elementDecFilePath: any, elementLocalRoot: any) {
    let decFileString = fs.readFileSync(elementDecFilePath, 'utf-8');
    let searchPointPACKAGE_UNI_FILE = decFileString.indexOf('PACKAGE_UNI_FILE');
    MyTreeProvider.decFiles = [];
    if (searchPointPACKAGE_UNI_FILE !== -1) {
        let searchPointN = decFileString.indexOf('\n', searchPointPACKAGE_UNI_FILE);
        let packageUniFile = decFileString.substring(searchPointPACKAGE_UNI_FILE + 16, searchPointN).replace('=', '').trim();
        MyTreeProvider.decFiles.push({ fileName: packageUniFile, fileState: 10, fileRoot: elementLocalRoot });
    }
    let searchPointUserExtensions = decFileString.indexOf('[UserExtensions.TianoCore."ExtraFiles"]');
    if (searchPointUserExtensions !== -1) {
        let userExtensionsBlock = decFileString.substring(searchPointUserExtensions + 39, decFileString.length - 1).replace(/[\n\r]/g, '').trim();
        let splitData: string[] = userExtensionsBlock.split('\n');
        let userExtensions = "";
        for (let i = 0; i < splitData.length; i++) {
            splitData[i] = splitData[i].replace(/[\n\r]/g, '').trim();
            if (splitData[i] !== '')
                {userExtensions = splitData[i];}
            MyTreeProvider.decFiles.push({ fileName: userExtensions, fileState: 10, fileRoot: elementLocalRoot });
        }
    }
}

export function listVeb() {
    let folderFiles: string[] = [];
    let folderFilesUri: vscode.Uri[] = [];
    let inputAsWorkspaceRelativeFolder = vscode.workspace.rootPath;

    if (inputAsWorkspaceRelativeFolder) {
        for (let i = 0; i < fs.readdirSync(inputAsWorkspaceRelativeFolder).length; i++) {
            if (fs.readdirSync(inputAsWorkspaceRelativeFolder)[i].indexOf(".veb") !== -1) {
                folderFiles.push(fs.readdirSync(inputAsWorkspaceRelativeFolder)[i]);
            }
        }
        for (let i = 0; i < folderFiles.length; i++) {
            let file = inputAsWorkspaceRelativeFolder + '\\' + folderFiles[i];
            if (file.charAt(0) === '/') {file = file.substr(1);}
            folderFilesUri[i] = vscode.Uri.parse('file:///' + file);
        }
        for (let i = 0; i < folderFilesUri.length; i++) {
            MyTreeProvider.tree.push(new myTreeNode(folderFiles[i], vscode.TreeItemCollapsibleState.None, [], folderFilesUri[i].path, myTreeKind.veb, '', '', '', folderFilesUri[i]));
        }
    }
}

export function specifyCif(elementAllCifFile: string[], elementCifPath: string, count: number) {
    let cifFile = fs.readFileSync(elementCifPath, 'utf-8'); //讀取element2 cif檔案資料
    let RefName: string;
    let searchPointRefName = cifFile.indexOf(cifFile.match(/\RefName/i));
    let searchPointCommaRefName = cifFile.indexOf("[");
    let searchPointEndComponent = cifFile.indexOf(cifFile.match(/\<endComponent>/i));
    if (searchPointCommaRefName === -1) {
        RefName = cifFile.substring(searchPointRefName + 7, searchPointEndComponent).replace(/[\n\r]/g, '').replace(new RegExp('"', 'g'), '').replace(new RegExp('=', 'g'), '').split('#')[0].trim();
    }
    else {
        RefName = cifFile.substring(searchPointRefName + 7, searchPointCommaRefName).replace(/[\n\r]/g, '').replace(new RegExp('"', 'g'), '').replace(new RegExp('=', 'g'), '').split('#')[0].trim();
    }
    for (let j = 0; j < elementAllCifFile.length; j++) {
        let searchPointParts = elementAllCifFile[j].indexOf(elementAllCifFile[j].match(/\[parts]/i));
        let searchPointLeftParts = elementAllCifFile[j].indexOf('[', searchPointParts + 1);
        let searchPointPartsEndComponent = elementAllCifFile[j].indexOf(elementAllCifFile[j].match(/\<endComponent>/i));
        let splitData: string[] = [];
        if (searchPointParts !== -1) {
            if (searchPointLeftParts !== -1) {
                splitData = cifFileString(elementAllCifFile[j].substring(searchPointParts + 7, searchPointLeftParts).replace(new RegExp('"', 'g'), '').trim().split('\n'));
            }
            else {
                splitData = cifFileString(elementAllCifFile[j].substring(searchPointParts + 7, searchPointPartsEndComponent).replace(new RegExp('"', 'g'), '').trim().split('\n'));
            }
            for (let i = 0; i < splitData.length; i++) {
                splitData[i] = splitData[i].split('#')[0].trim();
                if (RefName.toUpperCase() === splitData[i].toUpperCase()) {
                    openedCifPosition.push(count);
                }
            }
        }
    }
}

export function getLocalRefName(elementAllCifFile: string[], count: number): string[] {
    let LocalRoot: string = "", RefName: string = "";
    let searchPointLocalRoot = elementAllCifFile[count].indexOf(elementAllCifFile[count].match(/\LocalRoot/i));
    let searchPointRefName = elementAllCifFile[count].indexOf(elementAllCifFile[count].match(/\RefName/i));
    let searchPointCommaRefName = elementAllCifFile[count].indexOf('"', searchPointRefName);
    let searchPointCommaRefNameComma = elementAllCifFile[count].indexOf('"', searchPointCommaRefName + 1);
    let searchPointName = elementAllCifFile[count].indexOf(elementAllCifFile[count].match(/\Name/i));
    let searchPointCommaName = elementAllCifFile[count].indexOf('"', searchPointName);
    let searchPointCommaNameComma = elementAllCifFile[count].indexOf('"', searchPointCommaName + 1);
    let name = elementAllCifFile[count].substring(searchPointCommaName + 1, searchPointCommaNameComma);
    if (searchPointLocalRoot !== -1)
        {LocalRoot = elementAllCifFile[count].substring(searchPointLocalRoot + 9, searchPointRefName).replace(/[\n\r]/g, '').replace(new RegExp('"', 'g'), '').replace(new RegExp('=', 'g'), '').split('#')[0].trim();}
    if (searchPointRefName !== -1) {
        RefName = elementAllCifFile[count].substring(searchPointRefName + 7, searchPointCommaRefNameComma).replace(/[\n\r]/g, '').replace(new RegExp('"', 'g'), '').replace(new RegExp('=', 'g'), '').split('#')[0].trim();
    }
    let tmpLocalRef: string[] = [LocalRoot, RefName, name];
    return tmpLocalRef;
}

export function handleParts(elementAllCifFile: string, count: number, index: number): any {
    let filesSoureceFile: string[] = [], partsSoureceFile: string[] = [], INF1SourcesFiles: string[] = [];
    let searchPointFiles = elementAllCifFile.indexOf(elementAllCifFile.match(/\[files]/i));
    let searchPointParts = elementAllCifFile.indexOf(elementAllCifFile.match(/\[parts]/i));
    let searchPointINF = elementAllCifFile.indexOf("[INF]");
    let searchPointEndComponent = elementAllCifFile.indexOf(elementAllCifFile.match(/\<endComponent>/i));
    let searchPointLocalRoot = elementAllCifFile.indexOf(elementAllCifFile.match(/\LocalRoot/i));
    let searchPointCommaLocalRoot = elementAllCifFile.indexOf('"', searchPointLocalRoot);
    let searchPointCommaLocalRootComma = elementAllCifFile.indexOf('"', searchPointCommaLocalRoot + 1);
    //let searchPointCategory = elementAllCifFile.indexOf("category");
    let searchPointCategory = elementAllCifFile.indexOf(elementAllCifFile.match(/\Category/i));
    let searchPointN = elementAllCifFile.indexOf('\n', searchPointCategory);
    let category = elementAllCifFile.substring(searchPointCategory + 8, searchPointN).replace(/[\n\r]/g, '').replace(new RegExp('=', 'g'), '').split('#')[0].trim();
    let localRoot = elementAllCifFile.substring(searchPointCommaLocalRoot + 1, searchPointCommaLocalRootComma).split('#')[0].replace(new RegExp("/", "ig"), "\\");
    let RefName = elementAllCifFile.substring(elementAllCifFile.indexOf(elementAllCifFile.match(/\RefName/i)) + 7, elementAllCifFile.indexOf('\n', elementAllCifFile.indexOf(elementAllCifFile.match(/\RefName/i)))).replace(new RegExp('"', 'g'), '').replace(new RegExp('=', 'g'), '').split('#')[0].trim();
    let searchPointEnd: number = elementAllCifFile.indexOf('[');
    let underfilesBlock: string = "", underpartsBlock: string = "";
    let underINFblock: string = "";
    MyTreeProvider.cifFiles[count] = [];
    //如果有[files]才執行下面的程式
    if (searchPointFiles !== -1) {
        searchPointEnd = elementAllCifFile.indexOf('[', searchPointFiles + 1);
        if (searchPointEnd === -1) {
            underfilesBlock = elementAllCifFile.substring(searchPointFiles + 7, searchPointEndComponent);
            filesSoureceFile = commnaInsideFunction(underfilesBlock);
        }
        else {
            underfilesBlock = elementAllCifFile.substring(searchPointFiles + 7, searchPointEnd);
            filesSoureceFile = commnaInsideFunction(underfilesBlock);
        }
        for (let j = 0; j < filesSoureceFile.length; j++)
            {filesSoureceFile[j] = filesSoureceFile[j].replace(new RegExp("/", "ig"), "\\");}
        for (let i = 0; i < filesSoureceFile.length; i++) {
            MyTreeProvider.cifFiles[count].push({ fileName: filesSoureceFile[i], fileState: 0, fileRoot: localRoot }); // files under .cif
        }
    }
    //如果有[parts]才執行下面的程式
    if (searchPointParts !== -1) {
        searchPointEnd = elementAllCifFile.indexOf('[', searchPointParts + 1);
        if (searchPointEnd === -1) {
            underpartsBlock = elementAllCifFile.substring(searchPointParts + 7, searchPointEndComponent);
            partsSoureceFile = commnaInsideFunction(underpartsBlock);
        }
        else {
            underpartsBlock = elementAllCifFile.substring(searchPointParts + 7, searchPointEnd);
            partsSoureceFile = commnaInsideFunction(underpartsBlock);
        }

        for (let j = 0; j < orphanName.length; j++)
            {if (orphanName[j] === RefName)
                {partsSoureceFile.push(orphanCif[j].substring(orphanCif[j].indexOf(orphanCif[j].match(/\Refname/i)) + 7, orphanCif[j].indexOf('\n', orphanCif[j].indexOf(orphanCif[j].match(/\Refname/i)))).replace(new RegExp('"', 'g'), '').replace(new RegExp('=', 'g'), '').split('#')[0].trim());}}
        for (let i = 0; i < partsSoureceFile.length; i++) {
            for (let j = 0; j < allCifFile.length; j++) {
                let matchResult = allCifFile[j].match(/\RefName/i);
                let searchPointRefName = matchResult !== null ? allCifFile[j].indexOf(matchResult[0]) : -1;
                let searchPointCommaRefName = allCifFile[j].indexOf('"', searchPointRefName);
                let searchPointCommaRefNameComma = allCifFile[j].indexOf('"', searchPointCommaRefName + 1);
                if (partsSoureceFile[i].toUpperCase() === allCifFile[j].substring(searchPointCommaRefName + 1, searchPointCommaRefNameComma).toUpperCase()) {
                    MyTreeProvider.cifFiles[count].push({ fileName: partsSoureceFile[i], fileState: 1, fileRoot: vebCifFile[j] }); // parts under .cif
                    break;
                }
            }
        }
    }
    // 如果有[INF]才執行下面的程式
    if (searchPointINF !== -1) {
        searchPointEnd = elementAllCifFile.indexOf('[', searchPointINF + 1);
        if (searchPointEnd === -1) {
            underINFblock = elementAllCifFile.substring(searchPointINF + 5, searchPointEndComponent);
            INF1SourcesFiles = commnaInsideFunction(underINFblock);
        }
        else {
            underINFblock = elementAllCifFile.substring(searchPointINF + 5, searchPointEnd);
            INF1SourcesFiles = commnaInsideFunction(underINFblock);
        }

        for (let i = 0; i < INF1SourcesFiles.length; i++)
            {MyTreeProvider.cifFiles[count].push({ fileName: INF1SourcesFiles[i], fileState: 2, fileRoot: localRoot });} // INF under .cif
    }
    return category;
}

export function handleINFBinaries(elementPath: any, elementFileName: any) {
    let dataInf = fs.readFileSync(elementPath, 'utf-8'); //read inf
    let dataInfReplace = dataInf.replace(new RegExp("Binaries.", "ig"), '');
    let underBlock: string = "";
    let splitData: string[] = [], soureceFile: string[] = [];
    let indexName = '[' + elementFileName + ']';
    let searchPoint1 = dataInfReplace.indexOf(indexName);
    let searchPoint2 = dataInfReplace.indexOf('[', searchPoint1 + 1);
    MyTreeProvider.infBinariesFile1 = [];
    if (searchPoint2 === -1)
        {searchPoint2 = dataInfReplace.length;}
    if (dataInfReplace.indexOf(indexName) !== -1) {
        underBlock = dataInfReplace.substring(searchPoint1 + indexName.length, searchPoint2);
        splitData = underBlock.split('\n');
        soureceFile = binariesFileString(splitData);
        for (let i = 0; i < soureceFile.length; i++) {
            soureceFile[i] = soureceFile[i].replace(new RegExp("/", "ig"), "\\");
            MyTreeProvider.infBinariesFile1.push({ fileName: soureceFile[i], fileState: 9, fileRoot: elementPath });  //files under Ia32, x64 etc.
        }
    }
}

export function handleINFSource(elementPath: any, elementFileName: any) {
    let dataInf = fs.readFileSync(elementPath, 'utf-8'); //read inf
    let dataInfReplace = dataInf.replace(new RegExp("Sources.", "ig"), '');
    let underBlock: string = "";
    let splitData: string[] = [], soureceFile: string[] = [];
    let indexName = '[' + elementFileName + ']';
    let searchPoint1 = dataInfReplace.indexOf(indexName);
    let searchPoint2 = dataInfReplace.indexOf('[', searchPoint1 + 1);
    MyTreeProvider.infSourcesFiles1 = [];
    if (searchPoint2 === -1)
        {searchPoint2 = dataInfReplace.length - 1;}
    if (dataInfReplace.indexOf(indexName) !== -1) {
        underBlock = dataInfReplace.substring(searchPoint1 + indexName.length, searchPoint2);
        splitData = underBlock.split('\n');
        soureceFile = sourcesFileString(splitData);
        for (let i = 0; i < soureceFile.length; i++) {
            soureceFile[i] = soureceFile[i].replace(new RegExp("/", "ig"), "\\");
            MyTreeProvider.infSourcesFiles1.push({ fileName: soureceFile[i], fileState: 5, fileRoot: elementPath });  //files under Ia32, x64 etc.
        }
    }
}

export function handleINF(elementLocalRoot: any, elementInfName: any, count: number): string {
    let infPath = projectPath + elementLocalRoot + elementInfName;
    infPath = infPath.replace(new RegExp("/", "ig"), "\\");
    let dataInf = fs.readFileSync(infPath, 'utf-8'); //read inf
    let baseName: string = dataInf.substring(dataInf.indexOf("BASE_NAME") + 9, dataInf.indexOf('\n', dataInf.indexOf("BASE_NAME"))).replace(new RegExp("=", "ig"), "").trim();
    let inBlock: string = "", underBlock: string = "", Sources: string = "Sources", Binaries: string = 'Binaries', inBlockdotFolder: string = "", inBlockCommaFolder: string[] = [];
    let searchPointSources = 0, searchPointSourcesRight = 0, searchPointSourcesLeft = 0, endPoint = 0;
    let searchPointBinaries = 0, searchPointBinariesRight = 0, searchPointBinariesLeft = 0;
    let splitData: string[] = [], soureceFile: string[] = [];
    MyTreeProvider.infFiles[count] = [];
    while (endPoint !== -1) {
        searchPointSources = dataInf.indexOf(dataInf.match(/\[sources/i), searchPointSourcesRight);
        if (searchPointSources === -1)
            {break;}
        searchPointSourcesRight = dataInf.indexOf(']', searchPointSources);
        let shopCheck = dataInf.substring(dataInf.lastIndexOf('\n', searchPointSources), searchPointSources).trim();
        if (shopCheck === '#')
            {continue;}
        inBlock = dataInf.substring(searchPointSources + 1, searchPointSourcesRight);
        searchPointSourcesLeft = dataInf.indexOf('[', searchPointSourcesRight);
        if (searchPointSourcesLeft === -1) {
            searchPointSourcesLeft = dataInf.length;
            endPoint = -1;
        }
        if (dataInf.lastIndexOf('\n') - 1 !== dataInf.length)
            {underBlock = dataInf.substring(searchPointSourcesRight + 1, searchPointSourcesLeft);}
        if (inBlock.toUpperCase() === Sources.toUpperCase()) {
            splitData = underBlock.split('\n');
            soureceFile = sourcesFileString(splitData);
            for (let i = 0; i < soureceFile.length; i++) {
                let tmpElementLocalRoot = elementLocalRoot + elementInfName.replace(new RegExp("/", "ig"), "\\");
                soureceFile[i] = soureceFile[i].replace(new RegExp("/", "ig"), "\\");
                if (soureceFile[i].indexOf('..\\') !== -1) { // 有..
                    let tmpName = soureceFile[i].split('\\');
                    let dotCount: number = 0;
                    soureceFile[i] = "";
                    for (let j = 0; j < tmpName.length - 1; j++) {
                        if (tmpName[j] === '..')
                            {dotCount++;}
                        else
                            {soureceFile[i] += tmpName[j] + '\\';}
                    }
                    soureceFile[i] += tmpName[tmpName.length - 1];
                    let tmpLocalRootSplit = tmpElementLocalRoot.split('\\');
                    let tmpLocalRoot: string[] = [];
                    for (let j = 0, k = 0; j < tmpLocalRootSplit.length - 1; j++) {
                        if (tmpLocalRootSplit[j] !== "") {
                            tmpLocalRoot[k] = tmpLocalRootSplit[j];
                            k++;
                        }
                    }
                    tmpElementLocalRoot = "";
                    for (let j = 0; j < tmpLocalRoot.length - dotCount; j++) {
                        tmpElementLocalRoot += tmpLocalRoot[j] + '\\';
                    }
                }
                else { //沒有..
                    let tmpLocalRootSplit = tmpElementLocalRoot.split('\\');
                    let tmpLocalRoot: string[] = [];
                    for (let j = 0, k = 0; j < tmpLocalRootSplit.length - 1; j++) {
                        if (tmpLocalRootSplit[j] !== "") {
                            tmpLocalRoot[k] = tmpLocalRootSplit[j];
                            k++;
                        }
                    }
                    tmpElementLocalRoot = "";
                    for (let j = 0; j < tmpLocalRoot.length; j++) {
                        tmpElementLocalRoot += tmpLocalRoot[j] + '\\';
                    }
                    if (soureceFile[i].split('\\').length > 1) {
                        for (let j = 0; j < soureceFile[i].split('\\').length - 1; j++)
                            {tmpElementLocalRoot += soureceFile[i].split('\\')[j] + '\\';} // only path without file name
                        soureceFile[i] = soureceFile[i].split('\\')[soureceFile[i].split('\\').length - 1]; // only file name
                    }
                }
                MyTreeProvider.infFiles[count].push({ fileName: soureceFile[i], fileState: 3, fileRoot: tmpElementLocalRoot }); // files under .inf
            }
        }
        else {
            inBlockCommaFolder = inBlock.split(',');
            if (inBlockCommaFolder.length < 2) { //只有一個 ex:[Sources.Ia32]
                inBlockdotFolder = inBlockCommaFolder[0].split('.')[1]; // Ia32, X64 ...
                splitData = underBlock.split('\n');
                soureceFile = sourcesFileString(splitData);
                MyTreeProvider.infFiles[count].push({ fileName: inBlockdotFolder, fileState: 4, fileRoot: elementLocalRoot }); // Ia32, x64 etc.       
            }
            else { //多個 ex:[Sources.Ia32, Sources.EBC, Sources.ARM, Sources.AARCH64]
                inBlockdotFolder = inBlock.replace(new RegExp("Sources.", "ig"), "");
                splitData = underBlock.split('\n');
                soureceFile = sourcesFileString(splitData);
                MyTreeProvider.infFiles[count].push({ fileName: inBlockdotFolder, fileState: 4, fileRoot: elementLocalRoot });
            }
        }
    }
    endPoint = 0;
    while (endPoint !== -1) {
        searchPointBinaries = dataInf.indexOf(dataInf.match(/\[binaries/i), searchPointBinariesRight);
        if (searchPointBinaries === -1)
            {break;}
        searchPointBinariesRight = dataInf.indexOf(']', searchPointBinaries);
        let shopCheck = dataInf.substring(dataInf.lastIndexOf('\n', searchPointBinaries), searchPointBinaries).trim();
        if (shopCheck === '#')
            {continue;}
        inBlock = dataInf.substring(searchPointBinaries + 1, searchPointBinariesRight);
        searchPointBinariesLeft = dataInf.indexOf('[', searchPointBinariesRight);
        if (searchPointBinariesLeft === -1) {
            searchPointBinariesLeft = dataInf.length;
            endPoint = -1;
        }
        underBlock = dataInf.substring(searchPointBinariesRight + 1, searchPointBinariesLeft);
        if (inBlock.toUpperCase() === Binaries.toUpperCase()) {
            splitData = underBlock.split('\n');
            soureceFile = binariesFileString(splitData);
            for (let i = 0; i < soureceFile.length; i++) {
                let tmpElementLocalRoot = elementLocalRoot + elementInfName.replace(new RegExp("/", "ig"), "\\");
                soureceFile[i] = soureceFile[i].replace(new RegExp("/", "ig"), "\\");
                if (soureceFile[i].indexOf('..\\') !== -1) {
                    let tmpName = soureceFile[i].split('\\');
                    let dotCount: number = 0;
                    soureceFile[i] = "";
                    for (let j = 0; j < tmpName.length - 1; j++) {
                        if (tmpName[j] === '..')
                            {dotCount++;}
                        else
                            {soureceFile[i] += tmpName[j] + '\\';}
                    }
                    soureceFile[i] += tmpName[tmpName.length - 1];
                    let tmpLocalRootSplit = tmpElementLocalRoot.split('\\');
                    let tmpLocalRoot: string[] = [];
                    for (let j = 0, k = 0; j < tmpLocalRootSplit.length; j++) {
                        if (tmpLocalRootSplit[j] !== "") {
                            tmpLocalRoot[k] = tmpLocalRootSplit[j];
                            k++;
                        }
                    }
                    tmpElementLocalRoot = "";
                    for (let j = 0; j < tmpLocalRoot.length - dotCount; j++) {
                        tmpElementLocalRoot += tmpLocalRoot[j] + '\\';
                    }
                }
                else { //沒有..
                    let tmpLocalRootSplit = tmpElementLocalRoot.split('\\');
                    let tmpLocalRoot: string[] = [];
                    for (let j = 0, k = 0; j < tmpLocalRootSplit.length - 1; j++) {
                        if (tmpLocalRootSplit[j] !== "") {
                            tmpLocalRoot[k] = tmpLocalRootSplit[j];
                            k++;
                        }
                    }
                    tmpElementLocalRoot = "";
                    for (let j = 0; j < tmpLocalRoot.length; j++) {
                        tmpElementLocalRoot += tmpLocalRoot[j] + '\\';
                    }
                    if (soureceFile[i].split('\\').length > 1) {
                        for (let j = 0; j < soureceFile[i].split('\\').length - 1; j++)
                            {tmpElementLocalRoot += soureceFile[i].split('\\')[j] + '\\';} // only path without file name
                        soureceFile[i] = soureceFile[i].split('\\')[soureceFile[i].split('\\').length - 1]; // only file name
                    }
                }
                MyTreeProvider.infFiles[count].push({ fileName: soureceFile[i], fileState: 6, fileRoot: tmpElementLocalRoot }); // files under .inf
            }
        } else {
            inBlockCommaFolder = inBlock.split(',');
            if (inBlockCommaFolder.length < 2) { //只有一個 ex:[Binaries.Ia32]
                inBlockdotFolder = inBlockCommaFolder[0].split('.')[1]; // Ia32, X64 ...
                splitData = underBlock.split('\n');
                soureceFile = binariesFileString(splitData);
                MyTreeProvider.infFiles[count].push({ fileName: inBlockdotFolder, fileState: 8, fileRoot: elementLocalRoot }); // Ia32, x64 etc.       
            }
            else { //多個 ex:[Binaries.Ia32, Binaries.EBC, Binaries.ARM, Binaries.AARCH64]
                inBlockdotFolder = inBlock.replace(new RegExp("binaries.", "ig"), "");
                splitData = underBlock.split('\n');
                soureceFile = binariesFileString(splitData);
                MyTreeProvider.infFiles[count].push({ fileName: inBlockdotFolder, fileState: 8, fileRoot: elementLocalRoot });
            }
        }
    }
    return baseName;
}

export function commnaInsideFunction(element: any): string[] {
    let leftComma, rightCommna, commnaInside;
    let filesSplitData: string[] = [];
    let tmpelement = element.split('\n');
    element = "";
    for (let i = 0; i < tmpelement.length; i++) {
        if (tmpelement[i].split("=").length > 1)
            {element += tmpelement[i].split("=")[0] + '\n';}
        else if (tmpelement[i].split(";").length > 1)
            {element += tmpelement[i].split(";")[0] + '\n';}
        else
            {element += tmpelement[i];}
    }
    leftComma = element.indexOf('"', 0);
    rightCommna = element.indexOf('"', leftComma + 1);
    while (leftComma !== -1) {
        commnaInside = element.substring(leftComma + 1, rightCommna);
        filesSplitData.push(commnaInside);
        leftComma = element.indexOf('"', rightCommna + 1);
        rightCommna = element.indexOf('"', leftComma + 1);
    }
    return filesSplitData;
}

export function pushToMissingFile(element: any) {
    missingFile.push(`\n"${element}" file does *not* exist`);
    fs.writeFile(vscode.workspace.rootPath + '\\.vscode\\Missing_File_Log.txt', missingFile.toString(), function (err) {
        if (err)
            {return console.error(err);}
    });
}

export function binariesFileString(element1: any): string[] {
    let tmp: string[] = [], tmp2: string[] = [], tmp3: string[] = [];
    let soureceFile: string[] = [];
    tmp = element1;
    for (let i = 0; i < tmp.length; i++) {
        tmp[i] = tmp[i].trim().replace(/[\n\r]/g, '');
        if (tmp[i].charAt(0) === '#') {
            tmp[i] = "";
            continue;
        }
        let searchPoint1 = tmp[i].indexOf('|');
        let searchPoint2 = tmp[i].indexOf('|', searchPoint1 + 1);
        if (searchPoint2 !== -1)
            {tmp2[i] = tmp[i].substring(searchPoint1 + 1, searchPoint2);}
        else
            {tmp2[i] = tmp[i].substring(searchPoint1 + 1, tmp[i].length);}
        tmp3 = tmp2[i].split('#');
        if (tmp3.length > 1)
            {tmp2[i] = tmp3[0].trim();}
        if (tmp2[i] !== "")
            {if (tmp2[i].indexOf('$') !== 0)
                {soureceFile.push(tmp2[i].trim());}}
    }
    return soureceFile;
}

export function partsFileString(element1: any): string[] {
    let tmp: string[] = [], tmp2: string[] = [];
    let soureceFile: string[] = [];
    tmp = element1;
    for (let i = 0; i < tmp.length; i++) {
        tmp[i] = tmp[i].trim();
        if (tmp[i].charAt(0) === '#') {
            tmp[i] = "";
            continue;
        }
        tmp2 = tmp[i].split('#');
        if (tmp2.length > 1)
            {tmp[i] = tmp2[0].trim();}
        if (tmp[i] !== '') {
            if (tmp[i].split('=').length > 1)
                {tmp[i] = tmp[i].split('=')[0].trim();}
            soureceFile.push(tmp[i]);
        }

    }
    return soureceFile;
}

export function sourcesFileString(element1: any): string[] {
    let tmp: string[] = [], tmp2: string[] = [];
    let soureceFile: string[] = [];
    tmp = element1;
    for (let i = 0; i < tmp.length; i++) {
        tmp[i] = tmp[i].trim();
        if (tmp[i].charAt(0) === '#') {
            tmp[i] = "";
            continue;
        }
        tmp2 = tmp[i].split('|');
        if (tmp2.length < 1) {
            tmp[i] = tmp[i].trim().replace(/[\n\r]/g, '');
        }
        else {
            tmp[i] = tmp2[0].trim().replace(/[\n\r]/g, '');
        }
        tmp2 = tmp[i].split('#');
        if (tmp2.length > 1)
            {tmp[i] = tmp2[0].trim();}
        if (tmp[i] !== '') {
            if (tmp[i].indexOf('$') !== 0)
                {soureceFile.push(tmp[i]);}
        }
    }
    return soureceFile;
}

export function cifFileString(element1: any): string[] {
    let tmp: string[] = [];
    let cifString: string[] = [];
    tmp = element1;
    for (let i = 0; i < tmp.length; i++) {
        tmp[i] = tmp[i].trim().substring(0, tmp[i].length);
        if (tmp[i] !== "")
            {cifString.push(tmp[i]);}
    }
    return cifString;
}

export function handleOrphan(elementCifPath: any) {
    const dataCif = fs.readFileSync(elementCifPath, 'utf-8'); // read cif
    let orphan: string = "";
    
    const orphanMatch = dataCif.match(/\Orphan/i);
    
    if (orphanMatch !== null) {
        const orphanIndex = dataCif.indexOf(orphanMatch[0]);
        
        if (orphanIndex !== -1) {
            orphan = dataCif.substring(orphanIndex + 6, dataCif.indexOf('\n', orphanIndex)).replace(/=/g, '').split('#')[0].trim();
            orphanCif.push(dataCif);
            orphanName.push(orphan);
        }
    }
}

export function handleCif(elementCifPath: any, elementVebCifFile: any, index: number, count: number) {
    let infList: string[] = [], fileList: string[] = [], partsList: string[] = [];
    let dataCif = fs.readFileSync(elementCifPath, 'utf-8'); // read cif
    let dataCifReplace = dataCif;
    if (dataCif.indexOf("Orphan") !== -1) {
        return 1;
    }
    let categoryMatch = dataCifReplace.match(/\Category/i);
    let dataCategory = categoryMatch !== null ? dataCifReplace.indexOf(categoryMatch[0]) : -1;

    let nameMatch = dataCifReplace.match(/\Name/i);
    let dataName = nameMatch !== null ? dataCifReplace.indexOf(nameMatch[0]) : -1;
    
    let refNameMatch = dataCifReplace.match(/\RefName/i);
    let dataRefName = refNameMatch !== null ? dataCifReplace.indexOf(refNameMatch[0]) : -1;
    
    let dataINF = dataCifReplace.indexOf("[INF]");

    let filesMatch = dataCifReplace.match(/\[files]/i);
    let dataFiles = filesMatch !== null ? dataCifReplace.indexOf(filesMatch[0]) : -1;

    let partsMatch = dataCifReplace.match(/\[parts]/i);
    let dataParts = partsMatch !== null ? dataCifReplace.indexOf(partsMatch[0]) : -1;

    let endComponentMatch = dataCifReplace.match(/\<endComponent>/i);
    let dataEndComponent = endComponentMatch !== null ? dataCifReplace.indexOf(endComponentMatch[0]) : -1;

    let datan = dataCifReplace.indexOf('\n', dataCategory);
    let category = dataCifReplace.substring(dataCategory + 11, datan).replace(/[\n\r]/g, '').split('#')[0].trim();
    let searchPointEnd: number = dataCifReplace.indexOf('[');
    let localRoot = "";
    elementVebCifFile = elementVebCifFile.split('.')[0] + '.cif';
    if (elementVebCifFile.lastIndexOf('\\', elementVebCifFile.indexOf('.cif')) !== -1)
        {localRoot = elementVebCifFile.substring(0, elementVebCifFile.lastIndexOf('\\', elementVebCifFile.indexOf('.cif')) + 1);}
    if (localRoot.lastIndexOf('\\') !== localRoot.length - 1)
        {localRoot += '\\';}
    let resourcePath = projectPath + localRoot;
    let resourceUri = vscode.Uri.parse('file:///' + resourcePath);
    datan = dataCifReplace.indexOf('\n', dataRefName);
    let refName = dataCifReplace.substring(dataRefName + 7, datan).replace(/[\n\r]/g, '').replace(new RegExp('=', 'g'), '').replace(new RegExp('"', 'g'), '').split('#')[0].trim();
    datan = dataCifReplace.indexOf('\n', dataName);
    let name = dataCifReplace.substring(dataName + 4, datan).replace(/[\n\r]/g, '').replace(new RegExp('=', 'g'), '').replace(new RegExp('"', 'g'), '').split('#')[0].trim();
    let splitData: string;
    MyTreeProvider.files[index] = [];
    if (searchPointEnd === -1) {
        refName = dataCifReplace.substring(dataRefName + 10, dataEndComponent).replace(/[\n\r]/g, '').replace(new RegExp('"', 'g'), '').split('#')[0].trim();
    }
    if (dataFiles !== -1) // [files]
    {
        searchPointEnd = dataCifReplace.indexOf('[', dataFiles + 1);
        if (searchPointEnd !== -1) {
            splitData = dataCifReplace.substring(dataFiles + 7, searchPointEnd);
            fileList = commnaInsideFunction(splitData);
        }
        else {
            splitData = dataCifReplace.substring(dataFiles + 7, dataEndComponent);
            fileList = commnaInsideFunction(splitData);
        }
        for (let i = 0; i < fileList.length; i++) {
            MyTreeProvider.files[index].push({ fileName: fileList[i], fileState: 0, fileRoot: localRoot });
        }
    }
    if (dataParts !== -1) // [parts]
    {
        searchPointEnd = dataCifReplace.indexOf('[', dataParts + 1);
        if (searchPointEnd !== -1) {
            splitData = dataCifReplace.substring(dataParts + 7, searchPointEnd);
            partsList = commnaInsideFunction(splitData);
        }
        else {
            splitData = dataCifReplace.substring(dataParts + 7, dataEndComponent);
            partsList = commnaInsideFunction(splitData);
        }

        for (let j = 0; j < orphanName.length; j++){
            if (orphanName[j] === refName){
                partsList.push(orphanCif[j].substring(orphanCif[j].indexOf(orphanCif[j].match(/\RefName/i)) + 7, orphanCif[j].indexOf('\n', orphanCif[j].indexOf(orphanCif[j].match(/\RefName/i)))).replace(new RegExp('"', 'g'), '').replace(new RegExp('=', 'g'), '').split('#')[0].trim());
            }
        }
        for (let i = 0; i < partsList.length; i++) {
            for (let j = 0; j < allCifFile.length; j++) {
                let matchResult = allCifFile[j].match(/\RefName/i);
                let searchPointRefName = matchResult !== null ? allCifFile[j].indexOf(matchResult[0]) : -1;
                let searchPointCommaRefName = allCifFile[j].indexOf('"', searchPointRefName);
                let searchPointCommaRefNameComma = allCifFile[j].indexOf('"', searchPointCommaRefName + 1);
                if (partsList[i].toUpperCase() === allCifFile[j].substring(searchPointCommaRefName + 1, searchPointCommaRefNameComma).toUpperCase()) {
                    MyTreeProvider.files[index].push({ fileName: partsList[i], fileState: 1, fileRoot: vebCifFile[j] });
                    break;
                }
            }
        }
    }
    if (dataINF !== -1) // [INF]
    {
        searchPointEnd = dataCifReplace.indexOf('[', dataINF + 1);
        if (searchPointEnd !== -1) {
            splitData = dataCifReplace.substring(dataINF + 5, searchPointEnd);
            infList = commnaInsideFunction(splitData);
        }
        else {
            splitData = dataCifReplace.substring(dataINF + 5, dataEndComponent);
            infList = commnaInsideFunction(splitData);
        }

        for (let i = 0; i < infList.length; i++)
            {MyTreeProvider.files[index].push({ fileName: infList[i], fileState: 2, fileRoot: localRoot });}
    }
    MyTreeProvider.tree.push(new myTreeNode(name, vscode.TreeItemCollapsibleState.Collapsed, MyTreeProvider.files[index], elementCifPath, myTreeKind.cif, localRoot, refName, category, resourceUri));
    return 0;
}

export enum myTreeKind {
    cif,
    files,
    inf,
    veb,
    dec,
    error
}

export interface myTreeFilesNode {
    fileName: string; //name, but in .cif is refname
    fileState: number; //in .cif{files:0, parts:1, INF:2} in .inf{sources files:3 , sources folders:4, sources folders files:5, Binaries: 6, Binaries folders:8, Binaries folders files: 9} .veb : 7
    fileRoot: string;
}

export class myTreeNode extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly Files: myTreeFilesNode[],
        public readonly Path: string,
        public readonly kind: myTreeKind,
        public readonly LocalRoot: string,
        public readonly RefName: string,
        public readonly category: string,
        public readonly resource?: myTreeNode | vscode.Uri
    ) {
        super(label, collapsibleState);
    }
}