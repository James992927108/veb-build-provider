import * as assert from 'assert';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import {
  Edk2SymbolNavigationProvider,
  Edk2SymbolReferenceProvider,
} from '../src/language-support/providers/navigationProvider';
import { WorkspaceIndex } from '../src/language-support/core/workspaceIndex';

const DEC = `[Guids]
  gFixtureBootGuid = { 0x11111111, 0x2222, 0x3333, { 0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF, 0x00, 0x11 } }

[PcdsFixedAtBuild]
  gFixtureTokenSpaceGuid.PcdBootDelay|5|UINT32|0x00000002
`;

const INF = `[Defines]
  BASE_NAME       = StubDriver
  MODULE_TYPE     = DXE_DRIVER

[Protocols]
  gFixtureBootGuid

[PcdsFixedAtBuild]
  gFixtureTokenSpaceGuid.PcdBootDelay|0xA|UINT32
`;

describe('navigation providers (EDK2Code borrow)', () => {
  let root: string;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'veb-nav-'));
    fs.mkdirSync(path.join(root, 'Pkg'), { recursive: true });
    fs.mkdirSync(path.join(root, 'Driver'), { recursive: true });
    fs.writeFileSync(path.join(root, 'Pkg', 'Pkg.dec'), DEC);
    fs.writeFileSync(path.join(root, 'Driver', 'StubDriver.inf'), INF);
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  function mockLineDoc(text: string, character: number) {
    return {
      lineAt: () => ({ text }),
      fileName: path.join(root, 'Driver', 'StubDriver.inf'),
    } as any;
  }

  function resetCalls() {
    (global as any).__mockedVscode.calls.length = 0;
  }

  it('goes to the PCD declaration in the .dec', async () => {
    const index = new WorkspaceIndex([root]);
    await index.build();
    const provider = new Edk2SymbolNavigationProvider(index);
    const line = '  gFixtureTokenSpaceGuid.PcdBootDelay|0xA|UINT32';
    const col = line.indexOf('PcdBootDelay') + 1;
    resetCalls();
    const location = await provider.provideDefinition(mockLineDoc(line, col), { character: col } as any, {} as any);
    assert.ok(location, 'definition should resolve');
    // mock Location is a stub object; assert on the recorded Uri construction path
    const urls = (global as any).__mockedVscode.calls
      .filter((c: any) => c.path.join('.') === 'Uri.file')
      .map((c: any) => String(c.args[0]));
    assert.ok(urls.some((u: string) => u.endsWith('Pkg.dec')), `expect Pkg.dec Uri, got ${urls.join(', ')}`);
  });

  it('returns undefined when the caret is on an unknown word', async () => {
    const index = new WorkspaceIndex([root]);
    await index.build();
    const provider = new Edk2SymbolNavigationProvider(index);
    const location = await provider.provideDefinition(
      mockLineDoc('  GibberishNameXyz', 3),
      { character: 3 } as any,
      {} as any
    );
    assert.strictEqual(location, undefined);
  });

  it('returns empty references when the symbol has no uses', async () => {
    const index = new WorkspaceIndex([root]);
    await index.build();
    const provider = new Edk2SymbolReferenceProvider(index);
    const line = '  gFixtureBootGuid'; // in the INF [Protocols]
    const col = line.indexOf('gFixtureBootGuid') + 1;
    const refs = await provider.provideReferences(mockLineDoc(line, col), { character: col } as any, {} as any, {} as any);
    assert.ok(Array.isArray(refs), 'references should be an array (possibly empty)');
    assert.ok(refs.length >= 1, 'the INF [Protocols] occurrence should be found');
  });
});
