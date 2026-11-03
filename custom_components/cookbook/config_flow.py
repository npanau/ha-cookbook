"""Config flow for the Cookbook integration."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.core import callback

from .const import CONF_DELETE_RECIPES_ON_REMOVE, DOMAIN, PANEL_TITLE


class CookbookConfigFlow(ConfigFlow, domain=DOMAIN):
    """Single-instance config flow without any parameter."""

    VERSION = 1

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        return CookbookOptionsFlow()

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Confirm and create the (unique) entry."""
        if user_input is not None:
            return self.async_create_entry(title=PANEL_TITLE, data={})
        return self.async_show_form(step_id="user")


class CookbookOptionsFlow(OptionsFlow):
    """Options: whether removing the integration also deletes the recipes."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(data=user_input)
        current = self.config_entry.options.get(CONF_DELETE_RECIPES_ON_REMOVE, False)
        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {vol.Required(CONF_DELETE_RECIPES_ON_REMOVE, default=current): bool}
            ),
        )
