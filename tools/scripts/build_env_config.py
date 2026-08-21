"""Build environment profiles used by the VEB Build Provider."""

import os
from pathlib import Path

_VEB_ROOT = os.environ.get("VEB_ROOT", str(Path.home() / "Desktop" / "VEB"))
_TOOLCHAIN_NAME = "arm-gnu-toolchain-12.3.rel1-x86_64-aarch64-none-linux-gnu"

_PROFILES = {
    "gb": {
        "tools_version": 54,
        "tools_dir": f"{_VEB_ROOT}/Linux_x64_Aptio_5.x_TOOLS_54/Tools",
        "aarch64_tools_dir": f"{_VEB_ROOT}/toolchains/{_TOOLCHAIN_NAME}/bin",
        "aarch64_tool_prefix": "aarch64-none-linux-gnu-",
        "java_home": "/usr/lib/jvm/java-8-openjdk-amd64",
    },
    "vr": {
        "tools_version": 59,
        "tools_dir": f"{_VEB_ROOT}/Linux_x64_Aptio_5.x_TOOLS_59/Tools",
        "aarch64_tools_dir": f"{_VEB_ROOT}/toolchains/{_TOOLCHAIN_NAME}/bin",
        "aarch64_tool_prefix": "aarch64-none-linux-gnu-",
        "java_home": "/usr/lib/jvm/java-21-openjdk-amd64",
    },
}

_PROJECT_PROFILES = {
    "Ali": "gb",
    "Ant": "gb",
    "ByteDance": "gb",
    "GB300Ali": "gb",
    "GB300Standard": "gb",
    "Grace": "gb",
    "Standard": "gb",
    "Vera": "vr",
}

_WORKSPACE_PROFILE_MARKERS = {
    "Vera.chm": "vr",
    "Grace.chm": "gb",
}


def get_workspace_profile(workspace):
    """Return the profile identified by a unique CHM marker in the workspace."""
    if not workspace:
        return None

    workspace_path = Path(workspace)
    matches = {
        profile_name
        for marker_name, profile_name in _WORKSPACE_PROFILE_MARKERS.items()
        if (workspace_path / marker_name).is_file()
    }
    return matches.pop() if len(matches) == 1 else None


def get_project_profile(veb_name):
    """Return the configured profile name for a VEB filename."""
    if not veb_name:
        return None
    return _PROJECT_PROFILES.get(Path(veb_name).stem)


def get_profile(profile_name):
    """Resolve a profile and allow environment variables to override fields."""
    selected_name = os.environ.get("VEB_BUILD_PROFILE", profile_name)
    if selected_name not in _PROFILES:
        raise KeyError(f"Unknown VEB build profile: {selected_name}")

    profile = _PROFILES[selected_name]
    return {
        "PROFILE": selected_name,
        "TOOLS_VERSION": int(os.environ.get("TOOLS_VERSION", profile["tools_version"])),
        "TOOLS_DIR": os.environ.get("TOOLS_DIR", profile["tools_dir"]),
        "AARCH64_TOOLS_DIR": os.environ.get(
            "AARCH64_TOOLS_DIR", profile["aarch64_tools_dir"]
        ),
        "AARCH64_TOOL_PREFIX": os.environ.get(
            "AARCH64_TOOL_PREFIX", profile["aarch64_tool_prefix"]
        ),
        "JAVA_HOME": os.environ.get("JAVA_HOME", profile["java_home"]),
    }


def get_profile_for_tools_version(tools_version):
    """Return a profile name matching a BuildTools version."""
    for profile_name, profile in _PROFILES.items():
        if profile["tools_version"] == int(tools_version):
            return profile_name
    return None
