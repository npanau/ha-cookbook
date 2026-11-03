"""The Cookbook integration: recipe manager panel for Home Assistant."""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType
from homeassistant.loader import async_get_integration

from .const import (
    CONF_DELETE_RECIPES_ON_REMOVE,
    DOMAIN,
    FRONTEND_DIR,
    FRONTEND_FILE,
    PANEL_ICON,
    PANEL_TITLE,
    PANEL_URL_PATH,
    PANEL_WEBCOMPONENT,
    STATIC_URL,
)
from .store import CookbookStore
from .websocket_api import async_register_commands

_LOGGER = logging.getLogger(__name__)

DATA_STATIC_REGISTERED = f"{DOMAIN}_static_registered"

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

type CookbookConfigEntry = ConfigEntry[CookbookStore]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register the WebSocket commands (once, they cannot be unregistered)."""
    async_register_commands(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: CookbookConfigEntry) -> bool:
    """Set up Cookbook from a config entry."""
    store = CookbookStore(hass)
    await store.async_load()
    entry.runtime_data = store

    # Static paths cannot be unregistered: register them once per HA run.
    if not hass.data.get(DATA_STATIC_REGISTERED):
        await hass.http.async_register_static_paths(
            [
                StaticPathConfig(
                    STATIC_URL,
                    str(Path(__file__).parent / FRONTEND_DIR),
                    cache_headers=False,
                )
            ]
        )
        hass.data[DATA_STATIC_REGISTERED] = True

    integration = await async_get_integration(hass, DOMAIN)
    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=PANEL_URL_PATH,
        webcomponent_name=PANEL_WEBCOMPONENT,
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        module_url=f"{STATIC_URL}/{FRONTEND_FILE}?v={integration.version}",
        require_admin=False,
        config={},
    )
    _LOGGER.debug("Cookbook panel registered at /%s", PANEL_URL_PATH)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: CookbookConfigEntry) -> bool:
    """Unload a config entry."""
    frontend.async_remove_panel(hass, PANEL_URL_PATH)
    return True


async def async_remove_entry(hass: HomeAssistant, entry: CookbookConfigEntry) -> None:
    """Keep the recipes on removal, unless the user enabled the option."""
    if entry.options.get(CONF_DELETE_RECIPES_ON_REMOVE, False):
        _LOGGER.info("Deleting all recipes, as requested in the integration options")
        await CookbookStore(hass).async_remove_all()
