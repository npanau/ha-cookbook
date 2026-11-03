"""Recipe model: validation and normalization of client-provided fields."""

from __future__ import annotations

import unicodedata
from typing import Any

import voluptuous as vol

MAX_NAME = 200
MAX_SHORT_TEXT = 200
MAX_TEXT = 20_000
MAX_ITEM_TEXT = 2_000
MAX_ITEMS = 500
MAX_CATEGORIES = 50
MAX_URL = 2_000
MAX_MINUTES = 100_000

# Fields a client may send; id, dates, authors and image are server-managed.
EDITABLE_FIELDS = (
    "name",
    "description",
    "categories",
    "prep_time",
    "cook_time",
    "total_time",
    "servings",
    "ingredients",
    "steps",
    "notes",
    "source_url",
)

DEFAULT_RECIPE: dict[str, Any] = {
    "description": None,
    "categories": [],
    "prep_time": None,
    "cook_time": None,
    "total_time": None,
    "servings": None,
    "ingredients": [],
    "steps": [],
    "notes": None,
    "image": None,
    "source_url": None,
}


# Ligatures that Unicode decomposition leaves untouched ("œufs" must match "oeufs").
_LIGATURES = str.maketrans({"œ": "oe", "Œ": "oe", "æ": "ae", "Æ": "ae"})


def fold(text: str) -> str:
    """Lowercase and strip accents, for comparisons and search ("Crème" -> "creme")."""
    decomposed = unicodedata.normalize("NFKD", text.translate(_LIGATURES))
    return "".join(c for c in decomposed if not unicodedata.combining(c)).casefold()


def _empty_to_none(value: str) -> str | None:
    return value or None


def _optional_text(max_len: int) -> vol.Any:
    return vol.Any(
        None, vol.All(str, vol.Strip, vol.Length(max=max_len), _empty_to_none)
    )


def _url(value: str | None) -> str | None:
    if value is not None and not value.startswith(("http://", "https://")):
        raise vol.Invalid("source_url must start with http:// or https://")
    return value


def _dedupe_categories(values: list[str]) -> list[str]:
    """Drop empties and case/accent-insensitive duplicates (first spelling wins)."""
    seen: set[str] = set()
    result = []
    for value in values:
        key = fold(value)
        if value and key not in seen:
            seen.add(key)
            result.append(value)
    return result


def _wrap_text_item(value: str) -> dict[str, Any]:
    return {"text": value}


ITEM_SCHEMA = vol.Schema(
    {
        vol.Required("text"): vol.All(str, vol.Strip, vol.Length(max=MAX_ITEM_TEXT)),
        vol.Optional("section", default=None): _optional_text(MAX_SHORT_TEXT),
    }
)


def _drop_empty_items(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [item for item in items if item["text"]]


# A plain string is accepted as shorthand for {"text": ..., "section": null}.
ITEMS = vol.All(
    vol.Length(max=MAX_ITEMS),
    [vol.All(vol.Any(vol.All(str, _wrap_text_item), dict), ITEM_SCHEMA)],
    _drop_empty_items,
)


def _strict_int(value: Any) -> int:
    # bool is a subclass of int in Python: reject it explicitly.
    if isinstance(value, bool) or not isinstance(value, int):
        raise vol.Invalid("expected an integer number of minutes")
    return value


MINUTES = vol.Any(None, vol.All(_strict_int, vol.Range(min=0, max=MAX_MINUTES)))

# Validators of the editable fields, used as optional keys by the WebSocket commands.
FIELD_VALIDATORS: dict[str, Any] = {
    "name": vol.All(str, vol.Strip, vol.Length(min=1, max=MAX_NAME)),
    "description": _optional_text(MAX_TEXT),
    "categories": vol.All(
        vol.Length(max=MAX_CATEGORIES),
        [vol.All(str, vol.Strip, vol.Length(max=MAX_SHORT_TEXT))],
        _dedupe_categories,
    ),
    "prep_time": MINUTES,
    "cook_time": MINUTES,
    "total_time": MINUTES,
    "servings": _optional_text(MAX_SHORT_TEXT),
    "ingredients": ITEMS,
    "steps": ITEMS,
    "notes": _optional_text(MAX_TEXT),
    "source_url": vol.All(_optional_text(MAX_URL), _url),
}

RECIPE_FIELDS_SCHEMA = vol.Schema(
    {vol.Optional(key): validator for key, validator in FIELD_VALIDATORS.items()}
)
