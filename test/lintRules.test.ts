import * as assert from 'assert';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import {
  lintInf,
  lintDsc,
  lintDec,
  detectUndeclaredPcds,
  LintIssue,
} from '../src/language-support/core/lintRules';

const GOOD_INF = `[Defines]
  INF_VERSION     = 0x0001001B
  BASE_NAME       = StubDriver
  FILE_GUID       = 44444444-5555-6666-7777-888888888888
  MODULE_TYPE     = DXE_DRIVER
  VERSION_STRING  = 1.0

[Packages]
  FixturePkg/FixturePkg.dec

[Sources]
  StubDriver.c

[LibraryClasses]
  UefiDriverEntryPoint

[Protocols]
  gFixtureProtocolGuid

[PcdsFixedAtBuild]
  gFixtureTokenSpaceGuid.PcdBootDelay|0xA|UINT32|0x00000002
`;

function countSeverity(issues: LintIssue[], severity: 'error' | 'warning'): number {
  return issues.filter((i) => i.severity === severity).length;
}

describe('EDK2 lint rules (EDK2Code borrow)', () => {
  let root: string;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'veb-lint-'));
    fs.mkdirSync(path.join(root, 'Driver'), { recursive: true });
    fs.mkdirSync(path.join(root, 'FixturePkg'), { recursive: true });
    fs.writeFileSync(path.join(root, 'Driver', 'StubDriver.c'), '// stub source\n');
    fs.writeFileSync(path.join(root, 'FixturePkg', 'FixturePkg.dec'), '');
    fs.writeFileSync(path.join(root, 'Driver', 'StubDriver.inf'), GOOD_INF);
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('reports no issues for a well-formed INF', () => {
    const issues = lintInf(GOOD_INF, path.join(root, 'Driver', 'StubDriver.inf'), [root]);
    assert.strictEqual(countSeverity(issues, 'error'), 0, JSON.stringify(issues));
    assert.strictEqual(countSeverity(issues, 'warning'), 0, JSON.stringify(issues));
  });

  it('flags missing required [Defines] fields', () => {
    const inf = '[Defines]\n  INF_VERSION = 0x0001001B\n  MODULE_TYPE = DXE_DRIVER\n';
    const issues = lintInf(inf, 'x.inf', []);
    const errors = issues.filter((i) => i.severity === 'error');
    assert.ok(errors.some((e) => e.message.includes('BASE_NAME')), JSON.stringify(errors));
    assert.ok(errors.some((e) => e.message.includes('FILE_GUID')), JSON.stringify(errors));
  });

  it('flags a missing [Defines] section entirely', () => {
    const issues = lintInf('[Sources]\n  Foo.c\n', 'x.inf', []);
    assert.ok(issues.some((i) => i.message.includes('[Defines]')), JSON.stringify(issues));
  });

  it('flags unqualified PCD entries', () => {
    const inf = `[Defines]\n  BASE_NAME = X\n  FILE_GUID = 1-2-3\n  MODULE_TYPE = DXE_DRIVER\n\n[PcdsFixedAtBuild]\n  PcdFoo|0x1|UINT32|0x01\n`;
    const issues = lintInf(inf, 'x.inf', []);
    assert.ok(
      issues.some((i) => i.message.includes('TokenSpaceGuid.PcdName') && i.severity === 'error'),
      JSON.stringify(issues)
    );
  });

  it('does NOT warn on bare PCD names in INF (legal EDK2, values live in DSC/DEC)', () => {
    const inf = `[Defines]\n  BASE_NAME = X\n  FILE_GUID = 1-2-3\n  MODULE_TYPE = DXE_DRIVER\n\n[PcdsFixedAtBuild]\n  gFixtureTokenSpaceGuid.PcdShort\n`;
    const issues = lintInf(inf, 'x.inf', []);
    assert.ok(!issues.some((i) => i.message.includes('missing fields')), JSON.stringify(issues));
  });

  it('flags DEC PCD entries with missing fields as warnings', () => {
    const dec = `[PcdsFixedAtBuild]\n  gFixtureTokenSpaceGuid.PcdShort\n`;
    const issues = lintDec(dec, 'p.dec', []);
    assert.ok(issues.some((i) => i.message.includes('missing fields') && i.severity === 'warning'), JSON.stringify(issues));
  });

  it('warns when a [Sources] file does not exist on disk', () => {
    const inf = `[Defines]\n  BASE_NAME = X\n  FILE_GUID = 1-2-3\n  MODULE_TYPE = DXE_DRIVER\n\n[Sources]\n  MissingThing.c\n`;
    const issues = lintInf(inf, path.join(root, 'Driver', 'x.inf'), [root]);
    assert.ok(issues.some((i) => i.message.includes('MissingThing.c') && i.severity === 'warning'), JSON.stringify(issues));
  });

  it('flags duplicate sections', () => {
    const inf = `[Defines]\n  BASE_NAME = X\n  FILE_GUID = 1-2-3\n  MODULE_TYPE = DXE_DRIVER\n\n[Sources]\n  A.c\n[Sources]\n  B.c\n`;
    const infPath = path.join(root, 'Driver', 'y.inf');
    fs.writeFileSync(path.join(root, 'Driver', 'A.c'), '');
    fs.writeFileSync(path.join(root, 'Driver', 'B.c'), '');
    const issues = lintInf(inf, infPath, [root]);
    assert.ok(issues.some((i) => i.message.includes('already defined')), JSON.stringify(issues));
  });

  it('flags duplicate PCD assignments in a DSC', () => {
    const dsc = `[Defines]\n  PLATFORM_NAME = Foo\n\n[PcdsFixedAtBuild]\n  gFixtureTokenSpaceGuid.PcdBootDelay|0x1|UINT32\n  gFixtureTokenSpaceGuid.PcdBootDelay|0x2|UINT32\n`;
    const issues = lintDsc(dsc, 'p.dsc', []);
    assert.ok(issues.some((i) => i.message.includes('more than once')), JSON.stringify(issues));
  });

  it('flags a missing !include in a DSC', () => {
    const dsc = `[Defines]\n  PLATFORM_NAME = Foo\n\n!include NoSuchFile.dsc\n`;
    const issues = lintDsc(dsc, 'p.dsc', []);
    assert.ok(issues.some((i) => i.severity === 'error' && i.message.includes('NoSuchFile.dsc')), JSON.stringify(issues));
  });

  it('warns when a DSC component INF is missing on disk', () => {
    const dsc = `[Defines]\n  PLATFORM_NAME = Foo\n\n[Components]\n  ../Driver/Gone.inf\n`;
    const issues = lintDsc(dsc, path.join(root, 'p.dsc'), [root]);
    assert.ok(issues.some((i) => i.message.includes('Gone.inf')), JSON.stringify(issues));
  });

  it('flags duplicate GUID names in a DEC', () => {
    const dec = `[Guids]\n  gDupGuid = { 0x1 }\n  gDupGuid = { 0x2 }\n`;
    const issues = lintDec(dec, 'p.dec', []);
    assert.ok(issues.some((i) => i.severity === 'error' && i.message.includes('Duplicate')), JSON.stringify(issues));
  });

  it('flags malformed GUID declaration without "=" in DEC', () => {
    const dec = `[Guids]\n  gBrokenGuid\n`;
    const issues = lintDec(dec, 'p.dec', []);
    assert.ok(issues.some((i) => i.severity === 'error'), JSON.stringify(issues));
  });

  it('detectUndeclaredPcds flags only truly unknown PCDs when token space is known', () => {
    const dsc = `[PcdsFixedAtBuild]\n  gFixtureTokenSpaceGuid.PcdBootDelay|0x1|UINT32\n  gFixtureTokenSpaceGuid.PcdGhost|0x1|UINT32\n`;
    const probe = {
      knowsTokenSpace: (ts: string) => ts === 'gFixtureTokenSpaceGuid',
      isDeclaredPcd: (ts: string, name: string) => name === 'PcdBootDelay',
      built: () => true,
    };
    const issues = detectUndeclaredPcds(dsc, 'edk2_dsc', probe);
    assert.strictEqual(issues.length, 1, JSON.stringify(issues));
    assert.ok(issues[0].message.includes('PcdGhost'), JSON.stringify(issues));
  });

  it('detectUndeclaredPcds is skipped when the index is empty or language not INF/DSC', () => {
    assert.deepStrictEqual(detectUndeclaredPcds('x', 'edk2_dec', null), []);
    assert.deepStrictEqual(detectUndeclaredPcds('x', 'edk2_inf', { knowsTokenSpace: () => true, isDeclaredPcd: () => false, built: () => false }), []);
  });
});
