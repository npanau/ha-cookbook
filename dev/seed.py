"""Replace the recipes of the DEV Home Assistant with dev/fixtures/recipes.json.

Usage: `make seed` (stops the dev HA, writes its storage file, starts it again).
Only ever writes dev/config/.storage/cookbook and dev/config/cookbook/images: never
point it at a real instance. A fixture may name a photo of dev/fixtures/photos/
(generated images, no third-party content) with its `photo` key; it goes through the
same processing as an uploaded photo.
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

from custom_components.cookbook.images import SIZES, process_image  # noqa: E402
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
SOURCE_PHOTOS = ROOT / "dev" / "fixtures" / "photos"
PHOTOS = ROOT / "dev" / "config" / "cookbook" / "images"


def build_storage(fixtures: list[dict]) -> tuple[dict, dict[str, Path]]:
    """Validate the fixtures with the integration schema and build the storage file.

    Also returns the source photo of each image id.
    """
    start = datetime(2026, 11, 1, 9, 0, tzinfo=UTC)
    recipes = {}
    photos = {}
    for index, raw in enumerate(fixtures):
        raw = dict(raw)
        photo = raw.pop("photo", None)
        fields = RECIPE_FIELDS_SCHEMA(raw)
        when = (start + timedelta(hours=index)).isoformat()
        image_id = None
        if photo:
            image_id = uuid.uuid5(uuid.NAMESPACE_URL, f"cookbook-photo-{index}").hex
            photos[image_id] = SOURCE_PHOTOS / photo
        recipe = {
            "id": uuid.uuid5(uuid.NAMESPACE_URL, f"cookbook-fixture-{index}").hex,
            **DEFAULT_RECIPE,
            **fields,
            "image": image_id,
            "created_at": when,
            "updated_at": when,
            "created_by": None,
            "updated_by": None,
        }
        recipes[recipe["id"]] = recipe
    storage = {
        "version": STORAGE_VERSION,
        "minor_version": STORAGE_MINOR_VERSION,
        "key": STORAGE_KEY,
        "data": {"recipes": recipes},
    }
    return storage, photos


def write_photos(photos: dict[str, Path], directory: Path) -> None:
    """Replace every photo of `directory` with the processed fixture photos."""
    shutil.rmtree(directory, ignore_errors=True)
    directory.mkdir(parents=True)
    for image_id, source in photos.items():
        versions = process_image(source.read_bytes())
        for size in SIZES:
            (directory / f"{image_id}-{size}.webp").write_bytes(versions[size])


def main() -> None:
    storage, photos = build_storage(json.loads(FIXTURES.read_text(encoding="utf-8")))
    TARGET.parent.mkdir(parents=True, exist_ok=True)
    write_photos(photos, PHOTOS)
    TARGET.write_text(
        json.dumps(storage, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    count = len(storage["data"]["recipes"])
    print(
        f"{count} recipes written to {TARGET.relative_to(ROOT)}, "
        f"{len(photos)} photos to {PHOTOS.relative_to(ROOT)}"
    )


if __name__ == "__main__":
    main()
