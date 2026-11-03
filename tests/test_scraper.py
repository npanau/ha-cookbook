"""Recipe import: page download, recipe-scrapers result mapping, WebSocket command.

recipe-scrapers' own parsing of each site (Marmiton...) is tested by that project:
here we test what we do with its result, using synthetic pages and fake scrapers.
"""

from __future__ import annotations

import asyncio
import socket
from pathlib import Path
from types import SimpleNamespace
from typing import Any
from unittest.mock import patch

import pytest
from aiohttp import web
from homeassistant.core import HomeAssistant

from custom_components.cookbook import scraper
from custom_components.cookbook.scraper import (
    ScrapeError,
    clean_title,
    map_scraper,
    parse_servings,
)
from custom_components.cookbook.store import normalize_url

FIXTURES = Path(__file__).parent / "fixtures" / "scraper"


class FakeScraper:
    """Mimics a recipe-scrapers scraper: missing fields raise, like the library."""

    def __init__(self, **values: Any) -> None:
        self._values = values

    def __getattr__(self, field: str):
        def getter():
            if field not in self._values:
                raise NotImplementedError(field)
            return self._values[field]

        return getter


MARMITON_LIKE = {
    "title": "Crème brûlée : la meilleure recette",
    "description": "Un dessert élégant.",
    "category": "Dessert",
    "prep_time": 20,
    "cook_time": 50,
    "total_time": 70,
    "yields": "8 servings",
    "ingredient_groups": [
        SimpleNamespace(purpose=None, ingredients=["6 jaunes d'oeuf", "200 g de sucre"])
    ],
    "instructions_list": ["Faire bouillir le lait.", "Cuire 50 minutes."],
    "canonical_url": "https://www.marmiton.org/recettes/recette_creme-brulee_11491.aspx",
}


@pytest.mark.parametrize(
    ("title", "expected"),
    [
        ("Crème brûlée : la meilleure recette", "Crème brûlée"),
        ("Quiche lorraine : la recette facile", "Quiche lorraine"),
        ("Gratin dauphinois - la vraie recette traditionnelle", "Gratin dauphinois"),
        ("Pâte à crêpes : recette facile et rapide", "Pâte à crêpes"),
        ("Tarte tatin : la recette de grand-mère - Marmiton", "Tarte tatin"),
        ("Fondant au chocolat | 750g", "Fondant au chocolat"),
        ("Soupe : potimarron et châtaignes", "Soupe : potimarron et châtaignes"),
        ("Recette de pâtes", "Recette de pâtes"),
    ],
)
def test_clean_title(title: str, expected: str) -> None:
    assert clean_title(title) == expected


@pytest.mark.parametrize(
    ("yields", "expected"),
    [
        ("8 servings", (8, None)),
        ("1 serving", (1, None)),
        ("6", (6, None)),
        ("12 items", (12, "pièces")),
        ("4 ramequins", (4, "ramequins")),
        ("0 servings", (None, None)),
        ("", (None, None)),
        ("quelques parts", (None, None)),
    ],
)
def test_parse_servings(yields: str, expected: tuple) -> None:
    assert parse_servings(yields) == expected


def test_map_marmiton_like_result() -> None:
    fields = map_scraper(FakeScraper(**MARMITON_LIKE), "https://www.marmiton.org/x")
    assert fields == {
        "name": "Crème brûlée",
        "description": "Un dessert élégant.",
        "categories": ["Dessert"],
        "prep_time": 20,
        "cook_time": 50,
        "total_time": 70,
        "servings": 8,
        "servings_unit": None,
        "ingredients": [
            {"text": "6 jaunes d'oeuf", "section": None},
            {"text": "200 g de sucre", "section": None},
        ],
        "steps": [
            {"text": "Faire bouillir le lait.", "section": None},
            {"text": "Cuire 50 minutes.", "section": None},
        ],
        "notes": None,
        "source_url": MARMITON_LIKE["canonical_url"],
    }


def test_map_keeps_ingredient_sections() -> None:
    groups = [
        SimpleNamespace(purpose="Pâte", ingredients=["250 g de farine"]),
        SimpleNamespace(purpose="Garniture", ingredients=["4 pommes", "  "]),
    ]
    fields = map_scraper(
        FakeScraper(title="Tarte", ingredient_groups=groups), "https://x.fr"
    )
    assert fields["ingredients"] == [
        {"text": "250 g de farine", "section": "Pâte"},
        {"text": "4 pommes", "section": "Garniture"},
    ]


def test_map_tolerates_missing_and_odd_fields() -> None:
    fields = map_scraper(
        FakeScraper(
            title="  Soupe &amp; croûtons  ",
            ingredients=["1 l de bouillon", ""],
            prep_time="10",  # not an int: ignored
            cook_time=-5,
            canonical_url="/relative",
            category="Plat,, Hiver ,plat",
            description="x" * 30_000,
        ),
        "https://site.fr/soupe",
    )
    assert fields["name"] == "Soupe & croûtons"
    assert fields["ingredients"] == [{"text": "1 l de bouillon", "section": None}]
    assert fields["steps"] == []
    assert fields["prep_time"] is None
    assert fields["cook_time"] is None
    assert fields["source_url"] == "https://site.fr/soupe"
    assert fields["categories"] == ["Plat", "Hiver"]
    assert len(fields["description"]) == 20_000
    assert fields["servings"] is None


@pytest.mark.parametrize(
    "values",
    [
        {"ingredients": ["1 œuf"]},  # no title
        {"title": "Accueil"},  # neither ingredients nor steps
    ],
)
def test_map_refuses_pages_without_recipe(values: dict) -> None:
    with pytest.raises(ScrapeError) as err:
        map_scraper(FakeScraper(**values), "https://x.fr")
    assert err.value.code == "not_a_recipe"


def test_parse_synthetic_json_ld_page() -> None:
    """End to end through the real recipe-scrapers, schema.org fallback."""
    page = (FIXTURES / "jsonld-recipe.html").read_text(encoding="utf-8")
    fields = scraper._parse(page, "https://blog.example.org/tarte-aux-poires?utm=x")
    assert fields["name"] == "Tarte aux poires & amandes"
    # recipe-scrapers itself joins the lines of the description.
    assert fields["description"] == "Une tarte fondante. Parfaite en automne."
    assert fields["categories"] == ["Dessert", "Fruits"]
    assert (fields["prep_time"], fields["cook_time"], fields["total_time"]) == (
        25,
        40,
        65,
    )
    assert fields["servings"] == 6
    assert [i["text"] for i in fields["ingredients"]] == [
        "1 pâte brisée",
        "4 poires",
        "100 g de poudre d'amandes",
        "2 œufs",
    ]
    assert len(fields["steps"]) == 3
    assert fields["source_url"] == "https://blog.example.org/tarte-aux-poires"


def test_parse_page_without_recipe() -> None:
    page = (FIXTURES / "no-recipe.html").read_text(encoding="utf-8")
    with pytest.raises(ScrapeError) as err:
        scraper._parse(page, "https://example.org/")
    assert err.value.code == "not_a_recipe"


@pytest.mark.parametrize(
    ("url", "code"),
    [
        ("ftp://x.fr/r", "invalid_url"),
        ("pas une url", "invalid_url"),
        ("https://", "invalid_url"),
    ],
)
def test_validate_url(url: str, code: str) -> None:
    with pytest.raises(ScrapeError) as err:
        scraper.validate_url(url)
    assert err.value.code == code


def _getaddrinfo(address: str):
    async def fake(host, port, **kwargs):
        family = socket.AF_INET6 if ":" in address else socket.AF_INET
        return [(family, socket.SOCK_STREAM, 6, "", (address, port))]

    return fake


@pytest.mark.parametrize(
    "address",
    [
        "127.0.0.1",
        "192.168.1.10",
        "10.0.0.2",
        "172.16.5.4",
        "169.254.1.1",
        "::1",
        "fd00::1",
        "100.64.0.1",
    ],
)
async def test_private_addresses_are_blocked(hass: HomeAssistant, address: str) -> None:
    with (
        patch.object(hass.loop, "getaddrinfo", _getaddrinfo(address)),
        pytest.raises(ScrapeError) as err,
    ):
        await scraper._ensure_public_host(hass, "https://recettes.example/r")
    assert err.value.code == "blocked_url"


async def test_public_addresses_are_allowed(hass: HomeAssistant) -> None:
    with patch.object(hass.loop, "getaddrinfo", _getaddrinfo("93.184.216.34")):
        await scraper._ensure_public_host(hass, "https://recettes.example/r")


async def test_private_addresses_allowed_only_with_the_e2e_flag(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setenv(scraper.ALLOW_PRIVATE_ENV, "1")
    with patch.object(hass.loop, "getaddrinfo", _getaddrinfo("192.168.1.10")):
        await scraper._ensure_public_host(hass, "http://nas.local/r")


# --- Download, against a real local HTTP server ---------------------------------------


@pytest.fixture
async def site(aiohttp_server, socket_enabled, monkeypatch):
    """Local site; the private-address check is replaced by a recorder."""
    checked: list[str] = []

    async def record(hass, url):
        checked.append(url)
        if "192.168." in url:
            raise ScrapeError("blocked_url", "blocked")

    monkeypatch.setattr(scraper, "_ensure_public_host", record)

    async def recipe(request):
        page = (FIXTURES / "jsonld-recipe.html").read_bytes()
        return web.Response(body=page, content_type="text/html", charset="utf-8")

    async def latin1(request):
        return web.Response(
            body="<p>Crème</p>".encode("latin-1"),
            content_type="text/html",
            charset="latin-1",
        )

    async def redirect(request):
        raise web.HTTPFound("/recipe")

    async def to_private(request):
        raise web.HTTPFound("http://192.168.1.10/admin")

    async def no_location(request):
        return web.Response(status=302)

    async def loop_(request):
        raise web.HTTPFound("/loop")

    async def missing(request):
        return web.Response(status=404)

    async def json_(request):
        return web.json_response({"a": 1})

    async def huge(request):
        return web.Response(body=b"x" * 2048, content_type="text/html")

    async def slow(request):
        await asyncio.sleep(2)
        return web.Response(text="late", content_type="text/html")

    app = web.Application()
    for path, handler in {
        "/recipe": recipe,
        "/latin1": latin1,
        "/redirect": redirect,
        "/to-private": to_private,
        "/loop": loop_,
        "/no-location": no_location,
        "/missing": missing,
        "/json": json_,
        "/huge": huge,
        "/slow": slow,
    }.items():
        app.router.add_get(path, handler)
    server = await aiohttp_server(app)
    return SimpleNamespace(url=lambda path: str(server.make_url(path)), checked=checked)


async def test_fetch_follows_redirects_checking_each_hop(
    hass: HomeAssistant, site
) -> None:
    final_url, page = await scraper.fetch_page(hass, site.url("/redirect"))
    assert final_url == site.url("/recipe")
    assert "Tarte aux poires" in page
    assert site.checked == [site.url("/redirect"), site.url("/recipe")]


async def test_fetch_decodes_the_declared_charset(hass: HomeAssistant, site) -> None:
    _, page = await scraper.fetch_page(hass, site.url("/latin1"))
    assert page == "<p>Crème</p>"


@pytest.mark.parametrize(
    ("path", "code"),
    [
        ("/to-private", "blocked_url"),
        ("/loop", "fetch_failed"),
        ("/no-location", "fetch_failed"),
        ("/missing", "fetch_failed"),
        ("/json", "not_a_recipe"),
    ],
)
async def test_fetch_errors(hass: HomeAssistant, site, path: str, code: str) -> None:
    with pytest.raises(ScrapeError) as err:
        await scraper.fetch_page(hass, site.url(path))
    assert err.value.code == code


async def test_fetch_unreachable_site(hass: HomeAssistant, site) -> None:
    with pytest.raises(ScrapeError) as err:
        await scraper.fetch_page(hass, "http://127.0.0.1:1/closed-port")
    assert err.value.code == "fetch_failed"


async def test_unknown_host(hass: HomeAssistant) -> None:
    async def fail(*args, **kwargs):
        raise socket.gaierror("Name or service not known")

    with (
        patch.object(hass.loop, "getaddrinfo", fail),
        pytest.raises(ScrapeError) as err,
    ):
        await scraper._ensure_public_host(hass, "https://nexiste-pas.example/r")
    assert err.value.code == "fetch_failed"


async def test_fetch_refuses_huge_pages(hass: HomeAssistant, site, monkeypatch) -> None:
    monkeypatch.setattr(scraper, "MAX_BYTES", 1024)
    with pytest.raises(ScrapeError) as err:
        await scraper.fetch_page(hass, site.url("/huge"))
    assert err.value.code == "too_large"


async def test_fetch_times_out(hass: HomeAssistant, site, monkeypatch) -> None:
    import aiohttp

    monkeypatch.setattr(scraper, "TIMEOUT", aiohttp.ClientTimeout(total=0.2))
    with pytest.raises(ScrapeError) as err:
        await scraper.fetch_page(hass, site.url("/slow"))
    assert err.value.code == "fetch_failed"


async def test_scrape_end_to_end(hass: HomeAssistant, site) -> None:
    fields = await scraper.async_scrape(hass, site.url("/recipe"))
    assert fields["name"] == "Tarte aux poires & amandes"
    assert fields["servings"] == 6


def test_normalize_url() -> None:
    assert (
        normalize_url("https://www.marmiton.org/r/x.aspx/#top")
        == "marmiton.org/r/x.aspx"
    )
    assert normalize_url("http://marmiton.org/r/x.aspx") == "marmiton.org/r/x.aspx"
    assert normalize_url("https://s.fr/r?id=2") == "s.fr/r?id=2"
