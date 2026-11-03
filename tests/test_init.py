"""Setup / unload tests."""

from homeassistant.components.frontend import DATA_PANELS
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.cookbook.const import DOMAIN, PANEL_URL_PATH


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
