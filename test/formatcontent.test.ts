import * as assert from 'assert';
import { Edk2FormatterCore } from '../src/language-support/core/edk2Formatter';

describe('formatContent taming (OPT-19)', () => {
  it('preserves leading indentation and blank lines while normalizing key=value', async () => {
    const input = [
      '[Defines]',
      'Key1=value1',
      '',
      '    # an indented comment',
      'Key2   =  value2',
    ].join('\n');

    const out = await new Edk2FormatterCore().formatContent(input, 'edk2_dsc');
    const lines = out.split('\n');

    assert.strictEqual(lines[0], '[Defines]');
    assert.strictEqual(lines[1], 'Key1 = value1');
    assert.strictEqual(lines[2], '');                        // blank line preserved
    assert.strictEqual(lines[3], '    # an indented comment'); // indentation preserved
    assert.strictEqual(lines[4], 'Key2 = value2');           // key=value spacing normalized
  });
});
