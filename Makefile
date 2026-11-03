# Dev shortcuts — the local Docker HA only, never production.
.PHONY: up up-ha down logs restart-ha watch build typecheck test test-py test-front e2e e2e-headed lint format

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

test: test-py test-front ## All tests

test-py:
	uv run pytest

test-front:
	cd frontend && npm test

# E2E: fresh throwaway HA on port 8124 (never the dev one), production bundle, Playwright.
# Filters: make e2e GREP="CB03" PROJECT=mobile
E2E_ARGS = $(if $(GREP),--grep "$(GREP)") $(if $(PROJECT),--project=$(PROJECT))

e2e: ## E2E tests (desktop + mobile)
	cd frontend && npm run build
	docker compose --profile e2e up -d --force-recreate homeassistant-e2e
	cd frontend && npx playwright test $(E2E_ARGS) $(E2E_EXTRA); status=$$?; \
		cd .. && docker compose --profile e2e stop homeassistant-e2e; exit $$status

e2e-headed: ## E2E tests with a visible browser
	$(MAKE) e2e E2E_EXTRA="--headed"

lint:
	uv run ruff check .
	uv run ruff format --check .

format:
	uv run ruff check --fix .
	uv run ruff format .
