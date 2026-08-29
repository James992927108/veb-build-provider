// src/shared/config/globalConfig.ts
// Global configuration for the VEB Build Provider extension.

import * as fs from 'fs';
import * as path from 'path';
import { logWarn } from '../../shared/utils/logger';

/**
 * Read the extension version dynamically from the package.json at the project root.
 */
function getPackageVersion(): string {
  try {
    const packageJsonPath = path.join(__dirname, '../../../package.json');
    const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    return packageData.version || '3.4.0';
  } catch (error) {
    logWarn(`Could not read package.json version, using fallback: ${error}`);
    return '3.4.0'; // fallback version
  }
}

/**
 * Core project information.
 */
const PROJECT_CONFIG = {
  /** Current version - read dynamically from package.json */
  VERSION: getPackageVersion()
} as const;

// Export configuration
export { PROJECT_CONFIG };
