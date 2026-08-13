#!/usr/bin/env node
/**
 * validate_syntax_scopes.js
 *
 * Layer-1 validation for the unified syntax scope-naming convention:
 *   <generic-scope>.<subdivision>.<language-suffix>
 *
 * Checks, for every grammar in config/syntaxes/:
 *   1. No scope contains the legacy "BiosLanguage" marker.
 *   2. No cross-file scope borrowing: every custom scope's last segment
 *      must equal that grammar's own suffix.
 *   3. JSON documents parse cleanly.
 *
 * Usage:  node tools/scripts/validate_syntax_scopes.js
 * Exit:   0 = pass, 1 = fail (prints offending scopes).
 */
'use strict';

const fs = require('fs');
const path = require('path');

const SYNTAX_DIR = path.join(__dirname, '..', '..', 'config', 'syntaxes');
// Grammar file -> expected last-segment suffix (from grammar's scopeName).
// language-x86_64-assembly is third-party and deliberately excluded.
const SUFFIX_BY_FILE = {
  'BiosLanguage.tmLanguage_veb.json': 'veb',
  'BiosLanguage.tmLanguage_sdl.json': 'sdl',
  'edk2_dec.tmLanguage.json': 'edk2_dec',
  'edk2_dsc.tmLanguage.json': 'edk2_dsc',
  'edk2_fdf.tmLanguage.json': 'edk2_fdf',
  'edk2_inf.tmLanguage.json': 'edk2_inf',
  'edk2_uni.tmLanguage.json': 'edk2_uni',
  'edk2_vfr.tmLanguage.json': 'edk2_vfr',
  'edk2_cif.tmLanguage.json': 'edk2_cif',
  'ami_build.tmLanguage.json': 'ami_build',
};

let failures = 0;

/** Recursively collect every "name" / capture "name" scope value in a grammar. */
function collectScopes(node, out) {
  if (Array.isArray(node)) {
    node.forEach((n) => collectScopes(n, out));
    return;
  }
  if (node && typeof node === 'object') {
    for (const key of Object.keys(node)) {
      if (key === 'name' && typeof node[key] === 'string') {
        out.push(node[key]);
      } else {
        collectScopes(node[key], out);
      }
    }
  }
}

function fail(filename, msg) {
  failures += 1;
  console.error(`  ✗ ${filename}: ${msg}`);
}

for (const [file, ownSuffix] of Object.entries(SUFFIX_BY_FILE)) {
  const abs = path.join(SYNTAX_DIR, file);
  if (!fs.existsSync(abs)) {
    fail(file, 'file not found');
    continue;
  }

  let grammar;
  try {
    grammar = JSON.parse(fs.readFileSync(abs, 'utf8'));
  } catch (e) {
    fail(file, `invalid JSON: ${e.message}`);
    continue;
  }

  const scopes = [];
  collectScopes(grammar, scopes);

  // Skip standard / third-party scopes (plain "source.c", "text.html", etc.)
  const custom = scopes.filter((s) => s.includes('.'));

  for (const scope of custom) {
    if (scope.includes('BiosLanguage')) {
      fail(file, `legacy BiosLanguage scope: "${scope}"`);
      continue;
    }
    const last = scope.split('.').pop();
    if (last === ownSuffix) continue;

    // Scopes with a generic-only tail (e.g. ends in "string"/"comment") are
    // inherited standard scopes and fine to ignore.
    const STANDARD_TAILS = ['string', 'comment', 'constant', 'keyword', 'variable', 'entity',
      'support', 'invalid', 'storage', 'meta', 'punctuation', 'predefined', 'c'];
    if (STANDARD_TAILS.includes(last)) continue;

    fail(file, `scope "${scope}" does not end in own suffix "${ownSuffix}"`);
  }

  if (scopes.length === 0) {
    fail(file, 'no scopes detected');
  }
}

if (failures === 0) {
  console.log('✓ All grammar scopes consistent (no BiosLanguage, no cross-file borrowing).');
  process.exit(0);
} else {
  console.error(`\n${failures} issue(s) found.`);
  process.exit(1);
}
