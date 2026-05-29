// src/agent-config/commands/agentConfigCommands.ts

import * as vscode from 'vscode';
import * as os from 'os';
import * as path from 'path';
import { spawn } from 'child_process';
import { logError, logDebug, outputChannel } from '../../shared/utils/logger';
import { registerCommandWithLog } from '../../shared/utils/commandRegistry';

// Single-user tool: path hardcoded to ~/Desktop/Anthony/my-agent-configs
const AGENT_CONFIGS_ROOT = path.join(os.homedir(), 'Desktop', 'Anthony', 'my-agent-configs');
const PROJECT_NAME = 'GBNvl72';

function getWorkspacePath(): string {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        logError('Agent Config Sync: No workspace folder open.');
        vscode.window.showErrorMessage('Agent Config Sync: No workspace folder open.');
        return '';
    }
    return workspaceFolder.uri.fsPath;
}

async function runAgentScript(scriptName: string, projectPath: string, title: string): Promise<void> {
    const scriptPath = path.join(AGENT_CONFIGS_ROOT, 'scripts', scriptName);
    outputChannel.show();
    outputChannel.appendLine(`\n[Agent Config] ${title}`);

    await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title, cancellable: false },
        () => new Promise<void>((resolve, reject) => {
            const proc = spawn('bash', [scriptPath, projectPath, PROJECT_NAME], {
                cwd: AGENT_CONFIGS_ROOT,
                env: process.env,
            });

            proc.stdout.on('data', (data: Buffer) => outputChannel.append(data.toString()));
            proc.stderr.on('data', (data: Buffer) => outputChannel.append(data.toString()));

            proc.on('close', (code: number | null) => {
                if (code === 0) {
                    outputChannel.appendLine('[Agent Config] Done.');
                    vscode.window.showInformationMessage(`${title} — done.`);
                    resolve();
                } else {
                    const msg = `Agent Config Sync failed (exit ${code}). See Output panel.`;
                    logError(msg);
                    vscode.window.showErrorMessage(msg);
                    resolve();
                }
            });

            proc.on('error', (err: Error) => {
                const msg = `Failed to start script: ${err.message}`;
                logError(msg);
                vscode.window.showErrorMessage(msg);
                reject(err);
            });
        })
    );
}

export function registerAgentConfigCommands(context: vscode.ExtensionContext): void {
    logDebug('Registering Agent Config commands');

    registerCommandWithLog(context, 'vebBuild.agentConfig.pull', async () => {
        const projectPath = getWorkspacePath();
        if (!projectPath) { return; }
        await runAgentScript('pull-configs.sh', projectPath, 'Pulling agent configs (GitHub → local)');
    });

    registerCommandWithLog(context, 'vebBuild.agentConfig.push', async () => {
        const projectPath = getWorkspacePath();
        if (!projectPath) { return; }
        await runAgentScript('push-configs.sh', projectPath, 'Pushing agent configs (local → GitHub)');
    });
}
