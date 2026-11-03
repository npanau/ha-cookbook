"""Replace the recipes of the DEV Home Assistant with dev/fixtures/recipes.json.

Usage: `make seed` (stops the dev HA, writes its storage file, starts it again).
Only ever writes dev/config/.storage/cookbook: never point it at a real instance.
"""

from __future__ import annotations

import json
import shutil
import sys
import uuid
from datetime import UTC, datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from custom_components.cookbook.models import (  # noqa: E402
    DEFAULT_RECIPE,
    RECIPE_FIELDS_SCHEMA,
)
from custom_components.cookbook.store import (  # noqa: E402
    STORAGE_KEY,
    STORAGE_MINOR_VERSION,
    STORAGE_VERSION,
)

FIXTURES = ROOT / "dev" / "fixtures" / "recipes.json"
TARGET = ROOT / "dev" / "config" / ".storage" / STORAGE_KEY
PHOTOS = ROOT / "dev" / "config" / "cookbook" / "images"


def build_storage(fixtures: list[dict]) -> dict:
    """Validate the fixtures with the integration schema and build the storage file."""
    start = datetime(2026, 11, 1, 9, 0, tzinfo=UTC)
    recipes = {}
    for index, raw in enumerate(fixtures):
        fields = RECIPE_FIELDS_SCHEMA(raw)
        when = (start + timedelta(hours=index)).isoformat()
        recipe = {
            "id": uuid.uuid5(uuid.NAMESPACE_URL, f"cookbook-fixture-{index}").hex,
            **DEFAULT_RECIPE,
            **fields,
            "created_at": when,
            "updated_at": when,
            "created_by": None,
            "updated_by": None,
        }
        recipes[recipe["id"]] = recipe
    return {
        "version": STORAGE_VERSION,
        "minor_version": STORAGE_MINOR_VERSION,
        "key": STORAGE_KEY,
        "data": {"recipes": recipes},
    }


def main() -> None:
    storage = build_storage(json.loads(FIXTURES.read_text(encoding="utf-8")))
    TARGET.parent.mkdir(parents=True, exist_ok=True)
    # The demo recipes have no photo: drop those of the replaced recipes.
    shutil.rmtree(PHOTOS, ignore_errors=True)
    TARGET.write_text(
        json.dumps(storage, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    count = len(storage["data"]["recipes"])
    print(f"{count} recipes written to {TARGET.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
