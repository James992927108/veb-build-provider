import * as assert from 'assert';
import { applySearchCap } from '../src/edk2-debug/core/crossFolderNavigator';

describe('applySearchCap (OPT-8)', () => {
  it('keeps all files when under the cap (not truncated)', () => {
    const r = applySearchCap([1, 2, 3], 500);
    assert.deepStrictEqual(r.files, [1, 2, 3]);
    assert.strictEqual(r.truncated, false);
  });

  it('caps at the limit and reports truncation', () => {
    const r = applySearchCap([1, 2, 3, 4, 5], 3);
    assert.deepStrictEqual(r.files, [1, 2, 3]);
    assert.strictEqual(r.truncated, true);
    assert.strictEqual(r.cap, 3);
  });
});
