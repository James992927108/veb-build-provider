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
  const s = (mode: 'auto' | 'always' | 'never') =>
    ({ mode, image: 'img', autoBuildImage: true });

  it('never means never', () => {
    assert.strictEqual(
      shouldUseDocker(s('never'), { dockerAvailable: true, vebRootResolved: true }), false);
  });

  it('always means always, even with nothing available', () => {
    assert.strictEqual(
      shouldUseDocker(s('always'), { dockerAvailable: false, vebRootResolved: false }), true);
  });

  it('auto requires both docker and a resolvable VEB root', () => {
    assert.strictEqual(
      shouldUseDocker(s('auto'), { dockerAvailable: true, vebRootResolved: true }), true);
    assert.strictEqual(
      shouldUseDocker(s('auto'), { dockerAvailable: false, vebRootResolved: true }), false);
    assert.strictEqual(
      shouldUseDocker(s('auto'), { dockerAvailable: true, vebRootResolved: false }), false);
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
    assert.strictEqual(env.VEB_DOCKER_FALLBACK, '1');
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
});
