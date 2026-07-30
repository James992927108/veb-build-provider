#!/usr/bin/env python3
import os
import subprocess
import sys
import json
import glob
import re
from pathlib import Path

from build_env_config import (
    get_profile,
    get_profile_for_tools_version,
    get_project_profile,
)

TOOLS_DIRECTORY_PATTERN = "Linux_x64_Aptio_5.x_TOOLS_*"


def find_installed_build_tools(veb_root=None):
    """Return installed AMI build tools keyed by numeric version."""
    roots = []
    if veb_root:
        roots = [Path(veb_root).expanduser()]
    elif os.environ.get("VEB_ROOT"):
        roots = [Path(os.environ["VEB_ROOT"]).expanduser()]
    else:
        roots = [
            Path.home() / "Desktop" / "VEB",
            Path("/home/sut/Desktop/VEB"),
        ]

    installed = {}
    for root in roots:
        if not root.is_dir():
            continue
        for candidate in root.glob(TOOLS_DIRECTORY_PATTERN):
            match = re.search(r"_TOOLS_(\d+)$", candidate.name)
            tools_dir = candidate / "Tools"
            if match and (tools_dir / "BuildToolsVersion.mak").is_file():
                installed[int(match.group(1))] = str(tools_dir)
    return installed


def find_required_tools_version(workspace, veb_name):
    """Read BuildTools_xx from the selected project's latest CHM release page."""
    if not workspace or not veb_name:
        return None

    chm_path = Path(workspace) / f"{Path(veb_name).stem}.chm"
    if not chm_path.is_file():
        return None

    try:
        release_notes = subprocess.check_output(
            ["7z", "e", "-so", str(chm_path), "Release Notes.htm"],
            stderr=subprocess.DEVNULL,
            text=True,
        )
    except (subprocess.CalledProcessError, FileNotFoundError, UnicodeDecodeError):
        return None

    versions = [int(version) for version in re.findall(r"BuildTools_(\d+)", release_notes)]
    return max(versions) if versions else None


def find_build_tools(workspace=None, veb_name=None, veb_root=None):
    """Select the CHM-required version, falling back to the latest installed one."""
    installed = find_installed_build_tools(veb_root)
    if not installed:
        return "/home/sut/Desktop/VEB/Linux_x64_Aptio_5.x_TOOLS_54/Tools", 54, "fallback"

    required = find_required_tools_version(workspace, veb_name)
    if required in installed:
        return installed[required], required, "release-note"

    latest = max(installed)
    return installed[latest], latest, "latest-installed"

def find_toolchain():
    """Auto-detect aarch64 toolchain bin directory."""
    # 1. Try via 'which' command
    try:
        compiler_path = subprocess.check_output(["which", "aarch64-none-linux-gnu-gcc"], stderr=subprocess.STDOUT).decode().strip()
        if compiler_path:
            return os.path.dirname(compiler_path)
    except (subprocess.CalledProcessError, FileNotFoundError):
        pass

    # 2. Check common installation paths
    home = os.path.expanduser("~")
    toolchain_name = "arm-gnu-toolchain-12.3.rel1-x86_64-aarch64-none-linux-gnu"
    search_paths = [
        os.path.join(home, "Desktop", "VEB", "toolchains", toolchain_name, "bin"),
        os.path.join(home, "gcc-cross-compiler", toolchain_name, "bin"),
        os.path.join("/opt", toolchain_name, "bin"),
        "/home/sut/gcc-cross-compiler/arm-gnu-toolchain-12.3.rel1-x86_64-aarch64-none-linux-gnu/bin"
    ]

    for path in search_paths:
        if os.path.isdir(path):
            return path

    # 3. Default fallback path
    return "/home/sut/gcc-cross-compiler/arm-gnu-toolchain-12.3.rel1-x86_64-aarch64-none-linux-gnu/bin"

def find_java_home(tools_version=None):
    """Auto-detect the Java runtime required by the selected AMI tools."""
    # BuildTools_59 binaries use Java 21 class files (class version 65).
    if tools_version is not None and tools_version >= 59:
        java21_patterns = [
            "/usr/lib/jvm/java-21-openjdk-amd64",
            "/usr/lib/jvm/java-21-openjdk-arm64",
            "/usr/lib/jvm/java-1.21.0-openjdk-amd64",
            "/usr/lib/jvm/java-21-*",
        ]
        for pattern in java21_patterns:
            for candidate in sorted(glob.glob(pattern)) or [pattern]:
                if os.path.isdir(os.path.join(candidate, "bin")):
                    return candidate

    # 1. Honor explicit JAVA_HOME if already set by the user
    java_home = os.environ.get("JAVA_HOME", "")
    if java_home and os.path.isdir(os.path.join(java_home, "bin")):
        return java_home

    # BuildTools_54 requires Java 8 + javax.json.
    #    ParseVeB.jar requires Java 8 + javax.json, which was removed in Java 9+.
    #    The system default 'java' is often a newer version (e.g. Java 21 on Ubuntu 22.04).
    java8_patterns = [
        "/usr/lib/jvm/java-8-openjdk-amd64",
        "/usr/lib/jvm/java-8-openjdk-arm64",
        "/usr/lib/jvm/java-1.8.0-openjdk-amd64",
        "/usr/lib/jvm/java-1.8*",
        "/usr/lib/jvm/java-8-*",
    ]
    for pattern in java8_patterns:
        for candidate in sorted(glob.glob(pattern)) or [pattern]:
            if os.path.isdir(os.path.join(candidate, "bin")):
                return candidate

    # 3. Fall back to resolving 'java' / 'javac' from PATH
    for binary in ["java", "javac"]:
        try:
            binary_path = subprocess.check_output(["which", binary], stderr=subprocess.STDOUT).decode().strip()
            if binary_path:
                real_path = os.path.realpath(binary_path)
                candidate = os.path.dirname(os.path.dirname(real_path))
                if os.path.isdir(os.path.join(candidate, "bin")):
                    return candidate
        except (subprocess.CalledProcessError, FileNotFoundError):
            pass

    # 4. Check other common JVM installation paths
    for p in ["/usr/lib/jvm/java-11-openjdk-amd64", "/usr/lib/jvm/java-17-openjdk-amd64",
              "/usr/lib/jvm/java-21-openjdk-amd64", "/usr/local/java"]:
        if os.path.isdir(os.path.join(p, "bin")):
            return p

    # 5. Default fallback
    return "/usr/lib/jvm/java-8-openjdk-amd64"

def main():
    def argument_value(name):
        try:
            return sys.argv[sys.argv.index(name) + 1]
        except (ValueError, IndexError):
            return None

    workspace = argument_value("--workspace")
    veb_name = argument_value("--veb")
    profile_name = get_project_profile(veb_name)

    if profile_name:
        result = get_profile(profile_name)
        result["TOOLS_SOURCE"] = "config"
    else:
        tools_dir, tools_version, tools_source = find_build_tools(
            workspace=workspace,
            veb_name=veb_name,
            veb_root=argument_value("--veb-root"),
        )
        fallback_profile = get_profile_for_tools_version(tools_version)
        if fallback_profile:
            result = get_profile(fallback_profile)
            result["TOOLS_DIR"] = tools_dir
        else:
            result = {
                "PROFILE": "auto",
                "TOOLS_VERSION": tools_version,
                "TOOLS_DIR": tools_dir,
                "AARCH64_TOOLS_DIR": find_toolchain(),
                "AARCH64_TOOL_PREFIX": "aarch64-none-linux-gnu-",
                "JAVA_HOME": find_java_home(tools_version),
            }
        result["TOOLS_SOURCE"] = tools_source

    if "--json" in sys.argv:
        print(json.dumps(result))
    else:
        for k, v in result.items():
            print(f'export {k}="{v}"')
        print(f'export PATH="$JAVA_HOME/bin:$PATH"')

if __name__ == "__main__":
    main()
