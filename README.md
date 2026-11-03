# Cookbook for Home Assistant

*[Version française](README.fr.md)*

A recipe manager that lives in a Home Assistant sidebar panel. No extra account: it uses Home Assistant users.

> 🚧 Early development. Not ready for use yet.

## Installation (HACS custom repository)

1. HACS → ⋮ → *Custom repositories* → add `https://github.com/npanau/ha-cookbook` (type *Integration*).
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
