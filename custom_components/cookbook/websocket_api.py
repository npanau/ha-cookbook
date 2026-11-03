"""WebSocket commands `cookbook/*` (HA authentication; delete is admin-only)."""

from __future__ import annotations

from collections.abc import Awaitable, Callable
from functools import wraps
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN
from .models import FIELD_VALIDATORS
from .store import CookbookStore, RecipeConflictError, RecipeNotFoundError

ERR_CONFLICT = "conflict"
ERR_NOT_LOADED = "not_loaded"

type _Handler = Callable[
    [HomeAssistant, websocket_api.ActiveConnection, dict[str, Any], CookbookStore],
    Awaitable[None],
]

RECIPE_ID = vol.All(str, vol.Length(min=1, max=64))
CATEGORY = vol.All(str, vol.Strip, vol.Length(min=1, max=200))


@callback
def async_register_commands(hass: HomeAssistant) -> None:
    for command in (
        ws_list,
        ws_get,
        ws_create,
        ws_update,
        ws_delete,
        ws_search,
        ws_categories,
    ):
        websocket_api.async_register_command(hass, command)


def _with_store(func: _Handler) -> websocket_api.AsyncWebSocketCommandHandler:
    """Inject the store of the loaded entry and map store errors to WS errors."""

    @wraps(func)
    async def wrapper(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        entries = hass.config_entries.async_loaded_entries(DOMAIN)
        if not entries:
            connection.send_error(msg["id"], ERR_NOT_LOADED, "Cookbook is not set up")
            return
        try:
            await func(hass, connection, msg, entries[0].runtime_data)
        except RecipeNotFoundError:
            connection.send_error(
                msg["id"], websocket_api.ERR_NOT_FOUND, "Recipe not found"
            )
        except RecipeConflictError:
            connection.send_error(
                msg["id"], ERR_CONFLICT, "The recipe was modified in the meantime"
            )

    return wrapper


def _editable_fields(msg: dict[str, Any]) -> dict[str, Any]:
    return {key: msg[key] for key in FIELD_VALIDATORS if key in msg}


async def _user_name(hass: HomeAssistant, user_id: str | None) -> str | None:
    if user_id is None:
        return None
    user = await hass.auth.async_get_user(user_id)
    return user.name if user else None


async def _with_names(hass: HomeAssistant, recipe: dict[str, Any]) -> dict[str, Any]:
    return {
        **recipe,
        "created_by_name": await _user_name(hass, recipe["created_by"]),
        "updated_by_name": await _user_name(hass, recipe["updated_by"]),
    }


@websocket_api.websocket_command(
    {vol.Required("type"): "cookbook/list", vol.Optional("category"): CATEGORY}
)
@websocket_api.async_response
@_with_store
async def ws_list(hass, connection, msg, store: CookbookStore) -> None:
    connection.send_result(msg["id"], {"recipes": store.list(msg.get("category"))})


@websocket_api.websocket_command(
    {vol.Required("type"): "cookbook/get", vol.Required("recipe_id"): RECIPE_ID}
)
@websocket_api.async_response
@_with_store
async def ws_get(hass, connection, msg, store: CookbookStore) -> None:
    recipe = store.get(msg["recipe_id"])
    connection.send_result(msg["id"], await _with_names(hass, recipe))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "cookbook/create",
        vol.Required("name"): FIELD_VALIDATORS["name"],
        **{vol.Optional(k): v for k, v in FIELD_VALIDATORS.items() if k != "name"},
    }
)
@websocket_api.async_response
@_with_store
async def ws_create(hass, connection, msg, store: CookbookStore) -> None:
    recipe = await store.async_create(_editable_fields(msg), connection.user.id)
    connection.send_result(msg["id"], await _with_names(hass, recipe))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "cookbook/update",
        vol.Required("recipe_id"): RECIPE_ID,
        vol.Optional("expected_updated_at"): str,
        **{vol.Optional(k): v for k, v in FIELD_VALIDATORS.items()},
    }
)
@websocket_api.async_response
@_with_store
async def ws_update(hass, connection, msg, store: CookbookStore) -> None:
    recipe = await store.async_update(
        msg["recipe_id"],
        _editable_fields(msg),
        connection.user.id,
        msg.get("expected_updated_at"),
    )
    connection.send_result(msg["id"], await _with_names(hass, recipe))


@websocket_api.websocket_command(
    {vol.Required("type"): "cookbook/delete", vol.Required("recipe_id"): RECIPE_ID}
)
@websocket_api.require_admin
@websocket_api.async_response
@_with_store
async def ws_delete(hass, connection, msg, store: CookbookStore) -> None:
    await store.async_delete(msg["recipe_id"])
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): "cookbook/search",
        vol.Required("query"): vol.All(str, vol.Length(max=500)),
        vol.Optional("category"): CATEGORY,
    }
)
@websocket_api.async_response
@_with_store
async def ws_search(hass, connection, msg, store: CookbookStore) -> None:
    recipes = store.search(msg["query"], msg.get("category"))
    connection.send_result(msg["id"], {"recipes": recipes})


@websocket_api.websocket_command({vol.Required("type"): "cookbook/categories"})
@websocket_api.async_response
@_with_store
async def ws_categories(hass, connection, msg, store: CookbookStore) -> None:
    connection.send_result(msg["id"], {"categories": store.categories()})
