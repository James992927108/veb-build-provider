import * as assert from 'assert';
import { applyLogFilter, logFilterDescription, isLogFilterActive } from '../src/edk2-debug/analysis/logFilter';

const ENTRIES = [
  { module: 'PeiCore', function: 'TestEnhancedDebugMacro', message: '[PEICORE][Test] init DMA', phase: 'PEI' },
  { module: 'DxeCore', function: 'StartTimer', message: '[DXECORE] timer started', phase: 'DXE' },
  { module: 'PeiCore', function: 'BootService', message: 'memory map ready', phase: 'PEI' },
  { module: 'BdsEntry', function: 'LoadBootOption', message: '[BDS] boot option loaded', phase: 'BDS' },
];

describe('applyLogFilter (log filtering)', () => {
  it('returns all entries when the filter is empty', () => {
    assert.strictEqual(applyLogFilter(ENTRIES, {}).length, ENTRIES.length);
  });

  it('filters by exact module name', () => {
    const result = applyLogFilter(ENTRIES, { module: 'PeiCore' });
    assert.strictEqual(result.length, 2);
    assert.ok(result.every((e) => e.module === 'PeiCore'));
  });

  it('filters by phase', () => {
    const result = applyLogFilter(ENTRIES, { phase: 'PEI' });
    assert.strictEqual(result.length, 2);
    assert.ok(result.every((e) => e.phase === 'PEI'));
  });

  it('text search is case-insensitive and spans module/function/message', () => {
    const byMessage = applyLogFilter(ENTRIES, { text: 'dma' });
    assert.strictEqual(byMessage.length, 1);
    assert.strictEqual(byMessage[0].module, 'PeiCore');

    const byFunction = applyLogFilter(ENTRIES, { text: 'starttimer' });
    assert.strictEqual(byFunction.length, 1);
    assert.strictEqual(byFunction[0].function, 'StartTimer');

    const byModuleLower = applyLogFilter(ENTRIES, { text: 'bdsentry' });
    assert.strictEqual(byModuleLower.length, 1);
    assert.strictEqual(byModuleLower[0].module, 'BdsEntry');
  });

  it('combines dimensions with AND semantics', () => {
    const result = applyLogFilter(ENTRIES, { module: 'PeiCore', phase: 'PEI' });
    assert.strictEqual(result.length, 2);

    const narrow = applyLogFilter(ENTRIES, { module: 'PeiCore', text: 'dma' });
    assert.strictEqual(narrow.length, 1);
  });

  it('returns no entries on a non-matching filter', () => {
    assert.strictEqual(applyLogFilter(ENTRIES, { module: 'NoSuchModule' }).length, 0);
    assert.strictEqual(applyLogFilter(ENTRIES, { text: 'zzzz-no-match' }).length, 0);
  });

  it('tolerates entries with missing fields', () => {
    const sparse = [{ module: 'X' }, {}, { message: 'hello world', phase: 'DXE' }];
    assert.strictEqual(applyLogFilter(sparse, { text: 'hello' }).length, 1);
    assert.strictEqual(applyLogFilter(sparse, { phase: 'DXE' }).length, 1);
  });
});

describe('log filter helpers', () => {
  it('isLogFilterActive reflects any active dimension', () => {
    assert.strictEqual(isLogFilterActive({}), false);
    assert.strictEqual(isLogFilterActive({ text: 'x' }), true);
    assert.strictEqual(isLogFilterActive({ module: 'm' }), true);
    assert.strictEqual(isLogFilterActive({ phase: 'p' }), true);
  });

  it('logFilterDescription joins active dimensions', () => {
    assert.strictEqual(logFilterDescription({}), '');
    assert.strictEqual(logFilterDescription({ text: 'dma' }), 'text:"dma"');
    assert.strictEqual(logFilterDescription({ module: 'PeiCore', phase: 'PEI' }), 'PeiCore, PEI');
  });
});