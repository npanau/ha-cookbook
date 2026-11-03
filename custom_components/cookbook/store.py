"""Recipe persistence (HA Store, `.storage/cookbook`) and queries."""

from __future__ import annotations

import copy
import uuid
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import DOMAIN
from .models import DEFAULT_RECIPE, fold

STORAGE_KEY = DOMAIN
STORAGE_VERSION = 1
STORAGE_MINOR_VERSION = 1

SUMMARY_FIELDS = (
    "id",
    "name",
    "categories",
    "prep_time",
    "cook_time",
    "total_time",
    "image",
    "updated_at",
)

# Search weights: a match in the name matters more than in the steps.
SEARCH_WEIGHTS = (
    ("name", 10),
    ("categories", 5),
    ("ingredients", 3),
    ("description", 2),
    ("steps", 1),
    ("notes", 1),
)


class RecipeNotFoundError(HomeAssistantError):
    """No recipe with this id."""


class RecipeConflictError(HomeAssistantError):
    """The recipe changed since the client loaded it."""


class _CookbookStorage(Store[dict[str, Any]]):
    """Store with the schema migrations of the cookbook data."""

    async def _async_migrate_func(
        self, old_major_version: int, old_minor_version: int, old_data: dict[str, Any]
    ) -> dict[str, Any]:
        # 1.1 is the first schema: add one block per future version here, e.g.
        # if old_major_version == 1 and old_minor_version < 2: ...
        raise NotImplementedError


def _summary(recipe: dict[str, Any]) -> dict[str, Any]:
    return {key: copy.deepcopy(recipe[key]) for key in SUMMARY_FIELDS}


def _field_text(recipe: dict[str, Any], field: str) -> str:
    value = recipe.get(field)
    if not value:
        return ""
    if field == "categories":
        return " ".join(value)
    if field in ("ingredients", "steps"):
        return " ".join(f"{item.get('section') or ''} {item['text']}" for item in value)
    return value


def _sort_key(recipe: dict[str, Any]) -> str:
    return fold(recipe["name"])


class CookbookStore:
    """In-memory recipes, written to disk on every change."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store = _CookbookStorage(
            hass, STORAGE_VERSION, STORAGE_KEY, minor_version=STORAGE_MINOR_VERSION
        )
        self._recipes: dict[str, dict[str, Any]] = {}

    async def async_load(self) -> None:
        data = await self._store.async_load() or {}
        self._recipes = data.get("recipes", {})

    async def _async_save(self) -> None:
        await self._store.async_save({"recipes": self._recipes})

    async def async_remove_all(self) -> None:
        """Delete the storage file (used when the user asked for it on removal)."""
        self._recipes = {}
        await self._store.async_remove()

    def _matches_category(self, recipe: dict[str, Any], category: str | None) -> bool:
        return category is None or fold(category) in {
            fold(c) for c in recipe["categories"]
        }

    def list(self, category: str | None = None) -> list[dict[str, Any]]:
        recipes = [
            r for r in self._recipes.values() if self._matches_category(r, category)
        ]
        return [_summary(r) for r in sorted(recipes, key=_sort_key)]

    def get(self, recipe_id: str) -> dict[str, Any]:
        if recipe_id not in self._recipes:
            raise RecipeNotFoundError(recipe_id)
        return copy.deepcopy(self._recipes[recipe_id])

    def categories(self) -> list[dict[str, Any]]:
        """Categories with their recipe count; spelling of the first occurrence wins."""
        counts: dict[str, dict[str, Any]] = {}
        for recipe in sorted(self._recipes.values(), key=lambda r: r["created_at"]):
            for category in recipe["categories"]:
                entry = counts.setdefault(
                    fold(category), {"name": category, "count": 0}
                )
                entry["count"] += 1
        return sorted(counts.values(), key=lambda c: fold(c["name"]))

    def search(self, query: str, category: str | None = None) -> list[dict[str, Any]]:
        """Every word must match; ranked by where words match, then by name."""
        tokens = fold(query).split()
        scored = []
        for recipe in self._recipes.values():
            if not self._matches_category(recipe, category):
                continue
            texts = [
                (fold(_field_text(recipe, field)), weight)
                for field, weight in SEARCH_WEIGHTS
            ]
            score = 0
            for token in tokens:
                best = max(
                    (weight for text, weight in texts if token in text), default=0
                )
                if not best:
                    break
                score += best
            else:
                scored.append((score, recipe))
        scored.sort(key=lambda item: (-item[0], _sort_key(item[1])))
        return [_summary(recipe) for _, recipe in scored]

    async def async_create(
        self, fields: dict[str, Any], user_id: str | None
    ) -> dict[str, Any]:
        now = dt_util.utcnow().isoformat()
        recipe = {
            "id": uuid.uuid4().hex,
            **copy.deepcopy(DEFAULT_RECIPE),
            **copy.deepcopy(fields),
            "created_at": now,
            "updated_at": now,
            "created_by": user_id,
            "updated_by": user_id,
        }
        self._recipes[recipe["id"]] = recipe
        await self._async_save()
        return copy.deepcopy(recipe)

    async def async_update(
        self,
        recipe_id: str,
        fields: dict[str, Any],
        user_id: str | None,
        expected_updated_at: str | None = None,
    ) -> dict[str, Any]:
        """Partial update: only the given fields change."""
        recipe = self._recipes.get(recipe_id)
        if recipe is None:
            raise RecipeNotFoundError(recipe_id)
        if (
            expected_updated_at is not None
            and expected_updated_at != recipe["updated_at"]
        ):
            raise RecipeConflictError(recipe_id)
        recipe.update(copy.deepcopy(fields))
        recipe["updated_at"] = dt_util.utcnow().isoformat()
        recipe["updated_by"] = user_id
        await self._async_save()
        return copy.deepcopy(recipe)

    async def async_delete(self, recipe_id: str) -> None:
        if self._recipes.pop(recipe_id, None) is None:
            raise RecipeNotFoundError(recipe_id)
        await self._async_save()
