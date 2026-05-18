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
    """Auto-detect JAVA_HOME directory."""
    # 1. Check existing JAVA_HOME environment variable
    java_home = os.environ.get("JAVA_HOME", "")
    if java_home and os.path.isdir(java_home):
        return java_home

    # 2. Try resolving via 'java' or 'javac' binary (follow symlinks)
    for binary in ["java", "javac"]:
        try:
            binary_path = subprocess.check_output(["which", binary], stderr=subprocess.STDOUT).decode().strip()
            if binary_path:
                # Resolve symlinks to get the real path
                real_path = os.path.realpath(binary_path)
                # JAVA_HOME is two levels up from the binary (bin/java -> JAVA_HOME)
                candidate = os.path.dirname(os.path.dirname(real_path))
                if os.path.isdir(os.path.join(candidate, "bin")):
                    return candidate
        except (subprocess.CalledProcessError, FileNotFoundError):
            pass

    # 3. Check common JVM installation paths
    common_paths = [
        "/usr/lib/jvm/java-8-openjdk-amd64",
        "/usr/lib/jvm/java-11-openjdk-amd64",
        "/usr/lib/jvm/java-17-openjdk-amd64",
        "/usr/lib/jvm/java-21-openjdk-amd64",
        "/usr/local/java",
    ]
    for path in common_paths:
        if os.path.isdir(path):
            return path

    # 4. Glob search for any openjdk installation, prefer newer versions
    for pattern in ["/usr/lib/jvm/java-*-openjdk-amd64", "/usr/lib/jvm/java-*"]:
        matches = sorted(glob.glob(pattern))
        for match in reversed(matches):
            if os.path.isdir(match):
                return match

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
