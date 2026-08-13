import * as assert from 'assert';
import {
  Edk2FdfDefinitionProvider,
  Edk2DscDefinitionProvider,
  Edk2DecDefinitionProvider,
  Edk2InfDefinitionProvider,
  Edk2VfrDefinitionProvider,
} from '../src/language-support/providers/definitionProvider';

describe('definition providers (OPT-15)', () => {
  const document = { lineAt: () => ({ text: 'Foo/Bar.inf' }) } as any;
  const position = {} as any;
  const token = {} as any;
  const providers = [
    Edk2FdfDefinitionProvider,
    Edk2DscDefinitionProvider,
    Edk2DecDefinitionProvider,
    Edk2InfDefinitionProvider,
    Edk2VfrDefinitionProvider,
  ];

  for (const P of providers) {
    it(`${P.name} constructs and handles a definition lookup without throwing`, () => {
      const instance = new P();
      assert.doesNotThrow(() => instance.provideDefinition(document, position, token));
    });
  }
});
