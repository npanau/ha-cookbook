"""Setup / unload / remove tests."""

import pytest
from homeassistant.components.frontend import DATA_PANELS
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.cookbook.const import DOMAIN, PANEL_URL_PATH
from custom_components.cookbook.store import STORAGE_KEY


async def test_setup_registers_panel_and_unload_removes_it(hass: HomeAssistant) -> None:
    entry = MockConfigEntry(domain=DOMAIN)
    entry.add_to_hass(hass)

    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.LOADED

    panel = hass.data[DATA_PANELS][PANEL_URL_PATH]
    assert panel.sidebar_title == "Cookbook"
    assert panel.sidebar_icon == "mdi:chef-hat"
    assert panel.require_admin is False
    custom = panel.config["_panel_custom"]
    assert custom["name"] == "cookbook-panel"
    assert custom["module_url"].startswith("/cookbook_static/cookbook-panel.js?v=")

    assert await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.NOT_LOADED
    assert PANEL_URL_PATH not in hass.data[DATA_PANELS]


@pytest.mark.parametrize(("delete_option", "kept"), [(False, True), (True, False)])
async def test_remove_entry_keeps_recipes_unless_asked(
    hass: HomeAssistant, hass_storage, delete_option: bool, kept: bool
) -> None:
    entry = MockConfigEntry(
        domain=DOMAIN, options={"delete_recipes_on_remove": delete_option}
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await entry.runtime_data.async_create({"name": "Gratin"}, None)
    assert STORAGE_KEY in hass_storage

    await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()
    assert (STORAGE_KEY in hass_storage) is kept
