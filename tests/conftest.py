"""Shared fixtures."""

import pytest


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    """Allow loading custom_components/ in every test."""
    return


@pytest.fixture(autouse=True)
def isolated_config_dir(hass, tmp_path):
    """Each test gets its own config dir: photos never leak between tests."""
    hass.config.config_dir = str(tmp_path)
