import * as assert from 'assert';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { spawnSync } from 'child_process';
import { configureLauncher, configureBashrc, shellQuote, tabSettings } from '../src/model-terminal/configure';
import { configureModelTerminalFiles } from '../src/model-terminal';
import type * as vscode from 'vscode';

const launcher = `#!/usr/bin/env bash
set -euo pipefail
launch_pro() {
  exec claude --settings pro.json "$@"
}
launch_flash() {
  exec claude --settings flash.json "$@"
}
menu() {
  read -r choice
  case "$choice" in
    p|P) launch_pro ;;
    f|F) launch_flash ;;
    c|C) exec claude ;;
  esac
}
case "\${1:-}" in
  pro) shift; launch_pro "$@" ;;
  flash) shift; launch_flash "$@" ;;
  cloud) shift; exec claude "$@" ;;
  *) menu ;;
esac
`;

describe('model terminal shell integration', () => {
    let temp: string;
    beforeEach(() => {
        temp = fs.mkdtempSync(path.join(os.tmpdir(), 'veb-title-test-'));
        for (const command of ['claude', 'codex']) {
            fs.writeFileSync(path.join(temp, command), '#!/bin/bash\nprintf "DISABLE=%s\\n" "${CLAUDE_CODE_DISABLE_TERMINAL_TITLE:-}"\nprintf "ARG=<%s>\\n" "$@"\nexit 7\n', { mode: 0o755 });
        }
    });
    afterEach(() => fs.rmSync(temp, { recursive: true, force: true }));

    function run(text: string, args: string[] = [], input?: string) {
        const file = path.join(temp, 'launcher');
        fs.writeFileSync(file, text);
        return spawnSync('/bin/bash', [file, ...args], {
            encoding: 'utf8', cwd: temp, input, env: { ...process.env, PATH: `${temp}:${process.env.PATH}` },
        });
    }

    it('is syntactically valid and idempotent, including legacy cloud menu/dispatch', () => {
        const result = configureLauncher(launcher);
        assert.strictEqual(configureLauncher(result), result);
        assert.strictEqual(spawnSync('/bin/bash', ['-n'], { input: result }).status, 0);
        assert.match(result, /c\|C\) launch_cloud ;;/);
        assert.match(result, /cloud\) shift; launch_cloud "\$@" ;;/);
    });

    for (const [mode, label] of [['pro', 'v4-pro'], ['flash', 'v4-flash'], ['cloud', 'claude']]) {
        it(`${mode} emits OSC, disables Claude title updates, forwards arguments and exit status`, () => {
            const result = run(configureLauncher(launcher), [mode, '-p', 'a b; $(no-command)', '--flag']);
            assert.strictEqual(result.status, 7, result.stderr);
            assert.ok(result.stdout.startsWith(`\x1b]0;${label}: ${path.basename(temp)}\x07`));
            assert.ok(result.stdout.includes('DISABLE=1\n'));
            assert.ok(result.stdout.includes('ARG=<a b; $(no-command)>\n'));
            if (mode !== 'cloud') { assert.ok(result.stdout.includes(`ARG=<${mode}.json>\n`)); }
        });
    }

    for (const choice of ['c', 'C']) {
        it(`interactive ${choice} also routes through the cloud helper`, () => {
            const result = run(configureLauncher(launcher), [], `${choice}\n`);
            assert.strictEqual(result.status, 7, result.stderr);
            assert.ok(result.stdout.startsWith(`\x1b]0;claude: ${path.basename(temp)}\x07`));
            assert.ok(result.stdout.includes('DISABLE=1'));
        });
    }

    it('codex is a function, emits OSC and forwards arguments and exit status', () => {
        const rc = configureBashrc('# existing bash config\nalias codex="old-command"\n');
        assert.strictEqual(configureBashrc(rc), rc);
        assert.strictEqual(spawnSync('/bin/bash', ['-n'], { input: rc }).status, 0);
        const result = run(rc + '\ncodex "a b" --help\n');
        assert.strictEqual(result.status, 7, result.stderr);
        assert.ok(result.stdout.startsWith(`\x1b]0;codex: ${path.basename(temp)}\x07`));
        assert.ok(result.stdout.includes('ARG=<a b>\nARG=<--help>'));
    });

    it('preserves unrelated configuration and CRLF', () => {
        const source = '# keep me\r\nexport EXAMPLE=1\r\n';
        const result = configureBashrc(source);
        assert.ok(result.startsWith(source));
        assert.ok(!result.replace(/\r\n/g, '').includes('\n'));
    });

    it('refuses unsupported launchers and custom functions instead of destroying logic', () => {
        assert.throws(() => configureLauncher('#!/bin/sh\n'), /bash/);
        assert.throws(() => configureLauncher(launcher.replace('launch_flash()', 'another()')), /launch_flash/);
        assert.throws(() => configureBashrc('codex() {\n  echo custom\n  command codex "$@"\n}\n'), /custom codex/);
        assert.throws(() => configureBashrc('alias codex="x"; alias other="y"\n'), /compound/);
    });

    it('quotes executable paths without expanding shell metacharacters', () => {
        const value = "space ' $(do-not-execute)";
        const result = spawnSync('/bin/bash', ['-c', `printf '%s' ${shellQuote(value)}`], { encoding: 'utf8' });
        assert.strictEqual(result.stdout, value);
    });

    it('enables OSC titles and real process descriptions in native left tabs', () => {
        assert.strictEqual(tabSettings['tabs.title'], '${sequence}');
        assert.strictEqual(tabSettings['tabs.description'], '${process}');
        assert.strictEqual(tabSettings['tabs.location'], 'left');
    });

    function setupFixture(failKey?: string) {
        const file = path.join(temp, 'claude-cli');
        const rc = path.join(temp, 'bashrc');
        fs.writeFileSync(file, launcher, { mode: 0o755 });
        fs.writeFileSync(rc, '# my bash config\n');
        const settings = new Map<string, unknown>([['tabs.location', 'right']]);
        const config = {
            inspect: (key: string) => ({ globalValue: settings.get(key) }),
            get: (key: string) => settings.get(key),
            update: async (key: string, value: unknown) => {
                if (key === failKey) { throw new Error('Simulated JSONC settings write failure'); }
                if (value === undefined) { settings.delete(key); } else { settings.set(key, value); }
            },
        } as unknown as vscode.WorkspaceConfiguration;
        return { file, rc, settings, config };
    }

    it('backs up only changed files, preserves permissions, and setup is repeatable', async () => {
        const f = setupFixture();
        const backups = await configureModelTerminalFiles(f.file, f.rc, f.config);
        assert.strictEqual(backups.length, 2);
        assert.strictEqual(fs.readFileSync(backups[0], 'utf8'), launcher);
        assert.strictEqual(fs.statSync(f.file).mode & 0o777, 0o755);
        assert.deepStrictEqual(await configureModelTerminalFiles(f.file, f.rc, f.config), []);
        assert.strictEqual(f.settings.get('tabs.title'), '${sequence}');
    });

    it('restores shell files and settings when a configuration write fails', async () => {
        const f = setupFixture('tabs.title');
        await assert.rejects(configureModelTerminalFiles(f.file, f.rc, f.config), /Simulated JSONC/);
        assert.strictEqual(fs.readFileSync(f.file, 'utf8'), launcher);
        assert.strictEqual(fs.readFileSync(f.rc, 'utf8'), '# my bash config\n');
        assert.deepStrictEqual([...f.settings], [['tabs.location', 'right']]);
    });

    it('validates both scripts before writing either file or settings', async () => {
        const f = setupFixture(); fs.appendFileSync(f.rc, '\nif broken syntax\n');
        await assert.rejects(configureModelTerminalFiles(f.file, f.rc, f.config), /bash -n/);
        assert.strictEqual(fs.readFileSync(f.file, 'utf8'), launcher);
        assert.deepStrictEqual([...f.settings], [['tabs.location', 'right']]);
        assert.strictEqual(fs.readdirSync(temp).filter(name => name.endsWith('.bak')).length, 0);
    });
});
