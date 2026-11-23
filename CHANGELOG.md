# Changelog

Changes waiting for the next release are listed under **Unreleased**; they become the GitHub release notes
when a version is published. Earlier versions: see the [GitHub releases](https://github.com/npanau/ha-cookbook/releases).

## Unreleased

### Fixed

- After the connection to Home Assistant was lost (phone asleep, network change), the panel showed
  "Something went wrong: [object Object]". It now waits for the connection to come back and reloads the
  current page silently; an error is only shown if that reload fails.
- Pages left open for a long time (wall tablet) reload their data before the signed photo links expire.
- Error messages are readable and translated for every kind of error (lost connection, HTTP error of the
  photo upload…); the full error is logged in the browser console.

### Maintenance

- recipe-scrapers 15.14.0 (#10)
- Node.js 26 for the frontend tooling (`.nvmrc`, Docker `frontend` service) (#7)
- Frontend dev dependencies: Playwright 1.65, Vite patch update (#5)
- Python 3.15 image for the synthetic recipe site used by the E2E tests (#6)
- Frontend dev dependencies: Playwright 1.65.1, Vite 8.3.8 (#8)
- Frontend dev dependency: Vitest 5.1.1 (#9)
