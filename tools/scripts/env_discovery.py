#!/usr/bin/env python3
import os
import subprocess
import sys
import json

def find_toolchain():
    """自動尋找 aarch64 工具鏈的 bin 目錄"""
    # 1. 嘗試透過 which 指令尋找
    try:
        compiler_path = subprocess.check_output(["which", "aarch64-none-linux-gnu-gcc"], stderr=subprocess.STDOUT).decode().strip()
        if compiler_path:
            return os.path.dirname(compiler_path)
    except (subprocess.CalledProcessError, FileNotFoundError):
        pass

    # 2. 檢查常見的安裝路徑
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
            
    # 3. 預設回退路徑
    return "/home/sut/gcc-cross-compiler/arm-gnu-toolchain-12.3.rel1-x86_64-aarch64-none-linux-gnu/bin"

def main():
    # 執行偵測
    aarch64_tools_dir = find_toolchain()
    
    # 定義環境變數
    result = {
        "TOOLS_DIR": "/home/sut/Desktop/VEB/Linux_x64_Aptio_5.x_TOOLS_54/Tools",
        "AARCH64_TOOLS_DIR": aarch64_tools_dir,
        "AARCH64_TOOL_PREFIX": "aarch64-none-linux-gnu-"
    }
    
    # 輸出結果
    if "--json" in sys.argv:
        print(json.dumps(result))
    else:
        for k, v in result.items():
            print(f'export {k}="{v}"')

if __name__ == "__main__":
    main()
