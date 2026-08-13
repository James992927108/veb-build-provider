// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import { logDebug, handleError, outputChannel } from '../../shared/utils/logger';

export class Edk2Parser {
    static removeHashTagComment(line: string): string {
        return line.replace(/#.*/g, '')   // comments
            .replace(/^\s*/g, '')           // front blank
            .replace(/[\s]*$/g, '');        // tail blank
    }

    static parseSection(content: string, sectionName: string): string[] {
        const lines = content.split('\n');
        const result: string[] = [];
        let inSection = false;
        
        for (const line of lines) {
            const cleanLine = this.removeHashTagComment(line);
            
            if (cleanLine.match(new RegExp(`\\[${sectionName}[\\w\\.]*\\]`, 'i'))) {
                inSection = true;
                continue;
            }
            
            if (inSection) {
                if (cleanLine.startsWith('[')) {
                    break; // Next section
                }
                
                if (cleanLine.length > 0) {
                    result.push(cleanLine);
                }
            }
        }
        
        return result;
    }

    static parseKeyValue(content: string, key: string): string | null {
        const match = content.match(new RegExp(`^\\s*${key}\\s*=\\s*(.+)$`, 'm'));
        return match ? this.removeHashTagComment(match[1]) : null;
    }

    static parseArchitectures(content: string): string[] {
        const archString = this.parseKeyValue(content, 'SUPPORTED_ARCHITECTURES');
        if (!archString) {
            return ['IA32', 'X64'];
        }
        
        const architectures: string[] = [];
        const supportedArchs = ['IA32', 'X64', 'ARM', 'AARCH64', 'RISCV64'];
        
        for (const arch of supportedArchs) {
            if (archString.includes(arch)) {
                architectures.push(arch);
            }
        }
        
        return architectures.length > 0 ? architectures : ['IA32', 'X64'];
    }

    static searchPatternInFiles(files: string[], basePath: string, pattern: string): vscode.Location | null {
        for (const file of files) {
            const fullPath = basePath + file;
            if (!fs.existsSync(fullPath)) {
                continue;
            }

            const reg = new RegExp('.*' + pattern + '.*');
            const lines = fs.readFileSync(fullPath, 'utf8').split('\n');
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].match(reg)) {
                    return new vscode.Location(vscode.Uri.file(fullPath), new vscode.Position(i, 0));
                }
            }
        }
        return null;
    }

    static getRootPath(): string[] {
        if (vscode.workspace.workspaceFolders) {
            const config = vscode.workspace.getConfiguration('vebBuild.language');
            const folder: string[] = [vscode.workspace.workspaceFolders[0].uri.fsPath];

            if (config.has('root.extend.path')) {
                const s: string = config.get('root.extend.path') + '';
                const cleaned = s.replace(/\s/g, ''); // replace does not mutate; capture result
                cleaned.split(',').forEach(function (v) {
                    const rel = v.trim();
                    if (rel.length > 0) {
                        folder.push(vscode.workspace.workspaceFolders![0].uri.fsPath + '/' + rel);
                    }
                });
            }
            return folder;
        }
        return [];
    }
}

export class Common {
    static removeHashTagComment = Edk2Parser.removeHashTagComment;
    static getRootPath = Edk2Parser.getRootPath;
    static searchPatternInFiles = Edk2Parser.searchPatternInFiles;

    static pushMatchContent(file: vscode.TextDocument, start: number, end: number, associate_files: string[]): number {
        for (; start < end; start++) {
            let content = Common.removeHashTagComment(file.lineAt(start).text);
            if (content.length > 0) {
                if (content[0] === '[') {
                    break;
                } else {
                    associate_files.push(content);
                }
            }
        }
        return start - 1; // reparse this line for next loop
    }
}
