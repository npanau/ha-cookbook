"""Versions that must move together (Renovate updates them, this test guards them).

- recipe-scrapers: installed by HA from the manifest, tested from pyproject/uv.lock.
- Home Assistant: the dev/E2E Docker image must be the version the tests run against
  (pinned by pytest-homeassistant-custom-component), and home-assistant-frontend the
  version required by that HA.
"""

import json
import re
import tomllib
from importlib.metadata import version
from pathlib import Path

import homeassistant.components.frontend as ha_frontend

ROOT = Path(__file__).parent.parent


def _lock_version(package: str) -> str:
    lock = tomllib.loads((ROOT / "uv.lock").read_text(encoding="utf-8"))
    return next(p["version"] for p in lock["package"] if p["name"] == package)


def _pin(requirements: list[str], package: str) -> str:
    pins = [r.split("==", 1)[1] for r in requirements if r.startswith(f"{package}==")]
    assert len(pins) == 1, f"{package} must be pinned with == exactly once"
    return pins[0]


def test_recipe_scrapers_versions_match() -> None:
    manifest = json.loads(
        (ROOT / "custom_components/cookbook/manifest.json").read_text(encoding="utf-8")
    )
    pyproject = tomllib.loads((ROOT / "pyproject.toml").read_text(encoding="utf-8"))
    in_manifest = _pin(manifest["requirements"], "recipe-scrapers")
    in_pyproject = _pin(pyproject["dependency-groups"]["dev"], "recipe-scrapers")
    assert in_manifest == in_pyproject == _lock_version("recipe-scrapers")


def test_home_assistant_versions_match() -> None:
    compose = (ROOT / "docker-compose.yml").read_text(encoding="utf-8")
    images = set(re.findall(r"home-assistant:\$\{HA_VERSION:-([^}]+)\}", compose))
    assert images == {version("homeassistant")}, (
        "docker-compose HA image must match the HA version of "
        "pytest-homeassistant-custom-component"
    )

    frontend_manifest = json.loads(
        (Path(ha_frontend.__file__).parent / "manifest.json").read_text(
            encoding="utf-8"
        )
    )
    required = _pin(frontend_manifest["requirements"], "home-assistant-frontend")
    assert version("home-assistant-frontend") == required
