#!/bin/bash
# VEB Build Provider - Environment Setup Script

# Static VR fallback used only outside the F8-generated task flow.
# F8 loads tools/scripts/build_env_config.py through env_discovery.py.
export VEB_BUILD_PROFILE=vr
export TOOLS_VERSION=59
export TOOLS_DIR=/home/sut/Desktop/VEB/Linux_x64_Aptio_5.x_TOOLS_59/Tools
export AARCH64_TOOLS_DIR=/home/sut/Desktop/VEB/toolchains/arm-gnu-toolchain-12.3.rel1-x86_64-aarch64-none-linux-gnu/bin
export AARCH64_TOOL_PREFIX=aarch64-none-linux-gnu-
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export PATH="$JAVA_HOME/bin:$PATH"
export MAKEFLAGS="JAVA=$JAVA_HOME/bin/java"

echo "Environment initialized:"
echo "  VEB_BUILD_PROFILE: $VEB_BUILD_PROFILE"
echo "  TOOLS_DIR: $TOOLS_DIR"
echo "  TOOLS_VERSION: $TOOLS_VERSION"
echo "  AARCH64_TOOLS_DIR: $AARCH64_TOOLS_DIR"
echo "  JAVA_HOME: $JAVA_HOME"
echo "  MAKEFLAGS: $MAKEFLAGS"
