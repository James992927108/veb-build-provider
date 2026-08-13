import * as assert from 'assert';
import { extractVebNameFromJson, extractValue } from '../src/veb-build/commands/buildCommands';

describe('extractVebNameFromJson (OPT-4/17)', () => {
  const win = JSON.stringify({
    tasks: [
      { label: 'VebBuildTask', type: 'shell', command: 'cmd /V /C "SET VEB=MyProject&&echo veb = !VEB!"' }
    ]
  });

  const linuxEnv = JSON.stringify({
    tasks: [
      { label: 'VebReBuildTask', options: { env: { VEB: 'OtherProject' } }, command: 'echo hi' }
    ]
  });

  const noVeb = JSON.stringify({
    tasks: [
      { label: 'SomeTask', command: 'echo no veb here' }
    ]
  });

  it('extracts VEB from Windows SET VEB= command', () => {
    assert.strictEqual(extractVebNameFromJson(win, 'VebBuildTask'), 'MyProject.veb');
  });

  it('extracts VEB from Linux options.env.VEB', () => {
    assert.strictEqual(extractVebNameFromJson(linuxEnv, 'VebReBuildTask'), 'OtherProject.veb');
  });

  it('returns Unknown.veb when task has no VEB value', () => {
    assert.strictEqual(extractVebNameFromJson(noVeb, 'SomeTask'), 'Unknown.veb');
  });

  it('returns Unknown.veb when task label not found', () => {
    assert.strictEqual(extractVebNameFromJson(win, 'MissingTask'), 'Unknown.veb');
  });

  it('returns Unknown.veb on malformed JSON', () => {
    assert.strictEqual(extractVebNameFromJson('{ not valid json', 'VebBuildTask'), 'Unknown.veb');
  });
});

describe('extractValue (OPT-16)', () => {
  const veb = [
    'Build = "build.bat"',
    'BuildAll = "rebuild.bat"',
    'CleanCmd = 123'
  ].join('\n');

  it('extracts a quoted value for a present key', () => {
    assert.strictEqual(extractValue(veb, 'Build'), 'build.bat');
    assert.strictEqual(extractValue(veb, 'BuildAll'), 'rebuild.bat');
  });

  it('returns empty string for missing keys (validated by caller)', () => {
    assert.strictEqual(extractValue(veb, 'DoesNotExist'), '');
  });
});
