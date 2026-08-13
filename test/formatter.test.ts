import * as assert from 'assert';
import { UniLineFormatter } from '../src/language-support/core/edk2Formatter';

describe('UniLineFormatter (OPT-9)', () => {
  const ctx: any = {
    config: { speceOnUni: 1 },
    maxStringLength: 40,
    spaceBefore: ' ',
    spaceAfter: ' ',
    langLineMaxSpaceAhead: '',
  };
  const fmt = new UniLineFormatter();

  it('formats a #string line that HAS #language (no regression)', () => {
    const out = fmt.formatLine('#string STRING_ID_CLOCK #language en-US "Clock text"', ctx);
    assert.ok(out.includes('#language'), 'keeps #language');
    assert.ok(!out.includes('undefined'), 'no literal undefined');
    assert.ok(out.includes('STRING_ID_CLOCK'), 'keeps identifier');
  });

  it('leaves a #string line WITHOUT #language untouched (no "undefined")', () => {
    const out = fmt.formatLine('#string STRING_ID_CLOCK some raw value', ctx);
    assert.ok(!out.includes('undefined'), 'must not emit "undefined"');
  });
});
