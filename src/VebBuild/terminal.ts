import * as vscode from 'vscode';
import { logMessage, handleError, outputChannel } from '../utils/logger';

export function handleterminateTerminal(): void {
    logMessage("Starting handleterminateTerminal");
    const activeTerminal = vscode.window.activeTerminal;

    if (activeTerminal) {
        activeTerminal.sendText("\x03"); // Ctrl+C ASCII code
        logMessage("Sent Ctrl+C to active terminal");
        vscode.window.showInformationMessage("Sent Ctrl+C to the active terminal.");
    } else {
        logMessage("No active terminal to terminate");
        vscode.window.showWarningMessage("No active terminal to send Ctrl+C.");
    }
}