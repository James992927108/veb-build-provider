// src/utils/logger.ts
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let outputChannel: vscode.OutputChannel;
let logStream: fs.WriteStream | undefined;

/**
 * Initialize logger, must be called once in activate(context)
 */
export function initLogger(context: vscode.ExtensionContext) {
    outputChannel = vscode.window.createOutputChannel('veb-build-provider');

    // Generate log file name
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const fileName = `log-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}.txt`;

    // Get log directory (ensure it exists)
    const logDir = context.logUri.fsPath;
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    const logPath = path.join(logDir, fileName);

    logStream = fs.createWriteStream(logPath, { flags: 'a', encoding: 'utf8' });
    logMessage(`Logger initialized, writing to ${logPath}`);
}

/**
 * Output message to Output Channel and log file
 */
export function logMessage(message: string) {
    const now = new Date();
    const timestamp = now.toISOString();
    const fullMsg = `[${timestamp}] ${message}`;
    if (outputChannel) {
        outputChannel.appendLine(fullMsg);
    }
    if (logStream) {
        logStream.write(fullMsg + '\n');
    }
}

/**
 * Output error message
 */
export function handleError(error: any) {
    const msg = error instanceof Error ? error.stack || error.message : String(error);
    logMessage(`ERROR: ${msg}`);
}

/**
 * Close log stream
 */
export function disposeLogger() {
    if (logStream) {
        logStream.end();
        logStream = undefined;
    }
    if (outputChannel) {
        outputChannel.dispose();
    }
}

// Export for extension.ts
export { outputChannel };
