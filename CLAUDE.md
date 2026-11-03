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
    écrit à chaque modification. **Toute évolution du schéma** : incrémenter la version et ajouter la migration dans
    `_CookbookStorage._async_migrate_func`, avec un test. Le store renvoie toujours des copies.
  - `websocket_api.py` : `cookbook/list|get|create|update|delete|search|categories`. `update` est **partiel** et
    accepte `expected_updated_at` (erreur `conflict` si la recette a changé). Erreurs : `not_found`, `unauthorized`,
    `conflict`, `not_loaded`, `invalid_format`.
  - À venir : `cookbook/scrape` (`recipe-scrapers` + JSON-LD), images dans `/config/cookbook/images/` servies par une
    `HomeAssistantView` avec chemins signés.
- **Frontend** (`frontend/`) : web component **Lit 3 + TypeScript**, bundle ES unique via **Vite**
  → `custom_components/cookbook/frontend/cookbook-panel.js`. Utiliser les variables CSS du thème HA.
- **Droits** : tout utilisateur peut lire / créer / modifier / importer ; **suppression réservée aux admins**
  (décorateur `@websocket_api.require_admin`). Chaque recette garde `created_by` / `updated_by` (id utilisateur HA) ;
  `get` / `create` / `update` ajoutent `created_by_name` / `updated_by_name`, résolus à la lecture.
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
.github/workflows/            # hassfest, validation HACS, tests (Python + bundle à jour)
```

## Commandes

| Commande | Effet |
|---|---|
| `make up` | HA de dev + watch du frontend, dans Docker |
| `make up-ha` puis `make watch` | HA dans Docker, watch du frontend sur le Mac (plus rapide) |
| `make restart-ha` | Obligatoire après toute modification Python |
| `make logs` / `make down` | Logs / arrêt |
| `make test` | `uv run pytest` |
| `make lint` / `make format` | ruff |
| `make typecheck` | `tsc --noEmit` sur le frontend |
| `make build` | Bundle de production : **à lancer avant chaque commit touchant `frontend/`** (la CI vérifie que le bundle commité est à jour ; le watch produit un bundle de dev non minifié) |

Modification TypeScript : le watch reconstruit, il suffit de recharger la page (le statique est servi sans cache).

## Versions

La version HA du Docker (`HA_VERSION` dans `docker-compose.yml`) doit correspondre à celle imposée par
`pytest-homeassistant-custom-component` dans `pyproject.toml`, ainsi que `home-assistant-frontend`
(version lue dans le `manifest.json` du composant `frontend` de HA). Les mettre à jour ensemble.
La version de l'intégration (`manifest.json`) sert aussi au cache-busting du bundle (`?v=`).

## Conventions

- Code, commentaires, commits, `README.md` : **anglais**. `CLAUDE.md`, `README.fr.md`, échanges : français.
- Clés de `manifest.json` : `domain`, `name`, puis ordre alphabétique (exigé par hassfest).
- Toute nouvelle fonctionnalité backend s'accompagne de tests pytest.
