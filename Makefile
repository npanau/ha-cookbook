# Dev shortcuts — the local Docker HA only, never production.
.PHONY: up up-ha down logs restart-ha watch build typecheck test lint format

up: ## HA + frontend watch, both in Docker
	docker compose --profile frontend up -d

up-ha: ## HA only (run `make watch` locally for the frontend)
	docker compose up -d homeassistant

down:
	docker compose --profile frontend down

logs:
	docker compose --profile frontend logs -f

restart-ha: ## Needed after any Python change
	docker compose restart homeassistant

watch: ## Frontend watch on the host
	cd frontend && npm run watch

build: ## Production bundle (commit it)
	cd frontend && npm ci && npm run build

typecheck:
	cd frontend && npm run typecheck

test:
	uv run pytest

lint:
	uv run ruff check .
	uv run ruff format --check .

format:
	uv run ruff check --fix .
	uv run ruff format .
