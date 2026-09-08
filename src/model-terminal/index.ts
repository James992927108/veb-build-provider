import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { spawnSync } from 'child_process';
import { configureBashrc, configureLauncher, shellQuote, tabSettings } from './configure';

interface FileEdit { file: string; before: string; after: string; mode: number; }

function validateBash(text: string, label: string): void {
    const result = spawnSync('/bin/bash', ['-n'], { input: text, encoding: 'utf8', timeout: 5000 });
    if (result.error || result.status !== 0) {
        throw new Error(`${label}: bash -n failed: ${result.error?.message ?? result.stderr}`);
    }
}

function launcherPath(): string {
    const configured = vscode.workspace.getConfiguration('vebBuild.modelTerminal').get<string>('launcherPath', '~/.local/bin/claude-cli');
    const expanded = configured.startsWith('~/') ? path.join(os.homedir(), configured.slice(2)) : configured;
    if (!path.isAbsolute(expanded)) { throw new Error('Model launcherPath must be absolute or start with ~/.'); }
    return expanded;
}

function checkEnvironment(): void {
    if (process.platform !== 'linux') { throw new Error('Model terminal titles currently support Linux/bash only.'); }
    if (!vscode.workspace.isTrusted) { throw new Error('Trust this workspace before configuring or launching model terminals.'); }
}

/** Invoked explicitly by the user; activation never modifies shell files or user settings. */
export async function configureModelTerminalFiles(
    launcher: string, bashrc: string, config: Pick<vscode.WorkspaceConfiguration, 'inspect' | 'get' | 'update'>,
): Promise<string[]> {
    const edits: FileEdit[] = [];
    for (const [file, transform] of [
        [launcher, configureLauncher],
        [bashrc, configureBashrc],
    ] as const) {
        const before = await fs.readFile(file, 'utf8');
        const after = transform(before);
        validateBash(after, path.basename(file));
        if (before !== after) { edits.push({ file, before, after, mode: (await fs.stat(file)).mode }); }
    }

    const previous = new Map(Object.keys(tabSettings).map(key => [key, config.inspect(key)?.globalValue]));
    const changedSettings: string[] = [];
    const written: FileEdit[] = [];
    const backups: string[] = [];
    try {
        for (const edit of edits) {
            if (await fs.readFile(edit.file, 'utf8') !== edit.before) { throw new Error(`${edit.file} changed during setup; retry.`); }
            const backup = `${edit.file}.veb-title-${Date.now()}.bak`;
            await fs.writeFile(backup, edit.before, { flag: 'wx', mode: edit.mode & 0o777 });
            backups.push(backup);
            written.push(edit);
            await fs.writeFile(edit.file, edit.after);
        }
        // VS Code's configuration editor validates JSONC and preserves comments and unrelated keys.
        for (const [key, value] of Object.entries(tabSettings)) {
            if (previous.get(key) !== value) {
                if (config.inspect(key)?.globalValue !== previous.get(key)) { throw new Error(`Setting ${key} changed during setup; retry.`); }
                await config.update(key, value, vscode.ConfigurationTarget.Global);
                changedSettings.push(key);
            }
        }
    } catch (error) {
        const rollbackErrors: string[] = [];
        for (const key of changedSettings.reverse()) {
            try {
                if (config.inspect(key)?.globalValue === tabSettings[key]) {
                    await config.update(key, previous.get(key), vscode.ConfigurationTarget.Global);
                } else { rollbackErrors.push(`setting ${key}`); }
            }
            catch { rollbackErrors.push(`setting ${key}`); }
        }
        for (const edit of written.reverse()) {
            try {
                if (await fs.readFile(edit.file, 'utf8') === edit.after) { await fs.writeFile(edit.file, edit.before); }
                else { rollbackErrors.push(edit.file); }
            } catch { rollbackErrors.push(edit.file); }
        }
        throw new Error(`${error instanceof Error ? error.message : error}${rollbackErrors.length ? ` Restore from .veb-title-*.bak for: ${rollbackErrors.join(', ')}` : ''}`);
    }
    return backups;
}

export async function setupModelTerminals(): Promise<void> {
    checkEnvironment();
    const config = vscode.workspace.getConfiguration('terminal.integrated');
    const backups = await configureModelTerminalFiles(launcherPath(), path.join(os.homedir(), '.bashrc'), config);
    const current = vscode.workspace.getConfiguration('terminal.integrated');
    const overridden = Object.entries(tabSettings).filter(([key, value]) => current.get(key) !== value).map(([key]) => key);
    await vscode.window.showInformationMessage(
        `Model terminal titles configured. Open new bash terminals. Native tabs show title and process side by side.${backups.length ? ` Backups: ${backups.join(', ')}` : ''}${overridden.length ? ` Workspace/remote overrides still apply: ${overridden.join(', ')}.` : ''}`,
    );
}

export async function openModelTerminal(): Promise<void> {
    checkEnvironment();
    const choice = await vscode.window.showQuickPick([
        { label: 'v4-pro', description: 'deepseek-v4-pro', mode: 'pro' },
        { label: 'v4-flash', description: 'deepseek-v4-flash', mode: 'flash' },
        { label: 'claude', description: 'Anthropic cloud', mode: 'cloud' },
        { label: 'codex', description: 'Codex CLI', mode: 'codex' },
    ], { title: 'VEB Build: Open Model Terminal' });
    if (!choice) { return; }
    const folder = vscode.workspace.workspaceFolders?.length === 1
        ? vscode.workspace.workspaceFolders[0]
        : vscode.workspace.workspaceFolders?.length ? await vscode.window.showWorkspaceFolderPick() : undefined;
    if (vscode.workspace.workspaceFolders?.length && !folder) { return; }
    const command = choice.mode === 'codex' ? 'exec codex' : `exec ${shellQuote(launcherPath())} ${choice.mode}`;
    const script = `printf '\\033]0;${choice.label}: %s\\007' "$(basename "$PWD")"; export CLAUDE_CODE_DISABLE_TERMINAL_TITLE=1; ${command}`;
    const terminal = vscode.window.createTerminal({
        shellPath: '/bin/bash', shellArgs: ['-ic', script], cwd: folder?.uri,
        iconPath: new vscode.ThemeIcon('terminal'),
    });
    terminal.show();
}

export function registerModelTerminals(context: vscode.ExtensionContext): void {
    if (!vscode.workspace.getConfiguration('vebBuild.modelTerminal').get('enabled', true)) { return; }
    const guard = (action: () => Promise<void>) => async () => {
        try { await action(); }
        catch (error) { await vscode.window.showErrorMessage(`Model terminal: ${error instanceof Error ? error.message : error}`); }
    };
    context.subscriptions.push(
        vscode.commands.registerCommand('vebBuild.modelTerminal.setup', guard(setupModelTerminals)),
        vscode.commands.registerCommand('vebBuild.modelTerminal.open', guard(openModelTerminal)),
    );
}
