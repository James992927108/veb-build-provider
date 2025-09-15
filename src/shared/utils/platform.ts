// src/shared/utils/platform.ts

import * as fs from 'fs/promises';
import { logDebug } from './logger';

export interface PlatformInfo {
  platform: string;
  isWSL: boolean;
  platformName: string;
}

export async function detectPlatform(): Promise<PlatformInfo> {
  const platform = process.platform;
  let isWSL = false;
  let platformName = '';

  if (platform === 'linux') {
    // Check environment variables first (fastest)
    isWSL = !!(process.env.WSL_DISTRO_NAME || process.env.WSLENV);

    if (!isWSL) {
      // Check /proc/version as fallback
      try {
        const version = await fs.readFile('/proc/version', 'utf8');
        isWSL = version.toLowerCase().includes('microsoft') || version.toLowerCase().includes('wsl');
      } catch {
        // If we can't read /proc/version, assume not WSL
        logDebug("Unable to read /proc/version, assuming not WSL");
      }
    }

    platformName = isWSL ? 'WSL (Windows Subsystem for Linux)' : 'Linux';
  } else if (platform === 'win32') {
    platformName = 'Windows';
  } else if (platform === 'darwin') {
    platformName = 'macOS';
  } else {
    platformName = `Unknown (${platform})`;
  }

  return { platform, isWSL, platformName };
}

export function formatPlatformInfo(platformInfo: PlatformInfo): string {
  const { platform, isWSL, platformName } = platformInfo;

  if (isWSL) {
    const distroName = process.env.WSL_DISTRO_NAME || 'Unknown';
    return `${platformName} (Distro: ${distroName})`;
  }

  return platformName;
}