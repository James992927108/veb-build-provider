import * as assert from 'assert';
import { globToRegExp } from '../src/edk2-debug/core/moduleScanner';

describe('globToRegExp (OPT-14)', () => {
  it('matches a literal segment', () => {
    assert.ok(globToRegExp('Build/**').test('Build/foo.inf'));
  });

  it('double-asterisk matches across directories', () => {
    assert.ok(globToRegExp('**/Build/**').test('AmiPkg/Common/Build/x.inf'));
  });

  it('single asterisk does not cross path separators', () => {
    assert.ok(globToRegExp('*.inf').test('x.inf'));
    assert.ok(!globToRegExp('*.inf').test('a/b.inf'));
  });

  it('question mark matches exactly one non-separator char', () => {
    assert.ok(globToRegExp('a?.inf').test('ab.inf'));
    assert.ok(!globToRegExp('a?.inf').test('a/b.inf'));
  });

  it('escapes dots literally', () => {
    assert.ok(globToRegExp('**/.git/**').test('repo/.git/config'));
  });
});
