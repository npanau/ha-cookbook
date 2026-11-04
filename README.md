<img src="custom_components/cookbook/brand/icon@2x.png" alt="" width="96" align="right">

# Cookbook for Home Assistant

*[Version française](README.fr.md)*

A recipe manager that lives in a Home Assistant sidebar panel. No extra account: it uses Home Assistant users.

> First release (0.1): feedback and bug reports are welcome in the issues.

## Installation (HACS custom repository)

[![Open your Home Assistant instance and open this repository in HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=npanau&repository=ha-cookbook&category=integration)

1. Click the button above (it adds the repository to HACS), or HACS → ⋮ → *Custom repositories* → add
   `https://github.com/npanau/ha-cookbook` (type *Integration*).
2. Install **Cookbook**, then restart Home Assistant.
3. *Settings → Devices & services → Add integration → Cookbook*.

## Importing a recipe from a URL

*Import* (next to *New recipe*) reads a recipe page and opens it in the editor, so you can check
and fix it before saving. Nothing is saved until you do.

- Parsing is done by [recipe-scrapers](https://github.com/hhursev/recipe-scrapers), which knows
  [hundreds of sites](https://docs.recipe-scrapers.com/getting-started/supported-sites/) (Marmiton
  included). Other sites work when their pages describe the recipe with schema.org data, which most
  recipe sites and blogs do; the result may then be less complete.
- **First start after installing or updating**: Home Assistant downloads recipe-scrapers and its
  dependencies (about fifteen packages, including `lxml`). This can take a minute.
- **The page is downloaded by your Home Assistant**, not by your browser: the site sees your Home
  Assistant's address. Addresses of the local network (`192.168.x.x`, `localhost`…) are refused, so
  that the integration cannot be used to probe your network.
- Sites change their pages from time to time, which can break their import until recipe-scrapers is
  updated: keep the integration up to date.

## Photos

One photo per recipe, taken or chosen from the editor (or imported with the recipe). Photos are resized
and stored in your Home Assistant (`/config/cookbook/images/`, included in backups), with **all metadata
removed** — a phone photo can carry the GPS position of where it was taken. They are only shown to
logged-in Home Assistant users.

## Keeping the screen on while cooking

On a recipe, *Keep screen on* stops the phone or tablet from going to sleep. Browsers only allow this
over **HTTPS**: the button is hidden when Home Assistant is opened with an `http://` address. This
includes the Home Assistant app, which switches to the *internal URL* on your home Wi-Fi: if that URL
is `http://…`, the button does not show up there.

## Development

Requirements: Docker, Node 24+, [uv](https://docs.astral.sh/uv/).

```sh
make up          # HA dev instance (http://localhost:8123) + frontend watch in Docker
# or: make up-ha && make watch   (frontend watch on the host)
make seed        # replace the dev recipes with demo ones (dev/fixtures/recipes.json)
make restart-ha  # after a Python change
make test lint   # pytest + Vitest, ruff
make e2e         # Playwright end-to-end tests on a throwaway HA (port 8124)
make build       # production bundle, to commit
```

## License

[MIT](LICENSE)
