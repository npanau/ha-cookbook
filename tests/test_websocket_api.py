"""WebSocket API tests: commands, permissions and errors."""

from typing import Any
from unittest.mock import patch

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry, MockUser
from pytest_homeassistant_custom_component.typing import (
    MockHAClientWebSocket,
    WebSocketGenerator,
)

from custom_components.cookbook.const import DOMAIN
from custom_components.cookbook.scraper import ScrapeError


@pytest.fixture
async def entry(hass: HomeAssistant, hass_storage) -> MockConfigEntry:
    entry = MockConfigEntry(domain=DOMAIN)
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


@pytest.fixture
async def admin_ws(
    hass: HomeAssistant, entry: MockConfigEntry, hass_ws_client: WebSocketGenerator
) -> MockHAClientWebSocket:
    """Client authenticated as the owner (admin) from hass_access_token."""
    return await hass_ws_client(hass)


@pytest.fixture
async def user_ws(
    hass: HomeAssistant,
    entry: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    hass_read_only_access_token: str,
) -> MockHAClientWebSocket:
    """Client authenticated as a non-admin user."""
    return await hass_ws_client(hass, hass_read_only_access_token)


async def _call(
    ws: MockHAClientWebSocket, command: str, **payload: Any
) -> dict[str, Any]:
    await ws.send_json_auto_id({"type": f"cookbook/{command}", **payload})
    return await ws.receive_json()


async def _ok(ws: MockHAClientWebSocket, command: str, **payload: Any) -> Any:
    response = await _call(ws, command, **payload)
    assert response["success"], response
    return response["result"]


async def _error(ws: MockHAClientWebSocket, command: str, **payload: Any) -> str:
    response = await _call(ws, command, **payload)
    assert not response["success"], response
    return response["error"]["code"]


async def test_crud_by_non_admin_user(
    user_ws: MockHAClientWebSocket, hass_read_only_user: MockUser
) -> None:
    recipe = await _ok(
        user_ws,
        "create",
        name="Crème brûlée",
        categories=["Dessert"],
        prep_time=20,
        ingredients=[
            "4 jaunes d'œufs",
            {"text": "50 cl de crème", "section": "Appareil"},
        ],
    )
    assert recipe["created_by"] == hass_read_only_user.id
    assert recipe["created_by_name"] == hass_read_only_user.name
    assert recipe["ingredients"][0] == {"text": "4 jaunes d'œufs", "section": None}

    fetched = await _ok(user_ws, "get", recipe_id=recipe["id"])
    assert fetched == recipe

    updated = await _ok(
        user_ws,
        "update",
        recipe_id=recipe["id"],
        expected_updated_at=recipe["updated_at"],
        cook_time=40,
    )
    assert updated["cook_time"] == 40
    assert updated["prep_time"] == 20

    listed = await _ok(user_ws, "list")
    assert [r["id"] for r in listed["recipes"]] == [recipe["id"]]
    assert (await _ok(user_ws, "list", category="dessert"))["recipes"] == listed[
        "recipes"
    ]
    assert (await _ok(user_ws, "list", category="Plat"))["recipes"] == []

    found = await _ok(user_ws, "search", query="creme brulee")
    assert [r["id"] for r in found["recipes"]] == [recipe["id"]]
    assert found["recipes"][0]["matched_ingredients"] == ["50 cl de crème"]

    categories = await _ok(user_ws, "categories")
    assert categories == {"categories": [{"name": "Dessert", "count": 1}]}


async def test_delete_is_admin_only(
    user_ws: MockHAClientWebSocket, admin_ws: MockHAClientWebSocket
) -> None:
    recipe = await _ok(user_ws, "create", name="Quiche")

    assert await _error(user_ws, "delete", recipe_id=recipe["id"]) == "unauthorized"
    assert await _ok(user_ws, "get", recipe_id=recipe["id"])

    assert await _ok(admin_ws, "delete", recipe_id=recipe["id"]) is None
    assert await _error(admin_ws, "get", recipe_id=recipe["id"]) == "not_found"


async def test_update_records_last_editor(
    hass: HomeAssistant,
    user_ws: MockHAClientWebSocket,
    admin_ws: MockHAClientWebSocket,
    hass_read_only_user: MockUser,
) -> None:
    recipe = await _ok(user_ws, "create", name="Soupe")
    updated = await _ok(admin_ws, "update", recipe_id=recipe["id"], notes="Plus de sel")

    assert updated["created_by"] == hass_read_only_user.id
    assert updated["updated_by"] != hass_read_only_user.id
    admin = await hass.auth.async_get_user(updated["updated_by"])
    assert admin is not None and admin.is_admin
    assert updated["updated_by_name"] == admin.name


async def test_errors(admin_ws: MockHAClientWebSocket) -> None:
    assert await _error(admin_ws, "get", recipe_id="missing") == "not_found"
    assert (
        await _error(admin_ws, "update", recipe_id="missing", name="x") == "not_found"
    )
    assert await _error(admin_ws, "delete", recipe_id="missing") == "not_found"

    # Validation errors.
    assert await _error(admin_ws, "create") == "invalid_format"
    assert await _error(admin_ws, "create", name="  ") == "invalid_format"
    assert await _error(admin_ws, "create", name="x", prep_time=-5) == "invalid_format"
    # Server-managed fields cannot be forced by the client.
    assert (
        await _error(admin_ws, "create", name="x", created_by="me") == "invalid_format"
    )
    assert await _error(admin_ws, "create", name="x", image="a.jpg") == "invalid_format"

    # Concurrent modification.
    recipe = await _ok(admin_ws, "create", name="Pâtes")
    await _ok(admin_ws, "update", recipe_id=recipe["id"], notes="v2")
    code = await _error(
        admin_ws,
        "update",
        recipe_id=recipe["id"],
        expected_updated_at=recipe["updated_at"],
        notes="v3",
    )
    assert code == "conflict"


async def test_not_loaded(
    hass: HomeAssistant, entry: MockConfigEntry, admin_ws: MockHAClientWebSocket
) -> None:
    assert await hass.config_entries.async_unload(entry.entry_id)
    assert await _error(admin_ws, "list") == "not_loaded"


async def test_author_names_when_unknown_or_deleted(
    hass: HomeAssistant,
    entry: MockConfigEntry,
    admin_ws: MockHAClientWebSocket,
    hass_read_only_user: MockUser,
) -> None:
    # No author (e.g. created by a service call) and author since deleted from HA.
    anonymous = await entry.runtime_data.async_create({"name": "Sans auteur"}, None)
    orphan = await entry.runtime_data.async_create(
        {"name": "Orpheline"}, hass_read_only_user.id
    )
    await hass.auth.async_remove_user(hass_read_only_user)

    for recipe in (anonymous, orphan):
        fetched = await _ok(admin_ws, "get", recipe_id=recipe["id"])
        assert fetched["created_by_name"] is None
        assert fetched["updated_by_name"] is None


SCRAPED = {
    "name": "Crème brûlée",
    "description": None,
    "categories": ["Dessert"],
    "prep_time": 20,
    "cook_time": 50,
    "total_time": 70,
    "servings": 8,
    "servings_unit": None,
    "ingredients": [{"text": "6 jaunes d'oeuf", "section": None}],
    "steps": [{"text": "Cuire.", "section": None}],
    "notes": None,
    "source_url": "https://www.marmiton.org/recettes/creme-brulee.aspx",
}


async def test_scrape_returns_a_preview_without_saving(
    user_ws: MockHAClientWebSocket,
) -> None:
    with patch(
        "custom_components.cookbook.websocket_api.async_scrape",
        return_value=(SCRAPED, "https://marmiton.org/photo.jpg"),
    ):
        result = await _ok(user_ws, "scrape", url="https://marmiton.org/x")
    assert result == {
        "recipe": SCRAPED,
        "image_url": "https://marmiton.org/photo.jpg",
        "duplicate": None,
    }
    assert (await _ok(user_ws, "list"))["recipes"] == []


async def test_scrape_reports_an_existing_recipe(
    user_ws: MockHAClientWebSocket,
) -> None:
    existing = await _ok(
        user_ws,
        "create",
        name="Ma crème brûlée",
        source_url="http://marmiton.org/recettes/creme-brulee.aspx/",
    )
    with patch(
        "custom_components.cookbook.websocket_api.async_scrape",
        return_value=(SCRAPED, None),
    ):
        result = await _ok(user_ws, "scrape", url="https://marmiton.org/autre")
    assert result["duplicate"]["id"] == existing["id"]
    assert result["duplicate"]["name"] == "Ma crème brûlée"


async def test_create_refuses_a_duplicate_source_url(
    user_ws: MockHAClientWebSocket,
) -> None:
    existing = await _ok(
        user_ws, "create", name="Crème brûlée", source_url="https://marmiton.org/r"
    )
    response = await _call(
        user_ws, "create", name="Copie", source_url="https://www.marmiton.org/r/"
    )
    assert not response["success"]
    assert response["error"]["code"] == "duplicate_source"
    assert response["error"]["translation_placeholders"] == {
        "recipe_id": existing["id"],
        "name": "Crème brûlée",
    }


async def test_scrape_errors(user_ws: MockHAClientWebSocket) -> None:
    with patch(
        "custom_components.cookbook.websocket_api.async_scrape",
        side_effect=ScrapeError("not_a_recipe", "No recipe found on this page"),
    ):
        assert await _error(user_ws, "scrape", url="https://x.fr") == "not_a_recipe"
    # Real validation, no network involved.
    assert await _error(user_ws, "scrape", url="ftp://x.fr") == "invalid_url"
    assert await _error(user_ws, "scrape", url="") == "invalid_format"
