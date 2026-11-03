"""The dev fixtures must stay valid against the current recipe schema."""

import json
from pathlib import Path

from dev.seed import FIXTURES, build_storage


def test_fixtures_match_the_schema() -> None:
    fixtures = json.loads(Path(FIXTURES).read_text(encoding="utf-8"))
    recipes = build_storage(fixtures)["data"]["recipes"]
    assert len(recipes) == len(fixtures)
    # Stable ids: re-seeding keeps the same URLs.
    assert list(recipes) == list(build_storage(fixtures)["data"]["recipes"])
