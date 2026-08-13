// src/utils/logger.ts
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let outputChannel: vscode.OutputChannel;
let logStream: fs.WriteStream | undefined;

// Simplified log levels
export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    SUMMARY = 4
}

// Developers can modify log level directly here
// Release version should be set to LogLevel.INFO
// Development debugging can be set to LogLevel.DEBUG or other levels
// 
// LogLevel.DEBUG - Show all information, including "Excluded by pattern" and other detailed info
// LogLevel.INFO - Show general information (release version default)
// LogLevel.WARN - Show only warnings and errors
// LogLevel.ERROR - Show only errors
// LogLevel.SUMMARY - Show only important stage summary information
const CURRENT_LOG_LEVEL: LogLevel = LogLevel.INFO;

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
    logInfo(`Logger initialized, writing to ${logPath}`);
}

/**
 * Output message to Output Channel and log file with level control
 */
export function logMessage(message: string, level: LogLevel = LogLevel.INFO) {
    // Check log level
    if (level < CURRENT_LOG_LEVEL) {
        return;
    }

    const now = new Date();
    const timestamp = now.toISOString();
    const levelName = LogLevel[level];
    const fullMsg = `[${timestamp}] [${levelName}] ${message}`;
    
    if (outputChannel) {
        outputChannel.appendLine(fullMsg);
    }
    if (logStream) {
        logStream.write(fullMsg + '\n');
    }
}

// Convenience functions
export function logDebug(message: string) {
    logMessage(message, LogLevel.DEBUG);
}

export function logInfo(message: string) {
    logMessage(message, LogLevel.INFO);
}

export function logWarn(message: string) {
    logMessage(message, LogLevel.WARN);
}

export function logError(message: string) {
    logMessage(message, LogLevel.ERROR);
}

export function logSummary(message: string) {
    logMessage(message, LogLevel.SUMMARY);
}

export function logMessageWithLevel(message: string, level: 'info' | 'warn') {
    if (level === 'warn') {
        vscode.window.showWarningMessage(message);
        logMessage(`Warning: ${message}`, LogLevel.WARN);
    } else {
        vscode.window.showInformationMessage(message);
        logMessage(message, LogLevel.INFO);
    }
}

/**
 * Output error message
 */
export function handleError(error: any) {
    const msg = error instanceof Error ? error.stack || error.message : String(error);
    logMessage(`ERROR: ${msg}`, LogLevel.ERROR);
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
