"""Store and model tests."""

from typing import Any

import pytest
import voluptuous as vol
from homeassistant.core import HomeAssistant

from custom_components.cookbook.models import RECIPE_FIELDS_SCHEMA, fold
from custom_components.cookbook.store import (
    STORAGE_KEY,
    CookbookStore,
    RecipeConflictError,
    RecipeNotFoundError,
)


async def _store(hass: HomeAssistant) -> CookbookStore:
    store = CookbookStore(hass)
    await store.async_load()
    return store


def test_fold_removes_accents_and_case() -> None:
    assert fold("Crème BRÛLÉE") == "creme brulee"


def test_schema_normalizes_fields() -> None:
    fields = RECIPE_FIELDS_SCHEMA(
        {
            "name": "  Tarte  ",
            "description": "   ",
            "categories": ["Dessert", "dessert", " Désserts ", "", "Fruits"],
            "ingredients": [
                "200 g de farine",
                {"text": "  ", "section": None},
                {"text": "1 œuf"},
            ],
            "steps": [{"text": "Cuire", "section": " Four "}],
            "source_url": "",
        }
    )
    assert fields == {
        "name": "Tarte",
        "description": None,
        "categories": ["Dessert", "Désserts", "Fruits"],
        "ingredients": [
            {"text": "200 g de farine", "section": None},
            {"text": "1 œuf", "section": None},
        ],
        "steps": [{"text": "Cuire", "section": "Four"}],
        "source_url": None,
    }


async def test_matched_ingredients_are_limited(
    hass: HomeAssistant, hass_storage
) -> None:
    store = await _store(hass)
    ingredients = [{"text": f"{n} g de sucre", "section": None} for n in range(1, 9)]
    await store.async_create({"name": "Sucré", "ingredients": ingredients}, None)
    matched = store.search("sucre")[0]["matched_ingredients"]
    assert matched == [f"{n} g de sucre" for n in range(1, 6)]


@pytest.mark.parametrize(
    "fields",
    [
        {"name": "   "},
        {"prep_time": -1},
        {"prep_time": True},
        {"prep_time": "10"},
        {"source_url": "javascript:alert(1)"},
        {"ingredients": [{"section": "x"}]},
        {"id": "forced"},
        {"created_by": "someone"},
    ],
)
def test_schema_rejects_invalid_fields(fields: dict[str, Any]) -> None:
    with pytest.raises(vol.Invalid):
        RECIPE_FIELDS_SCHEMA(fields)


async def test_create_get_update_delete(hass: HomeAssistant, hass_storage) -> None:
    store = await _store(hass)
    recipe = await store.async_create({"name": "Quiche", "servings": "4"}, "user-1")

    assert recipe["id"]
    assert recipe["name"] == "Quiche"
    assert recipe["categories"] == []
    assert recipe["created_by"] == recipe["updated_by"] == "user-1"
    assert recipe["created_at"] == recipe["updated_at"]
    assert store.get(recipe["id"]) == recipe

    updated = await store.async_update(recipe["id"], {"notes": "Bonne"}, "user-2")
    assert updated["notes"] == "Bonne"
    assert updated["servings"] == "4"  # partial update keeps the other fields
    assert updated["created_by"] == "user-1"
    assert updated["updated_by"] == "user-2"
    assert updated["updated_at"] > recipe["updated_at"]

    await store.async_delete(recipe["id"])
    with pytest.raises(RecipeNotFoundError):
        store.get(recipe["id"])
    with pytest.raises(RecipeNotFoundError):
        await store.async_delete(recipe["id"])


async def test_returned_recipes_are_copies(hass: HomeAssistant, hass_storage) -> None:
    store = await _store(hass)
    recipe = await store.async_create({"name": "Soupe", "categories": ["Hiver"]}, None)
    recipe["categories"].append("hacked")
    store.get(recipe["id"])["categories"].append("hacked")
    assert store.get(recipe["id"])["categories"] == ["Hiver"]


async def test_update_conflict(hass: HomeAssistant, hass_storage) -> None:
    store = await _store(hass)
    recipe = await store.async_create({"name": "Pâtes"}, None)
    await store.async_update(recipe["id"], {"notes": "v2"}, None, recipe["updated_at"])

    with pytest.raises(RecipeConflictError):
        await store.async_update(
            recipe["id"], {"notes": "v3"}, None, recipe["updated_at"]
        )
    assert store.get(recipe["id"])["notes"] == "v2"


async def test_persistence(hass: HomeAssistant, hass_storage) -> None:
    store = await _store(hass)
    recipe = await store.async_create({"name": "Gratin"}, "user-1")

    assert hass_storage[STORAGE_KEY]["version"] == 1
    assert hass_storage[STORAGE_KEY]["minor_version"] == 1
    assert recipe["id"] in hass_storage[STORAGE_KEY]["data"]["recipes"]

    reloaded = await _store(hass)
    assert reloaded.get(recipe["id"]) == recipe


async def test_remove_all(hass: HomeAssistant, hass_storage) -> None:
    store = await _store(hass)
    await store.async_create({"name": "Gratin"}, None)
    await store.async_remove_all()

    assert STORAGE_KEY not in hass_storage
    assert (await _store(hass)).list() == []


async def test_list_categories_and_search(hass: HomeAssistant, hass_storage) -> None:
    store = await _store(hass)
    brulee = await store.async_create(
        {
            "name": "Crème brûlée",
            "categories": ["Dessert"],
            "ingredients": [{"text": "4 œufs", "section": None}],
        },
        None,
    )
    tarte = await store.async_create(
        {
            "name": "Tarte aux pommes",
            "categories": ["dessert", "Fruits"],
            "description": "Une tarte avec de la crème",
        },
        None,
    )
    omelette = await store.async_create(
        {"name": "Omelette", "ingredients": [{"text": "3 œufs", "section": None}]}, None
    )

    assert [r["name"] for r in store.list()] == [
        "Crème brûlée",
        "Omelette",
        "Tarte aux pommes",
    ]
    assert [r["id"] for r in store.list("DESSERT")] == [brulee["id"], tarte["id"]]
    assert set(store.list()[0]) == {
        "id",
        "name",
        "categories",
        "prep_time",
        "cook_time",
        "total_time",
        "image",
        "updated_at",
    }

    assert store.categories() == [
        {"name": "Dessert", "count": 2},
        {"name": "Fruits", "count": 1},
    ]

    # Accent/case-insensitive; the name match ranks above the description match.
    assert [r["id"] for r in store.search("CREME")] == [brulee["id"], tarte["id"]]
    # All words must match.
    assert [r["id"] for r in store.search("oeufs omelette")] == [omelette["id"]]
    assert [r["id"] for r in store.search("œufs", category="dessert")] == [brulee["id"]]
    assert store.search("introuvable") == []

    # Search results tell which ingredient lines matched (list results do not).
    by_id = {r["id"]: r for r in store.search("oeuf")}
    assert by_id[brulee["id"]]["matched_ingredients"] == ["4 œufs"]
    assert by_id[omelette["id"]]["matched_ingredients"] == ["3 œufs"]
    assert store.search("tarte")[0]["matched_ingredients"] == []
    assert "matched_ingredients" not in store.list()[0]
    assert len(store.search("  ")) == 3
