import * as assert from 'assert';
import {
  CONTAINER_VEB_ROOT,
  DiscoveredEnv,
  deriveVebRoot,
  renderEnvScript,
  shouldUseDocker,
  toContainerEnv,
} from '../src/veb-build/core/dockerConfig';
import { buildLinuxTasksJson, parseToolsDirFromEnvScript } from '../src/veb-build/commands/buildCommands';

const HOST_ROOT = '/home/someone/Desktop/VEB';

function hostEnv(): DiscoveredEnv {
  return {
    PROFILE: 'vr',
    TOOLS_DIR: `${HOST_ROOT}/Linux_x64_Aptio_5.x_TOOLS_59/Tools`,
    TOOLS_VERSION: 59,
    TOOLS_SOURCE: 'config',
    AARCH64_TOOLS_DIR: `${HOST_ROOT}/toolchains/arm-gnu-toolchain-12.3.rel1-x86_64-aarch64-none-linux-gnu/bin`,
    AARCH64_TOOL_PREFIX: 'aarch64-none-linux-gnu-',
    JAVA_HOME: '/usr/lib/jvm/java-21-openjdk-amd64',
  };
}

describe('dockerConfig.deriveVebRoot', () => {
  it('derives the VEB root from a TOOLS_DIR', () => {
    assert.strictEqual(deriveVebRoot(`${HOST_ROOT}/Linux_x64_Aptio_5.x_TOOLS_59/Tools`), HOST_ROOT);
  });

  it('tolerates a trailing slash', () => {
    assert.strictEqual(deriveVebRoot(`${HOST_ROOT}/Linux_x64_Aptio_5.x_TOOLS_54/Tools/`), HOST_ROOT);
  });

  it('works for any TOOLS version number', () => {
    assert.strictEqual(deriveVebRoot(`${HOST_ROOT}/Linux_x64_Aptio_5.x_TOOLS_100/Tools`), HOST_ROOT);
  });

  it('returns undefined for an unexpected shape rather than guessing', () => {
    assert.strictEqual(deriveVebRoot('/opt/somewhere/else'), undefined);
    assert.strictEqual(deriveVebRoot(`${HOST_ROOT}/Linux_x64_Aptio_5.x_TOOLS_59`), undefined);
  });

  // 這個行為是刻意的，但很容易被誤用，所以釘住它。
  // env_discovery.py 在機器上找不到任何 AMI tools 時，會回傳 profile 裡寫死的預設
  // 路徑（TOOLS_SOURCE=config）。那串路徑形狀完全合法，deriveVebRoot 會照樣解析成功。
  // 因此呼叫端「必須」另外確認目錄真的存在，不能只靠這個函式的回傳值判斷可用性。
  it('parses a well-formed path even when nothing exists there (callers must stat)', () => {
    assert.strictEqual(
      deriveVebRoot('/home/nobody/Desktop/VEB/Linux_x64_Aptio_5.x_TOOLS_54/Tools'),
      '/home/nobody/Desktop/VEB');
  });
});

describe('dockerConfig.toContainerEnv', () => {
  it('rewrites VEB-root paths to the fixed in-image root', () => {
    const c = toContainerEnv(hostEnv(), HOST_ROOT);
    assert.strictEqual(c.TOOLS_DIR, `${CONTAINER_VEB_ROOT}/Linux_x64_Aptio_5.x_TOOLS_59/Tools`);
    assert.ok(c.AARCH64_TOOLS_DIR.startsWith(`${CONTAINER_VEB_ROOT}/toolchains/`));
  });

  it('leaves system paths untouched', () => {
    const c = toContainerEnv(hostEnv(), HOST_ROOT);
    assert.strictEqual(c.JAVA_HOME, '/usr/lib/jvm/java-21-openjdk-amd64');
    assert.strictEqual(c.AARCH64_TOOL_PREFIX, 'aarch64-none-linux-gnu-');
    assert.strictEqual(c.PROFILE, 'vr');
  });

  it('does not rewrite a path that merely shares a name prefix', () => {
    const env = { ...hostEnv(), AARCH64_TOOLS_DIR: `${HOST_ROOT}-backup/toolchains/bin` };
    const c = toContainerEnv(env, HOST_ROOT);
    assert.strictEqual(c.AARCH64_TOOLS_DIR, `${HOST_ROOT}-backup/toolchains/bin`);
  });
});

describe('dockerConfig.shouldUseDocker', () => {
  const s = (mode: 'auto' | 'always' | 'never', autoInstallDocker = true) =>
    ({ mode, image: 'img', autoBuildImage: true, autoInstallDocker });

  it('never means never', () => {
    assert.strictEqual(
      shouldUseDocker(s('never'), { dockerAvailable: true, vebRootResolved: true }), false);
  });

  it('always means always, even with nothing available', () => {
    assert.strictEqual(
      shouldUseDocker(s('always'), { dockerAvailable: false, vebRootResolved: false }), true);
  });

  it('auto uses docker when it is already available', () => {
    assert.strictEqual(
      shouldUseDocker(s('auto'), { dockerAvailable: true, vebRootResolved: true }), true);
  });

  it('auto still picks docker when it is missing but may be installed', () => {
    assert.strictEqual(
      shouldUseDocker(s('auto', true), { dockerAvailable: false, vebRootResolved: true }), true,
      'the runner installs docker before building; it falls back itself if that fails');
  });

  it('auto falls back to the host when docker is missing and auto-install is off', () => {
    assert.strictEqual(
      shouldUseDocker(s('auto', false), { dockerAvailable: false, vebRootResolved: true }), false);
  });

  it('auto always needs a resolvable VEB root, since it is the image build context', () => {
    assert.strictEqual(
      shouldUseDocker(s('auto', true), { dockerAvailable: true, vebRootResolved: false }), false);
    assert.strictEqual(
      shouldUseDocker(s('auto', true), { dockerAvailable: false, vebRootResolved: false }), false);
  });
});

describe('dockerConfig.renderEnvScript', () => {
  it('emits the container root for a container env', () => {
    const script = renderEnvScript(toContainerEnv(hostEnv(), HOST_ROOT));
    assert.ok(script.includes(`export TOOLS_DIR="${CONTAINER_VEB_ROOT}/Linux_x64_Aptio_5.x_TOOLS_59/Tools"`));
    assert.ok(!script.includes(HOST_ROOT), 'no host path should leak into the container script');
  });

  it('keeps shell variables literal so the script still expands them at run time', () => {
    const script = renderEnvScript(hostEnv());
    assert.ok(script.includes('export PATH="$JAVA_HOME/bin:$PATH"'));
    assert.ok(script.includes('export MAKEFLAGS="JAVA=$JAVA_HOME/bin/java"'));
  });
});

describe('parseToolsDirFromEnvScript', () => {
  it('reads TOOLS_DIR back out of a generated script', () => {
    const script = renderEnvScript(hostEnv());
    assert.strictEqual(parseToolsDirFromEnvScript(script), `${HOST_ROOT}/Linux_x64_Aptio_5.x_TOOLS_59/Tools`);
  });

  it('returns undefined when the line is absent', () => {
    assert.strictEqual(parseToolsDirFromEnvScript('#!/bin/bash\necho hi\n'), undefined);
  });
});

describe('buildLinuxTasksJson - docker mode', () => {
  const docker = {
    image: 'veb-bios-build:24.04',
    hostVebRoot: HOST_ROOT,
    autoBuildImage: true,
    autoInstallDocker: true,
    allowFallback: true,
  };

  it('routes build/rebuild/clean through DockerBuild.sh with the right make args', () => {
    const parsed = JSON.parse(buildLinuxTasksJson('MyProj', '3.12.0', docker));
    const byLabel = (l: string) => parsed.tasks.find((t: any) => t.label === l);

    assert.ok(byLabel('VebBuildTask').command.includes('.vscode/DockerBuild.sh'));
    assert.ok(byLabel('VebBuildTask').command.trim().endsWith('DockerBuild.sh'),
      'incremental build passes no make args');
    assert.ok(byLabel('VebReBuildTask').command.trim().endsWith('DockerBuild.sh rebuild'));
    assert.ok(byLabel('VebCleanTask').command.trim().endsWith('DockerBuild.sh clean'));
  });

  it('passes docker settings to the runner through options.env', () => {
    const parsed = JSON.parse(buildLinuxTasksJson('MyProj', '3.12.0', docker));
    const env = parsed.tasks.find((t: any) => t.label === 'VebBuildTask').options.env;
    assert.strictEqual(env.VEB, 'MyProj');
    assert.strictEqual(env.VEB_DOCKER_IMAGE, 'veb-bios-build:24.04');
    assert.strictEqual(env.VEB_HOST_VEB_ROOT, HOST_ROOT);
    assert.strictEqual(env.VEB_DOCKER_AUTOBUILD, '1');
    assert.strictEqual(env.VEB_DOCKER_AUTOINSTALL, '1');
    assert.strictEqual(env.VEB_DOCKER_FALLBACK, '1');
  });

  it('encodes auto-install off so the runner does not try to apt-install', () => {
    const parsed = JSON.parse(buildLinuxTasksJson('MyProj', '3.12.0', { ...docker, autoInstallDocker: false }));
    const env = parsed.tasks.find((t: any) => t.label === 'VebBuildTask').options.env;
    assert.strictEqual(env.VEB_DOCKER_AUTOINSTALL, '0');
  });

  it('encodes mode=always as no-fallback', () => {
    const parsed = JSON.parse(buildLinuxTasksJson('MyProj', '3.12.0', { ...docker, allowFallback: false }));
    const env = parsed.tasks.find((t: any) => t.label === 'VebBuildTask').options.env;
    assert.strictEqual(env.VEB_DOCKER_FALLBACK, '0');
  });

  it('leaves host mode completely unchanged when no docker config is given', () => {
    const parsed = JSON.parse(buildLinuxTasksJson('MyProj', '3.12.0'));
    const bt = parsed.tasks.find((t: any) => t.label === 'VebBuildTask');
    assert.ok(bt.command.includes('PrepareEnvLinuxScript.sh'));
    assert.ok(!bt.command.includes('DockerBuild.sh'));
    assert.deepStrictEqual(Object.keys(bt.options.env), ['VEB']);
  });

  it('still produces all 5 tasks in docker mode', () => {
    const parsed = JSON.parse(buildLinuxTasksJson('MyProj', '3.12.0', docker));
    assert.strictEqual(parsed.tasks.length, 5);
  });

  // Release/Custom 跑的是專案自己的腳本，仍在宿主執行。給它們 docker 變數不會
  // 改變行為，只會讓讀 tasks.json 的人誤判它們也走容器。
  it('does not put docker settings on the tasks that still run on the host', () => {
    const parsed = JSON.parse(buildLinuxTasksJson('MyProj', '3.12.0', docker));
    for (const label of ['VebReleaseBuildTask', 'VebCustomBuildTask']) {
      const t = parsed.tasks.find((x: any) => x.label === label);
      assert.deepStrictEqual(Object.keys(t.options.env), ['VEB'],
        `${label} runs on the host, so it should only carry VEB`);
      assert.ok(t.command.includes('PrepareEnvLinuxScript.sh'));
    }
  });
});

describe('docker_build.sh runner', () => {
  const fs = require('fs');
  const path = require('path');
  // 從 process.cwd() 解析而非 __dirname：測試會被編譯到 out-test/test/，
  // __dirname 的相對層數與原始碼位置不同。mocha 由專案根執行。
  const script: string = fs.readFileSync(
    path.join(process.cwd(), 'tools', 'scripts', 'docker_build.sh'), 'utf8');

  // 曾經寫成 `make > "$LOG" 2>&1` 再 tail 尾段，結果 BIOS build 跑十幾分鐘期間
  // VS Code 的 task 終端機完全沒有輸出，跟宿主模式的體驗差很多。
  it('streams build output live through tee instead of redirecting to a file', () => {
    assert.ok(/make \$MAKE_ARGS 2>&1 \| tee/.test(script),
      'make output must be piped through tee so the task terminal shows progress');
    assert.ok(!/make \$MAKE_ARGS >/.test(script),
      'must not redirect make output straight into the log file');
  });

  it('takes the exit code from make, not from tee', () => {
    assert.ok(script.includes('PIPESTATUS[0]'),
      'a tee pipeline reports tee\'s status, so make\'s must be read explicitly');
  });

  it('only requests a TTY when one is actually present', () => {
    assert.ok(/\[\[ -t 1 \]\] && TTY_FLAG=\(-t\)/.test(script),
      'docker run -t without a TTY fails outright, so it must be conditional');
  });

  it('does not pass -i, which would suspend the backgrounded client on SIGTTIN', () => {
    assert.ok(!/docker run --rm[^\n]*\s-i\b/.test(script),
      'the build needs no stdin, and a background process reading the terminal gets SIGTTIN');
  });

  // 中斷處理有兩個獨立的坑，兩個都必須成立才有效，所以分開釘住。
  it('runs the container in the background and waits, so the trap can fire', () => {
    assert.ok(/<\/dev\/null &\s*\nDOCKER_PID=\$!/.test(script),
      'bash defers traps until a foreground command returns, and docker run never does');
    assert.ok(script.includes('wait "$DOCKER_PID"'));
  });

  it('stops the container by name on INT/TERM rather than relying on signal propagation', () => {
    assert.ok(script.includes('--name "$CONTAINER_NAME"'));
    assert.ok(/trap '[^']*stop_container' INT TERM/.test(script),
      'PID 1 in a container drops signals it has no handler for, so the host must docker kill');
    assert.ok(/docker kill "\$CONTAINER_NAME"/.test(script));
  });

  it('reports an interrupted build differently from a failed one', () => {
    assert.ok(script.includes('$RC -gt 128'),
      'wait returns 128+signum when interrupted; that is not a compile error');
  });
});

describe('host-mode task command', () => {
  // `make | tee` 的退出碼取自 tee，永遠 0 —— 在此之前 VS Code 從來看不出
  // 宿主 build 失敗過。容器模式用 PIPESTATUS 取到真正的退出碼，這裡對齊。
  it('sets pipefail so a failed make is not masked by tee', () => {
    const parsed = JSON.parse(buildLinuxTasksJson('MyProj', '3.13.0'));
    for (const label of ['VebBuildTask', 'VebReBuildTask', 'VebCleanTask']) {
      const t = parsed.tasks.find((x: any) => x.label === label);
      assert.ok(t.command.includes('set -o pipefail'), `${label} must not mask make's exit code`);
    }
  });
});
