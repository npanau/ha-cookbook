"""Recipe import from a URL: safe download, parsing, mapping to our model.

recipe-scrapers does the site-specific parsing (Marmiton and hundreds of others) and
falls back on schema.org/Recipe (JSON-LD) for unknown sites; this module only fetches
the page and maps the result to editable recipe fields. Nothing is saved (preview).
"""

from __future__ import annotations

import html
import ipaddress
import logging
import os
import re
import socket
from typing import Any
from urllib.parse import urljoin, urlsplit

import aiohttp
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .models import FIELD_VALIDATORS, MAX_ITEMS, MAX_NAME, MAX_SERVINGS, MAX_TEXT

_LOGGER = logging.getLogger(__name__)

TIMEOUT = aiohttp.ClientTimeout(total=15)
MAX_BYTES = 5 * 1024 * 1024
MAX_REDIRECTS = 5
HTML_TYPES = ("text/html", "application/xhtml+xml")
# Many recipe sites (behind Cloudflare & co) reject clients that do not look like
# a browser.
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/130.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
}
# Only for the E2E Docker (fixtures served from a private address): never elsewhere.
ALLOW_PRIVATE_ENV = "COOKBOOK_ALLOW_PRIVATE_URLS"

# Marketing suffixes of recipe titles: "Crème brûlée : la meilleure recette".
_TITLE_SUFFIX = re.compile(
    r"\s*[:|–—-]\s*(?:"
    r"(?:la|ma|notre)?\s*(?:meilleure|vraie|délicieuse|super)?\s*recette"
    r"(?:\s+(?:et\s+)?(?:facile|simple|rapide|traditionnelle|inratable|express|"
    r"de\s+(?:grand-mère|chef|cuisine)|maison))*"
    r"|marmiton|750g|cuisine\s*az|cuisineaz"
    r")\s*!?$",
    re.IGNORECASE,
)


class ScrapeError(HomeAssistantError):
    """Import failure; `code` is sent to the frontend."""

    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code


def _allow_private() -> bool:
    return os.environ.get(ALLOW_PRIVATE_ENV) == "1"


def validate_url(url: str) -> str:
    parts = urlsplit(url.strip())
    if parts.scheme not in ("http", "https") or not parts.hostname:
        raise ScrapeError("invalid_url", "The URL must start with http:// or https://")
    return parts.geturl()


async def _ensure_public_host(hass: HomeAssistant, url: str) -> None:
    """Refuse local/private addresses: HA must not be used to probe the home network.

    Checked on every redirect hop. (A DNS answer changing between this check and the
    connection is not covered; acceptable for a household integration.)
    """
    if _allow_private():
        return
    parts = urlsplit(url)
    host = parts.hostname or ""
    port = parts.port or (443 if parts.scheme == "https" else 80)
    try:
        infos = await hass.loop.getaddrinfo(host, port, type=socket.SOCK_STREAM)
    except OSError as err:
        raise ScrapeError("fetch_failed", f"Unknown host {host}") from err
    for info in infos:
        address = ipaddress.ip_address(info[4][0])
        if not address.is_global:
            raise ScrapeError("blocked_url", "Local network addresses are not allowed")


async def fetch_page(hass: HomeAssistant, url: str) -> tuple[str, str]:
    """Download an HTML page (redirects followed by hand, each hop checked)."""
    final_url, body, charset = await _download(
        hass,
        url,
        HTML_TYPES,
        MAX_BYTES,
        "not_a_recipe",
        "This address is not a web page",
    )
    return final_url, body.decode(charset or "utf-8", errors="replace")


async def fetch_image(hass: HomeAssistant, url: str) -> bytes:
    """Download a photo of an imported recipe, with the same protections as pages."""
    from .images import IMAGE_CONTENT_TYPES, MAX_UPLOAD_BYTES  # noqa: PLC0415

    _, body, _ = await _download(
        hass,
        url,
        IMAGE_CONTENT_TYPES,
        MAX_UPLOAD_BYTES,
        "invalid_image",
        "This address is not a photo",
    )
    return bytes(body)


async def _download(
    hass: HomeAssistant,
    url: str,
    content_types: tuple[str, ...],
    max_bytes: int,
    wrong_type_code: str,
    wrong_type_message: str,
) -> tuple[str, bytearray, str | None]:
    """GET with manual redirects (each hop checked), type and size limits."""
    session = async_get_clientsession(hass)
    current = validate_url(url)
    for _ in range(MAX_REDIRECTS + 1):
        await _ensure_public_host(hass, current)
        try:
            async with session.get(
                current, headers=HEADERS, allow_redirects=False, timeout=TIMEOUT
            ) as response:
                if response.status in (301, 302, 303, 307, 308):
                    location = response.headers.get("Location")
                    if not location:
                        raise ScrapeError("fetch_failed", "Redirect without location")
                    current = validate_url(urljoin(current, location))
                    continue
                if response.status >= 400:
                    raise ScrapeError(
                        "fetch_failed", f"The site answered HTTP {response.status}"
                    )
                if response.content_type not in content_types:
                    raise ScrapeError(wrong_type_code, wrong_type_message)
                body = bytearray()
                async for chunk in response.content.iter_chunked(64 * 1024):
                    body += chunk
                    if len(body) > max_bytes:
                        raise ScrapeError("too_large", "The file is too large")
                return current, body, response.charset
        except TimeoutError as err:
            raise ScrapeError(
                "fetch_failed", "The site did not answer in time"
            ) from err
        except aiohttp.ClientError as err:
            raise ScrapeError(
                "fetch_failed", f"Could not reach the site: {err}"
            ) from err
    raise ScrapeError("fetch_failed", "Too many redirects")


def clean_title(title: str) -> str:
    """Remove marketing suffixes ("… : la meilleure recette", "… - Marmiton")."""
    previous = None
    while previous != title:
        previous = title
        title = _TITLE_SUFFIX.sub("", title).strip()
    return title


def _text(value: Any) -> str:
    """Unescape HTML entities and collapse whitespace (keeping paragraph breaks)."""
    text = html.unescape(str(value or ""))
    lines = [re.sub(r"[ \t ]+", " ", line).strip() for line in text.splitlines()]
    return "\n".join(line for line in lines if line).strip()


def parse_servings(yields: str) -> tuple[int | None, str | None]:
    """recipe-scrapers yields: "8 servings", "12 items", "1 serving" -> (8, None)...

    "servings" maps to the default unit (chosen by the frontend), "items" to "pièces".
    """
    match = re.match(r"\s*(\d+)\s*(.*)$", yields or "")
    if not match or not 1 <= int(match[1]) <= MAX_SERVINGS:
        return None, None
    unit = match[2].strip().lower()
    if unit in ("", "serving", "servings"):
        return int(match[1]), None
    if unit in ("item", "items"):
        return int(match[1]), "pièces"
    return int(match[1]), unit[:200]


def _safe(scraper: Any, field: str, default: Any = None) -> Any:
    """recipe-scrapers raises when a site lacks a field: treat it as missing."""
    try:
        value = getattr(scraper, field)()
    except Exception:  # noqa: BLE001 - any parsing error just means "no value"
        return default
    return default if value in (None, "", []) else value


def _minutes(value: Any) -> int | None:
    return value if isinstance(value, int) and 0 <= value <= 100_000 else None


def map_scraper(scraper: Any, url: str) -> dict[str, Any]:
    """recipe-scrapers result -> editable fields, valid against FIELD_VALIDATORS."""
    name = clean_title(_text(_safe(scraper, "title", "")))
    if not name:
        raise ScrapeError("not_a_recipe", "No recipe found on this page")

    ingredients: list[dict[str, Any]] = []
    for group in _safe(scraper, "ingredient_groups", []):
        section = _text(getattr(group, "purpose", None)) or None
        for text in getattr(group, "ingredients", []):
            if text := _text(text):
                ingredients.append({"text": text, "section": section})
    if not ingredients:
        ingredients = [
            {"text": text, "section": None}
            for raw in _safe(scraper, "ingredients", [])
            if (text := _text(raw))
        ]
    steps = [
        {"text": text, "section": None}
        for raw in _safe(scraper, "instructions_list", [])
        if (text := _text(raw))
    ]
    if not ingredients and not steps:
        raise ScrapeError("not_a_recipe", "No recipe found on this page")

    categories: list[str] = []
    for raw in str(_safe(scraper, "category", "")).split(","):
        if (category := _text(raw)) and len(category) <= 200:
            categories.append(category)

    servings, servings_unit = parse_servings(str(_safe(scraper, "yields", "")))
    fields = {
        # Texts are cut to the schema limits rather than failing the whole import.
        "name": name[:MAX_NAME].rstrip(),
        "description": _text(_safe(scraper, "description", ""))[:MAX_TEXT] or None,
        "categories": categories[:10],
        "prep_time": _minutes(_safe(scraper, "prep_time")),
        "cook_time": _minutes(_safe(scraper, "cook_time")),
        "total_time": _minutes(_safe(scraper, "total_time")),
        "servings": servings,
        "servings_unit": servings_unit,
        "ingredients": ingredients[:MAX_ITEMS],
        "steps": steps[:MAX_ITEMS],
        "notes": None,
        "source_url": _safe(scraper, "canonical_url") or url,
    }
    # The source URL must stay a valid http(s) URL for the schema.
    if not str(fields["source_url"]).startswith(("http://", "https://")):
        fields["source_url"] = url
    # Normalize through the real schema (strip, dedupe categories, drop empty lines...).
    return {key: FIELD_VALIDATORS[key](value) for key, value in fields.items()}


def _image_url(scraper: Any, page_url: str) -> str | None:
    """Absolute http(s) URL of the recipe photo, if the page has one."""
    image = _safe(scraper, "image")
    if not isinstance(image, str) or not image.strip():
        return None
    url = urljoin(page_url, image.strip())
    return url if url.startswith(("http://", "https://")) else None


def _parse(page: str, url: str) -> tuple[dict[str, Any], str | None]:
    # Imported here, in the executor: recipe-scrapers pulls lxml & co (slow import).
    from recipe_scrapers import scrape_html  # noqa: PLC0415

    try:
        scraper = scrape_html(page, org_url=url, supported_only=False)
    except Exception as err:  # noqa: BLE001 - any failure means "not a recipe page"
        _LOGGER.debug("recipe-scrapers could not parse %s: %s", url, err)
        raise ScrapeError("not_a_recipe", "No recipe found on this page") from err
    return map_scraper(scraper, url), _image_url(scraper, url)


async def async_scrape(
    hass: HomeAssistant, url: str
) -> tuple[dict[str, Any], str | None]:
    """Fetch and parse a recipe page: (editable fields, photo URL); nothing saved."""
    final_url, page = await fetch_page(hass, url)
    return await hass.async_add_executor_job(_parse, page, final_url)
