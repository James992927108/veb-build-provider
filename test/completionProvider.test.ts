import * as assert from 'assert';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import {
  Edk2CompletionProvider,
  collectCompletions,
  currentSectionAt,
  CompletionSuggestion,
} from '../src/language-support/providers/completionProvider';
import { WorkspaceIndex } from '../src/language-support/core/workspaceIndex';

const DEC = `[Guids]
  gFixtureBootGuid = { 0x11111111, 0x2222, 0x3333, { 0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF, 0x00, 0x11 } }

[PcdsFixedAtBuild]
  gFixtureTokenSpaceGuid.PcdBootDelay|5|UINT32|0x00000002
  gFixtureTokenSpaceGuid.PcdFeatureFlag|TRUE|BOOLEAN|0x00000003
`;

const INF = `[Defines]
  BASE_NAME       = StubDriver
  MODULE_TYPE     = DXE_DRIVER

[LibraryClasses]
  UefiDriverEntryPoint
`;

describe('EDK2 completion provider (EDK2Code borrow)', () => {
  let root: string;
  let index: WorkspaceIndex;

  beforeEach(async () => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'veb-cpl-'));
    fs.mkdirSync(path.join(root, 'Pkg'), { recursive: true });
    fs.mkdirSync(path.join(root, 'Driver'), { recursive: true });
    fs.writeFileSync(path.join(root, 'Pkg', 'Pkg.dec'), DEC);
    fs.writeFileSync(path.join(root, 'Driver', 'StubDriver.inf'), INF);
    index = new WorkspaceIndex([root]);
    await index.build();
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  function labels(items: CompletionSuggestion[]): string[] {
    return items.map((i) => i.label);
  }

  it('suggests section names while typing a section header', () => {
    const items = collectCompletions('edk2_inf', '  [Def', 'defines', index);
    const seen = labels(items);
    assert.ok(seen.includes('[Defines]'), seen.join(', '));
    assert.ok(seen.includes('[Sources]'), seen.join(', '));
  });

  it('suggests MODULE_TYPE values after `MODULE_TYPE =`', () => {
    const items = collectCompletions('edk2_inf', '  MODULE_TYPE = ', 'defines', index);
    const seen = labels(items);
    assert.ok(seen.includes('DXE_DRIVER'), seen.join(', '));
    assert.ok(seen.includes('PEIM'), seen.join(', '));
  });

  it('suggests PCD names of the typed token space after the dot', () => {
    const items = collectCompletions('edk2_dsc', '  gFixtureTokenSpaceGuid.', 'pcdsfixedatbuild', index);
    const seen = labels(items);
    assert.ok(seen.includes('PcdBootDelay'), seen.join(', '));
    assert.ok(seen.includes('PcdFeatureFlag'), seen.join(', '));
    assert.strictEqual(items.every((i) => i.kind === 'variable'), true);
  });

  it('suggests token spaces and full PCD tokens inside [Pcds...]', () => {
    const items = collectCompletions('edk2_inf', '  g', 'pcdsdynamicex', index);
    const seen = labels(items);
    assert.ok(seen.includes('gFixtureTokenSpaceGuid'), seen.join(', '));
    assert.ok(seen.includes('gFixtureTokenSpaceGuid.PcdBootDelay'), seen.join(', '));
  });

  it('suggests module BaseNames inside [LibraryClasses]', () => {
    const items = collectCompletions('edk2_dsc', '  UefiDriverE', 'libraryclasses', index);
    const seen = labels(items);
    assert.ok(seen.includes('StubDriver'), seen.join(', '));
  });

  it('suggests GUID names inside [Guids]-like sections', () => {
    const items = collectCompletions('edk2_inf', '  gFixtureBoot', 'guids', index);
    const seen = labels(items);
    assert.ok(seen.includes('gFixtureBootGuid'), seen.join(', '));
  });

  it('suggests defines keys in [Defines]', () => {
    const items = collectCompletions('edk2_inf', '  BASE', 'defines', index);
    const seen = labels(items);
    assert.ok(seen.includes('BASE_NAME'), seen.join(', '));
    assert.ok(seen.includes('FILE_GUID'), seen.join(', '));
  });

  it('currentSectionAt finds the enclosing section', () => {
    const text = '[Defines]\n  BASE_NAME = X\n[Sources]\n  A.c\n';
    assert.strictEqual(currentSectionAt(text, 1), 'Defines');
    assert.strictEqual(currentSectionAt(text, 3), 'Sources');
    assert.strictEqual(currentSectionAt(text, 0), 'Defines');
  });

  it('provider smoke: returns CompletionItem array without throwing', async () => {
    const provider = new Edk2CompletionProvider('edk2_inf');
    const doc = {
      lineAt: () => ({ text: '  gFixtureTokenSpaceGuid.' }),
      getText: () => DEC,
      fileName: path.join(root, 'Pkg', 'Pkg.dec'),
    } as any;
    const items = await provider.provideCompletionItems(doc, { line: 4, character: 25 } as any, {} as any, {} as any);
    assert.ok(Array.isArray(items));
  });
});
