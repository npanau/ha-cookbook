"""Constants for the Cookbook integration."""

from typing import Final

DOMAIN: Final = "cookbook"

PANEL_URL_PATH: Final = "cookbook"
PANEL_TITLE: Final = "Cookbook"
PANEL_ICON: Final = "mdi:chef-hat"
PANEL_WEBCOMPONENT: Final = "cookbook-panel"

STATIC_URL: Final = "/cookbook_static"
FRONTEND_DIR: Final = "frontend"
FRONTEND_FILE: Final = "cookbook-panel.js"

# Option: also delete the recipes when the integration is removed.
CONF_DELETE_RECIPES_ON_REMOVE: Final = "delete_recipes_on_remove"
