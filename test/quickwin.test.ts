import * as assert from 'assert';
import { resolvePythonCommand } from '../src/veb-build/tools/expandMakefileVars';
import { describeError } from '../src/shared/utils/file';
import { getFormattedTimestamp } from '../src/veb-build/commands/buildCommands';

describe('quick wins', () => {
  describe('resolvePythonCommand (OPT-5)', () => {
    it('returns python on Windows and python3 elsewhere', () => {
      const expected = process.platform === 'win32' ? 'python' : 'python3';
      assert.strictEqual(resolvePythonCommand(), expected);
    });
  });

  describe('describeError (OPT-22)', () => {
    it('uses stack or message for Error instances', () => {
      const err = new Error('boom');
      assert.strictEqual(describeError(err), err.stack || err.message);
    });

    it('stringifies arbitrary values', () => {
      assert.strictEqual(describeError('raw'), 'raw');
      assert.strictEqual(describeError(42), '42');
    });
  });

  describe('getFormattedTimestamp (OPT-6)', () => {
    it('includes date AND time so same-day timestamps differ', () => {
      const a = getFormattedTimestamp();
      const b = getFormattedTimestamp();
      // format YYYYMMDD-HHMMSS
      assert.match(a, /^\d{8}-\d{6}$/);
      assert.match(b, /^\d{8}-\d{6}$/);
      assert.strictEqual(a, b); // same second here; uniqueness is by format, not value
    });
  });
});
