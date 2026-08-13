import * as assert from 'assert';
import { parseSingleLineIfReturn } from '../src/edk2-debug/core/moduleEnhancer';

describe('parseSingleLineIfReturn (OPT-7)', () => {
  it('matches a plain single-line if-return', () => {
    const r = parseSingleLineIfReturn('  if (a) return x;');
    assert.ok(r);
    assert.strictEqual(r!.indent, '  ');
    assert.strictEqual(r!.condition, 'if (a)');
    assert.strictEqual(r!.returnStmt, 'return x;');
  });

  it('matches nested-paren conditions (fixer/checker consistency)', () => {
    const r = parseSingleLineIfReturn('if (a && (b || c)) return x;');
    assert.ok(r);
    assert.strictEqual(r!.condition, 'if (a && (b || c))');
  });

  it('matches no-space form after if(', () => {
    assert.ok(parseSingleLineIfReturn('if(a) return x;'));
  });

  it('returns null for already-braced statements', () => {
    assert.strictEqual(parseSingleLineIfReturn('if (a) { return x; }'), null);
  });

  it('returns null for non-return bodies', () => {
    assert.strictEqual(parseSingleLineIfReturn('if (a) callFoo();'), null);
  });
});
