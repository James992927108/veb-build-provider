import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';
import { logMessage, handleError, outputChannel } from '../utils/logger';
import { spawn } from 'child_process';
import { EXTENSION_ID } from '../constants';

// 處理擴展 Makefile 變數的函數
export async function expandMakefileVars(): Promise<void> {
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