import * as assert from 'assert';
import { Edk2DscSymbolProvider } from '../src/language-support/providers/symbolProvider';

declare const global: any;

function resetCalls() {
  global.__mockedVscode.calls.length = 0;
}

/** All string args passed to `new vscode.DocumentSymbol(...)` during last call. */
function documentSymbolStringArgs(): string[] {
  return global.__mockedVscode.calls
    .filter((c: any) => c.path.join('.') === 'DocumentSymbol')
    .flatMap((c: any) => c.args)
    .filter((a: any) => typeof a === 'string');
}

describe('symbolProvider CRLF handling (OPT-10)', () => {
  it('does not leak a trailing CR into symbol names on CRLF files', async () => {
    resetCalls();
    const crlfDoc = { getText: () => '[Defines]\r\nFooBar = 0x1\r\n[Ppis]\r\n' } as any;
    const provider = new Edk2DscSymbolProvider();
    await provider.provideDocumentSymbols(crlfDoc, {} as any);

    const strArgs = documentSymbolStringArgs();
    assert.strictEqual(strArgs.some((s) => s.includes('\r')), false, 'no CR should appear in symbol args');
    assert.ok(strArgs.some((s) => s === 'Defines'), 'section Defines should resolve without CR');
  });

  it('still works with LF files', async () => {
    resetCalls();
    const lfDoc = { getText: () => '[Defines]\nFooBar = 0x1\n' } as any;
    const provider = new Edk2DscSymbolProvider();
    await provider.provideDocumentSymbols(lfDoc, {} as any);

    const strArgs = documentSymbolStringArgs();
    assert.strictEqual(strArgs.some((s) => s.includes('\r')), false);
    assert.ok(strArgs.some((s) => s === 'Defines'));
  });
});
