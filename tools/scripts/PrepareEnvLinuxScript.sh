#!/bin/bash
# VEB Build Provider - Environment Setup Script

# 1. Set environment variables
export TOOLS_DIR=/home/sut/Desktop/VEB/Linux_x64_Aptio_5.x_TOOLS_54/Tools
export AARCH64_TOOLS_DIR=/home/sut/gcc-cross-compiler/arm-gnu-toolchain-12.3.rel1-x86_64-aarch64-none-linux-gnu/bin
# export AARCH64_TOOLS_DIR=/opt/arm-gnu-toolchain-12.3.rel1-x86_64-aarch64-none-linux-gnu/bin
export AARCH64_TOOL_PREFIX=aarch64-none-linux-gnu-
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
export PATH="$JAVA_HOME/bin:$PATH"
export MAKEFLAGS="JAVA=$JAVA_HOME/bin/java"

echo "Environment initialized:"
echo "  TOOLS_DIR: $TOOLS_DIR"
echo "  AARCH64_TOOLS_DIR: $AARCH64_TOOLS_DIR"
echo "  JAVA_HOME: $JAVA_HOME"
echo "  MAKEFLAGS: $MAKEFLAGS"
