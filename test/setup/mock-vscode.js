'use strict';
/**
 * test/setup/mock-vscode.js
 *
 * Headless test bootstrap: intercepts `require('vscode')` so source modules
 * that import the VS Code API can be unit-tested without launching the
 * Electron extension host.
 *
 * Every property access, call and `new` returns another stub so arbitrary
 * chained API usage does not throw. Calls are RECORDED into the global
 * registry `global.__mockedVscode.calls` as `{ path, args }` so tests can
 * assert that a specific API was invoked (e.g. showWarningMessage).
 *
 * Usage:  mocha --require ./test/setup/mock-vscode.js ...
 */
const Module = require('module');

const registry = (global.__mockedVscode = (global.__mockedVscode || { calls: [] }));

function makeStub(path) {
  const fullPath = path || [];
  function target() {}
  return new Proxy(target, {
    get(t, prop) {
      if (prop === Symbol.toPrimitive) return () => '';
      if (prop === Symbol.toStringTag) return 'vscode-stub';
      if (prop === 'then') return undefined; // not a thenable
      return makeStub(fullPath.concat(String(prop)));
    },
    apply(t, thisArg, args) {
      registry.calls.push({ path: fullPath, args });
      return makeStub(fullPath);
    },
    construct(t, args) {
      registry.calls.push({ path: fullPath, args });
      return makeStub(fullPath);
    },
    set() { return true; },
  });
}

Module._load = (function (original) {
  return function (request, parent, isMain) {
    if (request === 'vscode') return makeStub([]);
    return original.apply(this, arguments);
  };
})(Module._load);

module.exports = makeStub([]);
