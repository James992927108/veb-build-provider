import * as assert from 'assert';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { globToRegExp, ModuleScanner } from '../src/edk2-debug/core/moduleScanner';

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

describe('ModuleScanner scanInfFiles (OPT-2)', () => {
  it('scans .inf files and excludes Build/** relative to the scan root', async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vebscan-'));
    try {
      fs.mkdirSync(path.join(root, 'AmiPkg'));
      fs.writeFileSync(path.join(root, 'AmiPkg', 'Test.inf'), '');
      fs.mkdirSync(path.join(root, 'Build'), { recursive: true });
      fs.writeFileSync(path.join(root, 'Build', 'Generated.inf'), '');

      const scanner = new ModuleScanner(root);
      const files = await scanner.scanInfFiles({ showProgress: false });

      const testInf = path.join(root, 'AmiPkg', 'Test.inf');
      assert.ok(files.includes(testInf), 'Test.inf should be included');
      assert.ok(!files.some((f) => f.includes('Generated.inf')), 'Build/** should be excluded');
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});
