import * as assert from 'assert';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import {
  WorkspaceIndex,
  parseDecDefinitions,
  parseInfModuleDef,
  findAllOccurrences,
  extractDefinitionTarget,
  sortDefinitions,
} from '../src/language-support/core/workspaceIndex';

const DEC = `[Defines]
  DEC_SPECIFICATION = 0x0001001F
  PACKAGE_NAME = FixturePkg

[Includes]
  Include

[Guids]
  ## Boot driver GUID
  gFixtureBootGuid = { 0x11111111, 0x2222, 0x3333, { 0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF, 0x00, 0x11 } }

[Ppis]
  gFixturePeiPpiGuid = { 0x22222222, 0x3333, 0x4444, { 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88 } }

[Protocols]
  gFixtureProtocolGuid = { 0x33333333, 0x4444, 0x5555, { 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88 } }

[PcdsFixedAtBuild]
  gFixtureTokenSpaceGuid.PcdUintArray|{0x0}|VOID*|0x00000001
  gFixtureTokenSpaceGuid.PcdBootDelay|5|UINT32|0x00000002
  gFixtureTokenSpaceGuid.PcdFeatureFlag|TRUE|BOOLEAN|0x00000003

[PcdsDynamic]
  gFixtureTokenSpaceGuid.PcdRuntimeVar|0x0|UINT64|0x00000004
`;

const INF = `[Defines]
  INF_VERSION     = 0x0001001B
  BASE_NAME       = StubDriver
  FILE_GUID       = 44444444-5555-6666-7777-888888888888
  MODULE_TYPE     = DXE_DRIVER
  VERSION_STRING  = 1.0
  ENTRY_POINT     = StubDriverEntryPoint

[Packages]
  FixturePkg/FixturePkg.dec

[Sources]
  StubDriver.c

[LibraryClasses]
  UefiDriverEntryPoint

[Protocols]
  gFixtureProtocolGuid

[PcdsFixedAtBuild]
  gFixtureTokenSpaceGuid.PcdBootDelay|0xA|UINT32
`;

const INF_LIB = `[Defines]
  INF_VERSION     = 0x0001001B
  BASE_NAME       = UefiDriverEntryPoint
  FILE_GUID       = 55555555-6666-7777-8888-999999999999
  MODULE_TYPE     = UEFI_DRIVER
  ENTRY_POINT     = UefiDriverEntryPointLib
`;

const DSC = `[Defines]
  PLATFORM_NAME = Foobar
  DSC_SPECIFICATION = 0x0001001C

[LibraryClasses]
  UefiDriverEntryPoint|../Driver/StubDriver.inf

[PcdsFixedAtBuild]
  gFixtureTokenSpaceGuid.PcdBootDelay|0x1|UINT32

[Components]
  ../Driver/StubDriver.inf
`;

describe('workspace symbol index parsing (EDK2Code borrow)', () => {
  it('parseDecDefinitions extracts GUID/PPI/PROTOCOL/PCD declarations', () => {
    const defs = parseDecDefinitions(DEC, 'pkg.dec');
    const byKind = (k: string) => defs.filter((d) => d.kind === k);
    assert.strictEqual(byKind('guid').length, 1);
    assert.strictEqual(byKind('ppi').length, 1);
    assert.strictEqual(byKind('protocol').length, 1);
    assert.strictEqual(byKind('pcd').length, 4);

    const guid = byKind('guid')[0];
    assert.strictEqual(guid.name, 'gFixtureBootGuid');
    assert.strictEqual(guid.line, 9);

    const pcd = byKind('pcd').find((d) => d.name === 'PcdBootDelay');
    assert.ok(pcd);
    assert.strictEqual(pcd.tokenSpace, 'gFixtureTokenSpaceGuid');
    assert.strictEqual(pcd.qualifiedName, 'gFixtureTokenSpaceGuid.PcdBootDelay');
  });

  it('parseInfModuleDef extracts BASE_NAME and MODULE_TYPE', () => {
    const def = parseInfModuleDef(INF, 'Driver/StubDriver.inf');
    assert.ok(def);
    assert.strictEqual(def.kind, 'module');
    assert.strictEqual(def.name, 'StubDriver');
    assert.strictEqual(def.moduleType, 'DXE_DRIVER');
    assert.ok(def.line >= 0);
  });

  it('parseInfModuleDef returns null for INF without BASE_NAME', () => {
    assert.strictEqual(parseInfModuleDef('[Defines]\n  MODULE_TYPE = DXE_DRIVER\n', 'x.inf'), null);
  });

  it('findAllOccurrences finds word-boundary matches with exact positions', () => {
    const refs = findAllOccurrences('  gFixtureProtocolGuid\nUefiDriverEntryPoint|path.inf\n  gFixtureBootGuid', ['gFixtureProtocolGuid']);
    assert.strictEqual(refs.length, 1);
    assert.strictEqual(refs[0].line, 0);
    assert.strictEqual(refs[0].column, 2);
  });

  it('findAllOccurrences does not match substrings inside longer identifiers', () => {
    const refs = findAllOccurrences('StubDriverEntryPoint\nStubDriver.c\nOther', ['StubDriver']);
    // 'StubDriverEntryPoint' is one identifier (no boundary); 'StubDriver.c' has a boundary at the dot.
    assert.strictEqual(refs.length, 1);
    assert.strictEqual(refs[0].line, 1);
  });
});

describe('extractDefinitionTarget (EDK2Code borrow)', () => {
  it('recognizes a qualified PCD token under the caret', () => {
    const line = '  gFixtureTokenSpaceGuid.PcdBootDelay|0xA|UINT32';
    const col = line.indexOf('PcdBootDelay') + 2;
    const target = extractDefinitionTarget(line, col);
    assert.ok(target);
    assert.strictEqual(target.kind, 'pcd');
    if (target.kind === 'pcd') {
      assert.strictEqual(target.name, 'PcdBootDelay');
      assert.strictEqual(target.tokenSpace, 'gFixtureTokenSpaceGuid');
    }
  });

  it('recognizes a guid token', () => {
    const line = '  gFixtureBootGuid = { 0x11111111 }';
    const col = line.indexOf('gFixtureBootGuid');
    const target = extractDefinitionTarget(line, col);
    assert.ok(target);
    assert.strictEqual(target.kind, 'guid');
  });

  it('returns a word target for a bare library/class name', () => {
    const target = extractDefinitionTarget('  UefiDriverEntryPoint', 3);
    assert.ok(target);
    assert.strictEqual(target.kind, 'word');
  });

  it('returns null for EDK2 keywords and non-words', () => {
    assert.strictEqual(extractDefinitionTarget('  BASE_NAME = Foo', 3), null);
    assert.strictEqual(extractDefinitionTarget('  |  | 0x0 | UINT32', 3), null);
  });

  it('ignores the dot in qualified tokens when caret is at the separators', () => {
    const line = 'gFixtureTokenSpaceGuid.PcdBootDelay|0xA|UINT32';
    // caret right after the qualified token (at the '|')
    const col = line.indexOf('PcdBootDelay') + 'PcdBootDelay'.length;
    const target = extractDefinitionTarget(line, col);
    assert.ok(target);
    assert.strictEqual(target.kind, 'pcd');
  });
});

describe('WorkspaceIndex cross-file lookups and references (EDK2Code borrow)', () => {
  let root: string;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'veb-idx-'));
    fs.mkdirSync(path.join(root, 'Pkg'), { recursive: true });
    fs.mkdirSync(path.join(root, 'Driver'), { recursive: true });
    fs.mkdirSync(path.join(root, 'Driver2'), { recursive: true });
    fs.mkdirSync(path.join(root, 'Platform'), { recursive: true });
    fs.writeFileSync(path.join(root, 'Pkg', 'FixturePkg.dec'), DEC);
    fs.writeFileSync(path.join(root, 'Driver', 'StubDriver.inf'), INF);
    fs.writeFileSync(path.join(root, 'Driver2', 'UefiDriverEntryPoint.inf'), INF_LIB);
    fs.writeFileSync(path.join(root, 'Platform', 'Foo.dsc'), DSC);
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('builds and looks up GUID definitions across .dec files', async () => {
    const index = new WorkspaceIndex([root]);
    await index.build();
    const defs = index.defsByName('gFixtureProtocolGuid');
    assert.strictEqual(defs.length, 1);
    assert.strictEqual(defs[0].kind, 'protocol');
    assert.ok(defs[0].filePath.endsWith('FixturePkg.dec'));
  });

  it('looks up qualified PCD and bare PCD fallback', async () => {
    const index = new WorkspaceIndex([root]);
    await index.build();
    const qualified = index.findPcd('gFixtureTokenSpaceGuid', 'PcdBootDelay');
    assert.strictEqual(qualified.length, 1);
    assert.strictEqual(qualified[0].name, 'PcdBootDelay');

    const bare = index.defsByName('PcdRuntimeVar');
    assert.strictEqual(bare.length, 1);
  });

  it('tracks token spaces and declared PCDs', async () => {
    const index = new WorkspaceIndex([root]);
    await index.build();
    assert.ok(index.knowsTokenSpace('gFixtureTokenSpaceGuid'));
    assert.strictEqual(index.isDeclaredPcd('gFixtureTokenSpaceGuid', 'PcdBootDelay'), true);
    assert.strictEqual(index.isDeclaredPcd('gFixtureTokenSpaceGuid', 'PcdNope'), false);
  });

  it('looks up modules by BaseName from .inf files', async () => {
    const index = new WorkspaceIndex([root]);
    await index.build();
    const defs = index.defsByName('StubDriver');
    assert.strictEqual(defs.length, 1);
    assert.strictEqual(defs[0].kind, 'module');
    assert.strictEqual(defs[0].moduleType, 'DXE_DRIVER');
  });

  it('findReferences finds protocol GUID uses across files, excluding the declaration', async () => {
    const index = new WorkspaceIndex([root]);
    await index.build();
    const defs = index.defsByName('gFixtureProtocolGuid');
    const refs = await index.findReferences(defs[0]);
    const targets = refs.map((r) => `${path.basename(r.filePath)}:${r.line}`);
    assert.ok(targets.includes('StubDriver.inf:18'), `expected INF [Protocols] ref, got ${targets.join(', ')}`);
    // The declaring line in the .dec is excluded (protocol declared at line 15).
    assert.ok(!targets.some((t) => t.startsWith('FixturePkg.dec:')), `no decl self ref, got ${targets.join(', ')}`);
  });

  it('findReferences finds qualified PCD uses in INF and DSC', async () => {
    const index = new WorkspaceIndex([root]);
    await index.build();
    const defs = index.findPcd('gFixtureTokenSpaceGuid', 'PcdBootDelay');
    const refs = await index.findReferences(defs[0]);
    const targets = refs.map((r) => path.basename(r.filePath));
    assert.ok(targets.includes('StubDriver.inf'), 'PCD referenced from INF');
    assert.ok(targets.includes('Foo.dsc'), 'PCD referenced from DSC');
  });

  it('findReferences finds module BaseName + component path references', async () => {
    const index = new WorkspaceIndex([root]);
    await index.build();
    const defs = index.defsByName('StubDriver');
    const refs = await index.findReferences(defs[0]);
    const seen = refs.map((r) => path.basename(r.filePath));
    assert.ok(seen.includes('Foo.dsc'), 'module referenced from DSC component/lib section');
  });

  it('navigation lookup uses the index through sortDefinitions', async () => {
    const index = new WorkspaceIndex([root]);
    await index.build();
    const target = extractDefinitionTarget('  gFixtureBootGuid = { 0x11 }', 3);
    assert.ok(target);
    const defs = sortDefinitions(index.lookup(target!));
    assert.strictEqual(defs.length, 1);
    assert.strictEqual(defs[0].name, 'gFixtureBootGuid');
  });

  it('refreshFile incrementally updates definitions after a save', async () => {
    const index = new WorkspaceIndex([root]);
    await index.build();
    const decPath = path.join(root, 'Pkg', 'FixturePkg.dec');
    assert.strictEqual(index.defsByName('gFixtureBootGuid').length, 1);

    const modified = DEC
      .replace('gFixtureBootGuid', 'gRenamedGuid')
      .replace('  gFixtureTokenSpaceGuid.PcdFeatureFlag|TRUE|BOOLEAN|0x00000003\n', '');
    fs.writeFileSync(decPath, modified);
    await index.refreshFile(decPath);

    assert.strictEqual(index.defsByName('gFixtureBootGuid').length, 0, 'old GUID gone');
    assert.strictEqual(index.defsByName('gRenamedGuid').length, 1, 'renamed GUID found');
    assert.strictEqual(index.defsByName('PcdFeatureFlag').length, 0, 'removed PCD gone');
    assert.strictEqual(index.isDeclaredPcd('gFixtureTokenSpaceGuid', 'PcdFeatureFlag'), false);
    assert.strictEqual(index.isDeclaredPcd('gFixtureTokenSpaceGuid', 'PcdBootDelay'), true, 'other PCD untouched');
  });
});
