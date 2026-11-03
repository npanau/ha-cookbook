"""Recipe photos: processing (Pillow), files in /config/cookbook/images/, HTTP views.

Photos are re-encoded as WebP in two sizes, rotated according to their EXIF
orientation and stripped of every metadata (a phone photo can carry the GPS position
of the kitchen). Only served to authenticated users; <img> tags get signed URLs.
"""

from __future__ import annotations

import re
import shutil
import uuid
from datetime import timedelta
from http import HTTPStatus
from io import BytesIO
from pathlib import Path
from typing import TYPE_CHECKING, Any

from aiohttp import web
from homeassistant.components.http import KEY_HASS, HomeAssistantView
from homeassistant.components.http.auth import async_sign_path
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

from .const import DOMAIN

if TYPE_CHECKING:
    from .store import CookbookStore

IMAGES_DIR = "cookbook/images"
# Longest side, in pixels.
SIZES = {"large": 1600, "thumb": 480}
WEBP_QUALITY = 82
MAX_UPLOAD_BYTES = 15 * 1024 * 1024
# Refuse absurd dimensions before decoding (decompression bombs): 60 megapixels.
MAX_PIXELS = 60_000_000
ACCEPTED_FORMATS = {"JPEG", "PNG", "WEBP"}
IMAGE_CONTENT_TYPES = ("image/jpeg", "image/png", "image/webp")
SIGNED_URL_VALIDITY = timedelta(hours=24)
IMAGE_ID = re.compile(r"^[0-9a-f]{32}$")

IMAGE_URL = "/api/cookbook/images/{image_id}/{size}.webp"
UPLOAD_URL = "/api/cookbook/recipes/{recipe_id}/image"


class ImageError(HomeAssistantError):
    """Invalid photo; `code` is sent to the frontend."""

    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code


def process_image(data: bytes) -> dict[str, bytes]:
    """Validate a photo and return its WebP versions by size (blocking: executor)."""
    from PIL import Image, ImageOps, UnidentifiedImageError  # noqa: PLC0415

    if len(data) > MAX_UPLOAD_BYTES:
        raise ImageError("too_large", "The photo is too large")
    try:
        image = Image.open(BytesIO(data))
        if image.format not in ACCEPTED_FORMATS:
            raise ImageError("invalid_image", "Accepted formats: JPEG, PNG, WebP")
        if image.width * image.height > MAX_PIXELS:
            raise ImageError("too_large", "The photo has too many pixels")
        image = ImageOps.exif_transpose(image)
        image.load()
    except ImageError:
        raise
    except (UnidentifiedImageError, OSError, Image.DecompressionBombError) as err:
        raise ImageError("invalid_image", "This file is not a valid photo") from err

    # No metadata at all in the output: only the pixels (and transparency) are kept.
    has_alpha = image.mode in ("RGBA", "LA") or "transparency" in image.info
    image = image.convert("RGBA" if has_alpha else "RGB")
    result = {}
    for name, side in SIZES.items():
        copy = image.copy()
        copy.thumbnail((side, side), Image.Resampling.LANCZOS)
        buffer = BytesIO()
        copy.save(buffer, "WEBP", quality=WEBP_QUALITY, method=4, exif=b"")
        result[name] = buffer.getvalue()
    return result


class ImageFiles:
    """Photo files on disk: <config>/cookbook/images/<image_id>-<size>.webp."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self.directory = Path(hass.config.path(IMAGES_DIR))

    def path(self, image_id: str, size: str) -> Path:
        if not IMAGE_ID.match(image_id) or size not in SIZES:
            raise ValueError("invalid image reference")
        return self.directory / f"{image_id}-{size}.webp"

    async def async_save(self, data: bytes) -> str:
        """Process and store a photo; returns its new id."""
        versions = await self._hass.async_add_executor_job(process_image, data)
        image_id = uuid.uuid4().hex

        def write() -> None:
            self.directory.mkdir(parents=True, exist_ok=True)
            for size, content in versions.items():
                self.path(image_id, size).write_bytes(content)

        await self._hass.async_add_executor_job(write)
        return image_id

    async def async_delete(self, image_id: str | None) -> None:
        if not image_id or not IMAGE_ID.match(image_id):
            return

        def delete() -> None:
            for size in SIZES:
                self.path(image_id, size).unlink(missing_ok=True)

        await self._hass.async_add_executor_job(delete)

    async def async_remove_all(self) -> None:
        await self._hass.async_add_executor_job(
            lambda: shutil.rmtree(self.directory, ignore_errors=True)
        )


def image_urls(hass: HomeAssistant, image_id: str | None) -> dict[str, str | None]:
    """Signed URLs of a photo, for <img> tags (bound to the current user session)."""
    if not image_id:
        return {"image_url": None, "thumbnail_url": None}
    return {
        f"{key}_url": async_sign_path(
            hass,
            IMAGE_URL.format(image_id=image_id, size=size),
            SIGNED_URL_VALIDITY,
        )
        for key, size in (("image", "large"), ("thumbnail", "thumb"))
    }


def _store(hass: HomeAssistant) -> CookbookStore | None:
    entries = hass.config_entries.async_loaded_entries(DOMAIN)
    return entries[0].runtime_data if entries else None


class CookbookImageView(HomeAssistantView):
    """Serve a photo; authenticated (header or signed URL)."""

    url = IMAGE_URL
    name = "api:cookbook:image"
    requires_auth = True

    async def get(
        self, request: web.Request, image_id: str, size: str
    ) -> web.StreamResponse:
        store = _store(request.app[KEY_HASS])
        if store is None:
            return web.Response(status=HTTPStatus.NOT_FOUND)
        try:
            path = store.images.path(image_id, size)
        except ValueError:
            return web.Response(status=HTTPStatus.NOT_FOUND)
        if not await request.app[KEY_HASS].async_add_executor_job(path.is_file):
            return web.Response(status=HTTPStatus.NOT_FOUND)
        # A photo never changes: a new photo gets a new id.
        return web.FileResponse(
            path,
            headers={
                "Content-Type": "image/webp",
                "Cache-Control": "private, max-age=86400, immutable",
            },
        )


class CookbookImageUploadView(HomeAssistantView):
    """Set (POST, multipart "file") or remove (DELETE) the photo of a recipe."""

    url = UPLOAD_URL
    name = "api:cookbook:recipe-image"
    requires_auth = True

    async def post(self, request: web.Request, recipe_id: str) -> web.Response:
        hass = request.app[KEY_HASS]
        store = _store(hass)
        if store is None:
            return self.json_message("Cookbook is not set up", HTTPStatus.NOT_FOUND)
        request._client_max_size = MAX_UPLOAD_BYTES + 64 * 1024  # noqa: SLF001
        try:
            form = await request.post()
        except web.HTTPRequestEntityTooLarge:
            return self.json_message(
                "The photo is too large",
                HTTPStatus.REQUEST_ENTITY_TOO_LARGE,
                "too_large",
            )
        upload = form.get("file")
        if not isinstance(upload, web.FileField):
            return self.json_message("No file", HTTPStatus.BAD_REQUEST, "invalid_image")
        data = await hass.async_add_executor_job(upload.file.read)
        return await self._set(request, store, recipe_id, data)

    async def delete(self, request: web.Request, recipe_id: str) -> web.Response:
        store = _store(request.app[KEY_HASS])
        if store is None:
            return self.json_message("Cookbook is not set up", HTTPStatus.NOT_FOUND)
        return await self._set(request, store, recipe_id, None)

    async def _set(
        self,
        request: web.Request,
        store: CookbookStore,
        recipe_id: str,
        data: bytes | None,
    ) -> web.Response:
        from .store import RecipeNotFoundError  # noqa: PLC0415

        hass = request.app[KEY_HASS]
        user = request["hass_user"]
        try:
            recipe = await store.async_set_image(recipe_id, data, user.id)
        except RecipeNotFoundError:
            return self.json_message(
                "Recipe not found", HTTPStatus.NOT_FOUND, "not_found"
            )
        except ImageError as err:
            return self.json_message(str(err), HTTPStatus.BAD_REQUEST, err.code)
        return self.json({**recipe, **image_urls(hass, recipe["image"])})


def register_views(hass: HomeAssistant) -> None:
    hass.http.register_view(CookbookImageView())
    hass.http.register_view(CookbookImageUploadView())


def recipe_with_urls(hass: HomeAssistant, recipe: dict[str, Any]) -> dict[str, Any]:
    return {**recipe, **image_urls(hass, recipe.get("image"))}
