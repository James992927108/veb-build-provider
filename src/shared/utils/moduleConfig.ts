// src/shared/utils/moduleConfig.ts
//
// Two-layer module switches. Level-1 master keys (vebBuild.modules.*) gate the
// whole registration groups in extension.ts; Level-2 feature keys
// (vebBuild.modules.<module>.*) gate individual sub-features inside each
// module. Every key defaults to enabled, and configuration is read once at
// activation, so changing a setting requires "Developer: Reload Window" to
// take effect (no hot reload of providers).

import * as vscode from 'vscode';

/** Read a Level-1 master switch (missing keys default to enabled). */
export function isMasterModuleEnabled(key: string): boolean {
    return vscode.workspace.getConfiguration('vebBuild.modules').get(key, true);
}

/** Read a Level-2 per-module feature switch (missing keys default to enabled). */
export function isModuleFeatureEnabled(module: string, key: string): boolean {
    return vscode.workspace.getConfiguration(`vebBuild.modules.${module}`).get(key, true);
}
