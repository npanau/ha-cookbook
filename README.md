# Cookbook for Home Assistant

*[Version française](README.fr.md)*

A recipe manager that lives in a Home Assistant sidebar panel. No extra account: it uses Home Assistant users.

> 🚧 Early development. Not ready for use yet.

## Installation (HACS custom repository)

1. HACS → ⋮ → *Custom repositories* → add `https://github.com/npanau/ha-cookbook` (type *Integration*).
2. Install **Cookbook**, then restart Home Assistant.
3. *Settings → Devices & services → Add integration → Cookbook*.

## Development

Requirements: Docker, Node 24+, [uv](https://docs.astral.sh/uv/).

```sh
make up          # HA dev instance (http://localhost:8123) + frontend watch in Docker
# or: make up-ha && make watch   (frontend watch on the host)
make restart-ha  # after a Python change
make test lint   # pytest + ruff
make build       # production bundle, to commit
```

## License

[MIT](LICENSE)
