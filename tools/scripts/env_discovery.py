#!/usr/bin/env python3
import os
import subprocess
import sys
import json
import glob

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
        os.path.join(home, "gcc-cross-compiler", toolchain_name, "bin"),
        os.path.join("/opt", toolchain_name, "bin"),
        "/home/sut/gcc-cross-compiler/arm-gnu-toolchain-12.3.rel1-x86_64-aarch64-none-linux-gnu/bin"
    ]

    for path in search_paths:
        if os.path.isdir(path):
            return path

    # 3. Default fallback path
    return "/home/sut/gcc-cross-compiler/arm-gnu-toolchain-12.3.rel1-x86_64-aarch64-none-linux-gnu/bin"

def find_java_home():
    """Auto-detect JAVA_HOME, preferring Java 8 (required by ParseVeB.jar + javax.json)."""
    # 1. Honor explicit JAVA_HOME if already set by the user
    java_home = os.environ.get("JAVA_HOME", "")
    if java_home and os.path.isdir(os.path.join(java_home, "bin")):
        return java_home

    # 2. Prefer Java 8 at well-known paths before resolving 'java' from PATH.
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
    # Run detection
    aarch64_tools_dir = find_toolchain()
    java_home = find_java_home()

    result = {
        "TOOLS_DIR": "/home/sut/Desktop/VEB/Linux_x64_Aptio_5.x_TOOLS_54/Tools",
        "AARCH64_TOOLS_DIR": aarch64_tools_dir,
        "AARCH64_TOOL_PREFIX": "aarch64-none-linux-gnu-",
        "JAVA_HOME": java_home
    }

    if "--json" in sys.argv:
        print(json.dumps(result))
    else:
        for k, v in result.items():
            print(f'export {k}="{v}"')
        print(f'export PATH="$JAVA_HOME/bin:$PATH"')

if __name__ == "__main__":
    main()
