import * as assert from 'assert';
import { buildWindowsTasksJson, buildLinuxTasksJson } from '../src/veb-build/commands/buildCommands';

describe('tasks.json builders (OPT-12)', () => {
  it('windows tasks.json is well-formed JSON with the 3 shell tasks', () => {
    const out = buildWindowsTasksJson(
      'MyProj', 'prepare.bat', 'build.bat', 'rebuild.bat', 'clean.bat',
      'tools\\tee.exe', 'Build-MyProj-20260813-123456.log', '3.11.2'
    );
    const parsed = JSON.parse(out);
    assert.strictEqual(parsed.version, '2.0.0');
    assert.strictEqual(parsed.tasks.length, 3);

    const t = parsed.tasks.find((x: any) => x.label === 'VebBuildTask');
    assert.strictEqual(t.type, 'shell');
    assert.ok(t.command.includes('SET VEB=MyProj'));
    assert.ok(t.command.includes('prepare.bat && build.bat'));
    assert.ok(t.command.includes('2>&1| tools\\tee.exe Build-MyProj'));
    assert.strictEqual(t.options.shell.executable, 'cmd.exe');
  });

  it('linux tasks.json keeps literal variables and shell escapes intact', () => {
    const out = buildLinuxTasksJson('MyProj', '3.11.2');
    const parsed = JSON.parse(out);
    assert.strictEqual(parsed.tasks.length, 5);

    const bt = parsed.tasks.find((x: any) => x.label === 'VebBuildTask');
    assert.strictEqual(bt.options.env.VEB, 'MyProj');
    assert.strictEqual(bt.group, 'build');
    assert.ok(bt.command.includes('${workspaceFolder}/.vscode/PrepareEnvLinuxScript.sh'), 'keeps workspaceFolder var literal');
    assert.ok(bt.command.includes('Build-$VEB-'), 'keeps $VEB literal');
    assert.ok(bt.command.includes('$(date +%Y%m%d-%H%M%S)'), 'keeps date format');
  });
});
