// src/veb-build/core/dockerConfig.ts
//
// Docker build 模式的純邏輯。刻意不 import vscode，方便單元測試。
//
// 設計：image 內把 AMI BuildTools 與 cross toolchain 烘在固定路徑 CONTAINER_VEB_ROOT，
// 與宿主的 VEB 根目錄無關。宿主路徑因人而異（可用 VEB_ROOT 覆寫），若直接沿用會讓
// image 綁死在某台機器上。因此產生容器用的環境腳本時，把宿主 VEB 根前綴換成固定路徑。

/** Image 內 AMI tools 與 toolchain 的根目錄。 */
export const CONTAINER_VEB_ROOT = '/opt/veb';

/** 由 env_discovery.py 回傳、本模組會用到的欄位。 */
export interface DiscoveredEnv {
  PROFILE: string;
  TOOLS_DIR: string;
  TOOLS_VERSION: number | string;
  TOOLS_SOURCE?: string;
  AARCH64_TOOLS_DIR: string;
  AARCH64_TOOL_PREFIX: string;
  JAVA_HOME: string;
}

export type DockerMode = 'auto' | 'always' | 'never';

export interface DockerSettings {
  mode: DockerMode;
  image: string;
  autoBuildImage: boolean;
  /** docker 不存在時，是否讓 DockerBuild.sh 嘗試自動安裝（需要 sudo）。 */
  autoInstallDocker: boolean;
}

/**
 * 從 TOOLS_DIR 反推宿主的 VEB 根目錄。
 * TOOLS_DIR 形如 <root>/Linux_x64_Aptio_5.x_TOOLS_59/Tools，取其祖父層。
 * 形狀不符時回傳 undefined —— 呼叫端據此放棄 docker 模式而非猜測路徑。
 */
export function deriveVebRoot(toolsDir: string): string | undefined {
  const m = toolsDir.match(/^(.*)\/Linux_x64_Aptio_5\.x_TOOLS_\d+\/Tools\/?$/);
  return m ? m[1] : undefined;
}

/**
 * 把探測到的宿主環境轉成容器內環境。
 * 只換 VEB 根前綴；JAVA_HOME 之類的系統路徑在 image 內相同，保持不動。
 */
export function toContainerEnv(env: DiscoveredEnv, vebRoot: string): DiscoveredEnv {
  const swap = (p: string): string =>
    p.startsWith(vebRoot + '/') ? CONTAINER_VEB_ROOT + p.slice(vebRoot.length) : p;
  return {
    ...env,
    TOOLS_DIR: swap(env.TOOLS_DIR),
    AARCH64_TOOLS_DIR: swap(env.AARCH64_TOOLS_DIR),
  };
}

/**
 * 產生環境設定腳本內容。宿主與容器共用同一份樣板，差別只在傳入的 env。
 * 寫成純函式，讓腳本內容能被測試涵蓋。
 */
export function renderEnvScript(env: DiscoveredEnv): string {
  return `#!/bin/bash
# VEB Build Provider - Environment Setup Script

# 1. Set environment variables (automatically detected)
export VEB_BUILD_PROFILE="${env.PROFILE}"
export TOOLS_DIR="${env.TOOLS_DIR}"
export TOOLS_VERSION="${env.TOOLS_VERSION}"
export AARCH64_TOOLS_DIR="${env.AARCH64_TOOLS_DIR}"
export AARCH64_TOOL_PREFIX="${env.AARCH64_TOOL_PREFIX}"
export JAVA_HOME="${env.JAVA_HOME}"
export PATH="$JAVA_HOME/bin:$PATH"
export MAKEFLAGS="JAVA=$JAVA_HOME/bin/java"

echo "Environment initialized:"
echo "  VEB_BUILD_PROFILE: $VEB_BUILD_PROFILE"
echo "  TOOLS_DIR: $TOOLS_DIR"
echo "  TOOLS_VERSION: $TOOLS_VERSION (${env.TOOLS_SOURCE ?? 'unknown'})"
echo "  AARCH64_TOOLS_DIR: $AARCH64_TOOLS_DIR"
echo "  JAVA_HOME: $JAVA_HOME"
echo "  MAKEFLAGS: $MAKEFLAGS"
`;
}

/**
 * 決定這次 build 要不要走容器。
 *
 * auto   = 能定位 VEB 根（image build context 的必要條件）就走容器。
 *          docker 當下不存在也沒關係 —— 只要允許自動安裝，DockerBuild.sh
 *          會先裝好再繼續；真的裝不起來時它自己會回落到宿主。
 *          不允許自動安裝時，才退回「docker 必須當下可用」的判斷。
 * always = 一定走容器，缺條件時由呼叫端報錯而不是偷偷回落
 * never  = 永遠走宿主
 */
export function shouldUseDocker(
  settings: DockerSettings,
  probe: {
    dockerAvailable: boolean;
    /**
     * VEB 根目錄已定位「而且確實存在」。呼叫端必須真的去確認目錄在不在 ——
     * env_discovery.py 找不到工具時會回傳寫死的預設路徑，形狀完全合法但指向空氣。
     */
    vebRootResolved: boolean;
  }
): boolean {
  if (settings.mode === 'never') { return false; }
  if (settings.mode === 'always') { return true; }
  if (!probe.vebRootResolved) { return false; }
  return probe.dockerAvailable || settings.autoInstallDocker;
}
