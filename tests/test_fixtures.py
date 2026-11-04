"""The dev fixtures must stay valid against the current recipe schema."""

import json
from pathlib import Path

from custom_components.cookbook.images import SIZES
from dev.seed import FIXTURES, build_storage, write_photos


def _fixtures() -> list[dict]:
    return json.loads(Path(FIXTURES).read_text(encoding="utf-8"))


def test_fixtures_match_the_schema() -> None:
    fixtures = _fixtures()
    storage, _ = build_storage(fixtures)
    recipes = storage["data"]["recipes"]
    assert len(recipes) == len(fixtures)
    # Stable ids: re-seeding keeps the same URLs.
    assert list(recipes) == list(build_storage(fixtures)[0]["data"]["recipes"])


def test_fixture_photos_are_processed(tmp_path: Path) -> None:
    storage, photos = build_storage(_fixtures())
    with_photo = [r for r in storage["data"]["recipes"].values() if r["image"]]
    assert with_photo
    assert {r["image"] for r in with_photo} == set(photos)
    assert all(source.is_file() for source in photos.values())

    stale = tmp_path / "stale-large.webp"
    stale.write_bytes(b"old")
    write_photos(photos, tmp_path)
    expected = {f"{image_id}-{size}.webp" for image_id in photos for size in SIZES}
    assert {p.name for p in tmp_path.iterdir()} == expected
