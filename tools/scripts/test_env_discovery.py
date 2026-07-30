#!/usr/bin/env python3
import tempfile
import unittest
import sys
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parent))
import env_discovery
import build_env_config


class BuildToolsDiscoveryTests(unittest.TestCase):
    def test_finds_installed_versions(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            for version in (54, 59):
                tools = root / f"Linux_x64_Aptio_5.x_TOOLS_{version}" / "Tools"
                tools.mkdir(parents=True)
                (tools / "BuildToolsVersion.mak").write_text(
                    f"export BUILD_TOOLS_VERSION={version}\n",
                    encoding="utf-8",
                )

            installed = env_discovery.find_installed_build_tools(root)

            self.assertEqual(set(installed), {54, 59})
            self.assertTrue(installed[59].endswith("TOOLS_59/Tools"))

    @mock.patch("env_discovery.subprocess.check_output")
    def test_reads_highest_release_note_version(self, check_output):
        check_output.return_value = "legacy BuildTools_34 current BuildTools_59"
        with tempfile.TemporaryDirectory() as temp_dir:
            Path(temp_dir, "Vera.chm").touch()

            version = env_discovery.find_required_tools_version(temp_dir, "Vera.veb")

        self.assertEqual(version, 59)

    @mock.patch("env_discovery.find_required_tools_version", return_value=54)
    @mock.patch("env_discovery.find_installed_build_tools")
    def test_prefers_release_note_version(self, installed, _required):
        installed.return_value = {54: "/tools/54", 59: "/tools/59"}

        tools_dir, version, source = env_discovery.find_build_tools("/repo", "Grace.veb")

        self.assertEqual((tools_dir, version, source), ("/tools/54", 54, "release-note"))

    @mock.patch("env_discovery.find_required_tools_version", return_value=None)
    @mock.patch("env_discovery.find_installed_build_tools")
    def test_falls_back_to_latest_installed(self, installed, _required):
        installed.return_value = {54: "/tools/54", 59: "/tools/59"}

        tools_dir, version, source = env_discovery.find_build_tools("/repo", "Unknown.veb")

        self.assertEqual((tools_dir, version, source), ("/tools/59", 59, "latest-installed"))

    def test_tools_59_selects_java_21(self):
        java_home = env_discovery.find_java_home(59)

        self.assertIn("java-21", java_home)

    def test_tools_54_selects_java_8(self):
        with mock.patch.dict("env_discovery.os.environ", {}, clear=True):
            java_home = env_discovery.find_java_home(54)

        self.assertIn("java-8", java_home)

    def test_vera_uses_vr_profile(self):
        self.assertEqual(build_env_config.get_project_profile("Vera.veb"), "vr")
        profile = build_env_config.get_profile("vr")
        self.assertEqual(profile["TOOLS_VERSION"], 59)
        self.assertIn("java-21", profile["JAVA_HOME"])

    def test_gb_targets_use_gb_profile(self):
        for veb_name in ("Grace.veb", "GB300Ali.veb", "GB300Standard.veb"):
            self.assertEqual(build_env_config.get_project_profile(veb_name), "gb")

        profile = build_env_config.get_profile("gb")
        self.assertEqual(profile["TOOLS_VERSION"], 54)
        self.assertIn("java-8", profile["JAVA_HOME"])

    def test_profile_fields_allow_environment_overrides(self):
        overrides = {
            "TOOLS_DIR": "/custom/tools",
            "JAVA_HOME": "/custom/java",
        }
        with mock.patch.dict("build_env_config.os.environ", overrides, clear=False):
            profile = build_env_config.get_profile("vr")

        self.assertEqual(profile["TOOLS_DIR"], "/custom/tools")
        self.assertEqual(profile["JAVA_HOME"], "/custom/java")


if __name__ == "__main__":
    unittest.main()
