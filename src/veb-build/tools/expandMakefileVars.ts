import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';
import { logInfo, logDebug, logError, handleError, outputChannel } from '../../shared/utils/logger';
import { spawn } from 'child_process';
import { EXTENSION_ID } from '../../shared/utils/constants';

/**
 * Function to expand Makefile variables.
 */
export async function expandMakefileVars(): Promise<void> {
    // Get the currently active editor
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage("No active editor found.");
        logError("No active editor found.");
        return;
    }

    const filePath = editor.document.uri.fsPath; // e.g. "build\token.mak"
    const fileDir = path.dirname(filePath); // Extract directory "build"

    logDebug(`Starting expandMakefileVars for file: ${filePath}`);

    const vebExtension = vscode.extensions.getExtension(EXTENSION_ID);
    if (!vebExtension) {
        vscode.window.showErrorMessage("Unable to get VEB build provider extension");
        return;
    }
    const pythonScriptPath = path.join(vebExtension.extensionPath, "out", "scripts", "ExpandMakefileVars.py");

    try {
        await fs.access(pythonScriptPath);
    } catch {
        vscode.window.showErrorMessage(`Python script not found at: ${pythonScriptPath}`);
        logError(`Python script not found at: ${pythonScriptPath}`);
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
            logInfo(`Successfully processed ${filePath}: ${stdoutData}`);
            vscode.window.showInformationMessage(`Expanded Makefile variables for ${path.basename(filePath)}`);
        } else {
            logError(`Error processing ${filePath}: ${stderrData}`);
            vscode.window.showErrorMessage(`Failed to expand Makefile variables: ${stderrData}`);
        }
    });
}