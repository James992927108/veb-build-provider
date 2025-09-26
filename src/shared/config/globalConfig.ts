// src/shared/config/globalConfig.ts
// Global Configuration for VEB Build Provider Extension

import * as fs from 'fs';
import * as path from 'path';

/**
 * 動態讀取 package.json 版本號
 */
function getPackageVersion(): string {
  try {
    // 找到專案根目錄的 package.json
    const packageJsonPath = path.join(__dirname, '../../../package.json');
    const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    return packageData.version || '3.4.0';
  } catch (error) {
    console.warn('Warning: Could not read package.json version, using fallback:', error);
    return '3.4.0'; // 備用版本號
  }
}

/**
 * 核心專案資訊
 */
const PROJECT_CONFIG = {
  /** 專案名稱 */
  NAME: 'veb-build-provider',
  /** 顯示名稱 */
  DISPLAY_NAME: 'VEB Build Provider',
  /** 當前版本號 - 動態從 package.json 讀取 */
  VERSION: getPackageVersion(),
  /** 發佈者 */
  PUBLISHER: 'aivres-bios'
} as const;

// 導出配置
export { PROJECT_CONFIG };

// 便利別名
export const PROJECT = PROJECT_CONFIG;