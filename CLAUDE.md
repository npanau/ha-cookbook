# Cookbook — intégration Home Assistant

Gestionnaire de recettes sous forme d'**intégration personnalisée HA** (domaine `cookbook`), diffusée via HACS,
avec un panneau dans la barre latérale. Plan complet et étapes : `docs/PLAN.md` (copie locale **non versionnée** :
l'original est rangé dans Claude Desktop, projet « Perso » ; le fichier peut être absent sur un autre poste).

## ⚠️ Règle absolue : jamais de dev sur la prod

**Aucun développement, test ni essai sur la prod (Home Assistant du Pi 5).** Tout se fait sur le HA de dev Docker
local (http://localhost:8123). Le déploiement sur la prod est une étape explicite du plan (étape 7), que
Nicolas déclenche lui-même : ne jamais s'y connecter, y copier des fichiers ou l'appeler par API de sa propre initiative.

## Architecture

- **Backend** (`custom_components/cookbook/`, Python 3.14) :
  - `config_flow.py` : instance unique (`single_config_entry`) ; option « supprimer aussi les recettes » (décochée
    par défaut) lue par `async_remove_entry`. **Par défaut, supprimer l'intégration conserve les recettes.**
  - `__init__.py` : panneau via `panel_custom.async_register_panel`, bundle servi en statique sur `/cookbook_static/` ;
    le `CookbookStore` est dans `entry.runtime_data` ; les commandes WS sont enregistrées une fois dans `async_setup`.
  - `models.py` : validation voluptuous des champs éditables (`FIELD_VALIDATORS`) et `fold()` (minuscules, sans
    accents ni ligatures œ/æ) pour comparer catégories et recherche. `id`, dates, auteurs et `image` sont gérés par
    le serveur, jamais acceptés du client.
  - `store.py` : `helpers.storage.Store` (`.storage/cookbook`, version 1.1, `{"recipes": {id: recipe}}`), en mémoire,
    écrit à chaque modification. Le store renvoie toujours des copies.
  - **Migrations** : tant qu'aucune version n'est déployée (ni prod, ni release HACS), on modifie le schéma 1.1 en
    place et on régénère les données de dev (`make seed`). **À partir de la première version déployée**, toute
    évolution du schéma incrémente la version et ajoute sa migration dans `_CookbookStorage._async_migrate_func`,
    avec un test.
  - `websocket_api.py` : `cookbook/list|get|create|update|delete|search|categories`. `update` est **partiel** et
    accepte `expected_updated_at` (erreur `conflict` si la recette a changé). Erreurs : `not_found`, `unauthorized`,
    `conflict`, `not_loaded`, `invalid_format`.
  - `scraper.py` + `cookbook/scrape {url}` : import par URL, renvoie un **aperçu non enregistré** (`recipe`) et un
    éventuel doublon (`duplicate`, même URL source normalisée). `recipe-scrapers` (version identique dans le manifest
    et `pyproject.toml`) fait l'analyse, avec son repli schema.org/JSON-LD pour les sites inconnus ; on ne teste
    **que notre partie** (récupération, conversion, nettoyage du titre) avec des extracteurs simulés et des pages
    factices — **jamais de contenu de sites tiers dans le dépôt**. Import de la bibliothèque dans l'executor (lent).
  - Récupération : session HTTP de HA, 15 s, 5 Mo, HTML seulement, redirections suivies à la main. **Adresses
    locales/privées refusées à chaque saut** (`blocked_url`), sauf si `COOKBOOK_ALLOW_PRIVATE_URLS=1`, défini
    **uniquement** pour le HA des tests E2E. Erreurs : `invalid_url`, `blocked_url`, `fetch_failed`, `not_a_recipe`,
    `too_large`.
  - À venir : images dans `/config/cookbook/images/` servies par une `HomeAssistantView` avec chemins signés.
- **Frontend** (`frontend/`) : web component **Lit 3 + TypeScript**, bundle ES unique via **Vite**
  → `custom_components/cookbook/frontend/cookbook-panel.js`.
  - `cookbook-panel.ts` (racine : barre d'outils, routage), `router.ts` (sous-routes `/cookbook`,
    `/cookbook/recipe/<id>`, `/new`, `/edit/<id>`, `/import[?url=…]` ; navigation via `history.pushState` + événement `location-changed`, comme HA),
    `api.ts` (client typé des commandes WS), `views/` (écrans), `components/`, `print.ts` (impression via iframe).
  - **Composants maison uniquement**, stylés avec les variables CSS du thème HA (`styles.ts`). Ne pas utiliser les
    composants internes de HA (`ha-textfield`, `ha-dialog`…) : instables et pas toujours chargés. Exceptions :
    `ha-menu-button`, `ha-icon`.
  - Préférences par appareil (coches du mode cuisine, texte agrandi) en `localStorage`, toujours dans un try/catch.
- **Droits** : tout utilisateur peut lire / créer / modifier / importer ; **suppression réservée aux admins**
  (décorateur `@websocket_api.require_admin`). Chaque recette garde `created_by` / `updated_by` (id utilisateur HA) ;
  `get` / `create` / `update` ajoutent `created_by_name` / `updated_by_name`, résolus à la lecture.
- **Nombre de personnes et quantités** : `servings` (entier, facultatif) + `servings_unit` (texte libre,
  « personnes » par défaut côté éditeur). Les ingrédients restent du **texte libre** ; l'adaptation se fait à
  l'affichage (`frontend/src/quantity.ts`) : seule la quantité **en chiffres ou fractions en début de ligne** est
  adaptée (« une pincée », « Sel » et le reste de la ligne ne changent pas) ; décimales pour g/kg/ml/cl/l, fractions
  ½ ¼ ¾ ⅓ ⅔ pour le reste. Les étapes et notes ne sont jamais adaptées. Nombre choisi dans l'URL (`?parts=6`), repris
  par l'impression.
- **i18n** : FR + EN. Backend : `strings.json` + `translations/{en,fr}.json` (garder les trois synchronisés).
  Frontend : `frontend/src/i18n/{en,fr}.json`, langue de l'utilisateur via `hass.locale.language`.
  Le titre du panneau reste « Cookbook » dans toutes les langues.

## Structure

```
custom_components/cookbook/   # l'intégration (montée dans le HA de dev)
  frontend/                   # bundle GÉNÉRÉ, commité pour HACS : ne jamais l'éditer à la main
frontend/                     # sources Lit/TS + Vite
tests/                        # pytest-homeassistant-custom-component
dev/config/                   # config du HA de dev (seul configuration.yaml est versionné)
dev/fixtures/, dev/seed.py    # recettes de démonstration et `make seed`
.github/workflows/            # hassfest, validation HACS, tests (Python, frontend + bundle à jour, E2E)
```

## Commandes

| Commande | Effet |
|---|---|
| `make up` | HA de dev + watch du frontend, dans Docker |
| `make up-ha` puis `make watch` | HA dans Docker, watch du frontend sur le Mac (plus rapide) |
| `make restart-ha` | Obligatoire après toute modification Python |
| `make logs` / `make down` | Logs / arrêt |
| `make test` | Tous les tests (`make test-py` : pytest, `make test-front` : Vitest + happy-dom) |
| `make lint` / `make format` | ruff |
| `make typecheck` | `tsc --noEmit` sur le frontend |
| `make e2e` | Tests E2E Playwright (desktop + mobile) sur un HA jetable ; filtres `GREP="CB03"`, `PROJECT=mobile` |
| `make e2e-headed` | Idem, navigateur visible |
| `make seed` | Remplace les recettes du HA de **dev** par `dev/fixtures/recipes.json` (validées par le schéma, et par `tests/test_fixtures.py`) |
| `make build` | Bundle de production : **à lancer avant chaque commit touchant `frontend/`** (la CI vérifie que le bundle commité est à jour ; le watch produit un bundle de dev non minifié) |

Modification TypeScript : le watch reconstruit, il suffit de recharger la page (le statique est servi sans cache).

## Tests E2E (Playwright)

- **Instance dédiée** : service `homeassistant-e2e` (profil compose `e2e`, port **8124**, `/config` en tmpfs) : neuve à
  chaque démarrage, le HA de dev (8123) n'est jamais touché. `make e2e` la recrée, construit le bundle, lance les
  tests puis l'arrête.
- **Initialisation** (`frontend/e2e/ha-setup.ts`, `globalSetup`) entièrement par API, sans passer par l'écran de
  connexion de HA : onboarding (admin `e2e-admin`, langue fr), ajout de l'intégration par le config flow, compte non
  admin `e2e-membre` (WebSocket `config/auth/create`), puis jetons injectés dans `localStorage.hassTokens`
  (`frontend/e2e/.auth/`, non versionné). Refuse de tourner sur une instance déjà initialisée.
- **Import** : le conteneur `recipes-site` (profil `e2e`) sert les pages factices de `frontend/e2e/sites/` sur
  `http://recipes-site:8000/` ; ajouter `?t=<uid>` aux URL pour qu'elles restent uniques par test.
- **Scénarios** `frontend/e2e/cbNN-*.spec.ts`, titres `CBNN : …` ; projets `desktop` et `mobile` (Pixel 7), connectés
  en admin ; fixture `member` pour le compte non admin. Les tests tournent en parallèle sur la même instance :
  **toujours des noms uniques** (fixture `uid`) et des assertions limitées à ses propres données.
- Sélecteurs par rôle / libellé (`getByRole`, traversent le shadow DOM) ou `name` des champs du formulaire.
  **Pas de comparaison de captures d'écran** (rendu des polices différent Mac / Linux).
- Échec en CI : rapport et traces en artefact `playwright-report`, logs HA dans le job.

## Versions et dépendances

- **Groupes à faire évoluer ensemble**, vérifiés par `tests/test_versions.py` (la CI échoue sinon) :
  - `recipe-scrapers` : `manifest.json` (installé par HA chez l'utilisateur), `pyproject.toml` et `uv.lock` ;
  - Home Assistant : image Docker (`HA_VERSION` dans `docker-compose.yml`) = version de HA imposée par
    `pytest-homeassistant-custom-component`, et `home-assistant-frontend` = version requise par ce HA.
- **Renovate** (`renovate.json`, application GitHub ; tableau de bord : ticket « Dependency Dashboard ») ouvre les PR
  le lundi matin, après 3 jours de recul sur chaque version :
  - `recipe-scrapers` : détecté dans le manifest par le gestionnaire natif `homeassistant-manifest` de Renovate,
    mis à jour avec `pyproject.toml` / `uv.lock` dans la même PR ;
  - Home Assistant : **seule `pytest-homeassistant-custom-component` est mise à jour** (elle fixe la version de HA).
    Sur sa PR, lancer `make sync-ha` (aligne l'image Docker et `home-assistant-frontend`, puis `uv lock`) et pousser :
    `test_versions` échoue tant que ce n'est pas fait. `home-assistant-frontend` et la version de Python
    (`.python-version`, imposée par HA) ne sont jamais mis à jour seuls ;
  - dépendances npm mineures groupées ; actions GitHub groupées ; Node via `.nvmrc` et l'image `node`.
  - Valider la config : `docker run --rm -v "$PWD/renovate.json:/repo/renovate.json:ro" -w /repo node:24-alpine npx
    --yes --package renovate@latest -- renovate-config-validator --strict renovate.json` (Renovate exige Node 24).
- **PR Renovate npm** : Renovate ne reconstruit pas le bundle ; si la sortie change, le job « bundle à jour »
  échoue → récupérer la branche, `make build`, commiter le bundle sur la branche.
- **Accès GitHub** : `gh` est authentifié sur le poste (tickets, PR, runs CI : `gh run list`, `gh run view --log-failed`).
- La version de l'intégration (`manifest.json`) sert aussi au cache-busting du bundle (`?v=`).

## Conventions

- Code, commentaires, commits, `README.md` : **anglais**. `CLAUDE.md`, `README.fr.md`, échanges : français.
- Clés de `manifest.json` : `domain`, `name`, puis ordre alphabétique (exigé par hassfest).
- Toute nouvelle fonctionnalité s'accompagne de tests : pytest pour le backend, Vitest (`frontend/test/`) pour le
  frontend, et un scénario E2E quand elle touche un parcours utilisateur.
