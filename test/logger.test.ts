import * as assert from 'assert';
import { LogLevel, logMessageWithLevel, logInfo, logDebug, logWarn, isDebugEnabled } from '../src/shared/utils/logger';

/**
 * Baseline regression tests protecting logger behavior.
 *
 * The logger's logMessageWithLevel must route 'warn' to showWarningMessage
 * and 'info' to showInformationMessage with the exact message text. These
 * protect the module against accidental regressions during optimization.
 */

declare const global: any;

function resetCalls() {
  global.__mockedVscode.calls.length = 0;
}

function callsWithPath(p: string[]) {
  return global.__mockedVscode.calls
    .filter((c: any) => c.path.join('.') === p.join('.'));
}

describe('logger', () => {
  describe('LogLevel enum', () => {
    it('defines ordered levels', () => {
      assert.strictEqual(LogLevel.DEBUG, 0);
      assert.strictEqual(LogLevel.INFO, 1);
      assert.strictEqual(LogLevel.WARN, 2);
      assert.strictEqual(LogLevel.ERROR, 3);
      assert.strictEqual(LogLevel.SUMMARY, 4);
    });

    it('level names are stable (used in log output)', () => {
      assert.strictEqual(LogLevel[LogLevel.DEBUG], 'DEBUG');
      assert.strictEqual(LogLevel[LogLevel.INFO], 'INFO');
      assert.strictEqual(LogLevel[LogLevel.WARN], 'WARN');
      assert.strictEqual(LogLevel[LogLevel.ERROR], 'ERROR');
      assert.strictEqual(LogLevel[LogLevel.SUMMARY], 'SUMMARY');
    });
  });

  describe('logMessageWithLevel', () => {
    it('routes warn to showWarningMessage with the message', () => {
      resetCalls();
      logMessageWithLevel('Warning: battery low', 'warn');
      const hits = callsWithPath(['window', 'showWarningMessage']);
      assert.strictEqual(hits.length, 1);
      assert.strictEqual(hits[0].args[0], 'Warning: battery low');
    });

    it('routes info to showInformationMessage with the message', () => {
      resetCalls();
      logMessageWithLevel('Build finished', 'info');
      const hits = callsWithPath(['window', 'showInformationMessage']);
      assert.strictEqual(hits.length, 1);
      assert.strictEqual(hits[0].args[0], 'Build finished');
    });

    it('does not call the wrong warning channel', () => {
      resetCalls();
      logMessageWithLevel('just info', 'info');
      assert.strictEqual(callsWithPath(['window', 'showWarningMessage']).length, 0);
    });
  });

  describe('isDebugEnabled (OPT-3 guard)', () => {
    it('returns a boolean', () => {
      assert.strictEqual(typeof isDebugEnabled(), 'boolean');
    });
  });

  describe('convenience log functions', () => {
    it('do not throw and are callable', () => {
      resetCalls();
      logDebug('d');
      logInfo('i');
      logWarn('w');
      // no exception above is the assertion
    });
  });
});
