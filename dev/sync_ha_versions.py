"""Align the HA Docker image and home-assistant-frontend on the HA of the test library.

pytest-homeassistant-custom-component pins Home Assistant; the dev/E2E Docker image and
home-assistant-frontend must follow it (tests/test_versions.py checks it). Renovate only
bumps the test library; run `make sync-ha` on its PR branch to align the rest.
"""

from __future__ import annotations

import json
import re
from importlib.metadata import version
from pathlib import Path

import homeassistant.components.frontend as ha_frontend

ROOT = Path(__file__).resolve().parent.parent


def main() -> None:
    ha_version = version("homeassistant")
    manifest = json.loads(
        (Path(ha_frontend.__file__).parent / "manifest.json").read_text(
            encoding="utf-8"
        )
    )
    frontend = next(
        r.split("==", 1)[1]
        for r in manifest["requirements"]
        if r.startswith("home-assistant-frontend==")
    )

    compose = ROOT / "docker-compose.yml"
    compose.write_text(
        re.sub(
            r"(home-assistant:\$\{HA_VERSION:-)[^}]+(\})",
            rf"\g<1>{ha_version}\g<2>",
            compose.read_text(encoding="utf-8"),
        ),
        encoding="utf-8",
    )
    pyproject = ROOT / "pyproject.toml"
    pyproject.write_text(
        re.sub(
            r'"home-assistant-frontend==[^"]+"',
            f'"home-assistant-frontend=={frontend}"',
            pyproject.read_text(encoding="utf-8"),
        ),
        encoding="utf-8",
    )
    print(f"Home Assistant {ha_version}, home-assistant-frontend {frontend}")


if __name__ == "__main__":
    main()
