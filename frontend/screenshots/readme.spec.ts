/**
 * README screenshots (`make screenshots`): seeds the demo recipes of dev/fixtures into the
 * throwaway E2E Home Assistant (port 8124, never the dev or prod instance), then captures the
 * main screens in English and French into docs/screenshots/.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { type Browser, type Page, expect, test } from "@playwright/test";
import { HA_URL, storageStatePath } from "../e2e/ha-setup";

const ROOT = resolve(import.meta.dirname, "../..");
const OUT = resolve(ROOT, "docs/screenshots");
const FIXTURES = resolve(ROOT, "dev/fixtures");
const LANGUAGES = ["en", "fr"] as const;

interface Fixture {
  name: string;
  photo?: string;
  [field: string]: unknown;
}

let recipeIds: Record<string, string> = {};

/** A logged-in admin page in one language and color scheme. */
async function openPage(
  browser: Browser,
  language: string,
  options: { mobile?: boolean; dark?: boolean } = {},
): Promise<Page> {
  const context = await browser.newContext({
    baseURL: HA_URL,
    storageState: storageStatePath("admin"),
    locale: language === "fr" ? "fr-FR" : "en-US",
    timezoneId: "Europe/Paris",
    colorScheme: options.dark ? "dark" : "light",
    ...(options.mobile
      ? { viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
      : { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 }),
  });
  await context.addInitScript((lang) => localStorage.setItem("selectedLanguage", JSON.stringify(lang)), language);
  return context.newPage();
}

function panel(page: Page) {
  return page.locator("cookbook-panel");
}

async function goto(page: Page, path: string) {
  await page.goto(`/cookbook${path}`);
  await expect(panel(page).locator(".toolbar")).toBeVisible();
}

/** Waits until every visible photo is downloaded and decoded. */
async function photosLoaded(page: Page) {
  await expect
    .poll(() =>
      panel(page)
        .locator("img")
        .evaluateAll((images) => images.every((img) => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0)),
    )
    .toBe(true);
}

async function shot(page: Page, name: string) {
  await photosLoaded(page);
  await page.waitForTimeout(300); // let transitions settle
  // JPEG keeps the repository light (photos compress badly in PNG).
  await page.screenshot({ path: `${OUT}/${name}.jpg`, type: "jpeg", quality: 85 });
}

test.beforeAll(async ({ browser }) => {
  const fixtures = JSON.parse(readFileSync(`${FIXTURES}/recipes.json`, "utf8")) as Fixture[];
  const page = await openPage(browser, "fr");
  await goto(page, "");
  // Clean sidebar: a neutral user name (also shown as "Last edited by"), and the country set so
  // that HA does not raise its "country not configured" repair (badge on Settings).
  await page.evaluate(async () => {
    const app = document.querySelector("home-assistant") as unknown as {
      hass: { callWS(m: unknown): Promise<unknown>; user: { id: string } };
    };
    await app.hass.callWS({ type: "config/auth/update", user_id: app.hass.user.id, name: "Camille" });
    await app.hass.callWS({ type: "config/core/update", country: "FR" });
  });
  // Oldest first, so the list shows them in the fixture order of `make seed`.
  for (const { photo, ...fields } of fixtures) {
    const photoData = photo ? readFileSync(`${FIXTURES}/photos/${photo}`).toString("base64") : null;
    const id = await page.evaluate(
      async ({ fields, photoData }) => {
        const app = document.querySelector("home-assistant") as unknown as {
          hass: { callWS(m: unknown): Promise<{ id: string }>; auth: { data: { access_token: string } } };
        };
        const recipe = await app.hass.callWS({ type: "cookbook/create", ...fields });
        if (photoData) {
          const bytes = Uint8Array.from(atob(photoData), (c) => c.charCodeAt(0));
          const form = new FormData();
          form.append("file", new Blob([bytes], { type: "image/jpeg" }), "photo.jpg");
          const response = await fetch(`/api/cookbook/recipes/${recipe.id}/image`, {
            method: "POST",
            headers: { Authorization: `Bearer ${app.hass.auth.data.access_token}` },
            body: form,
          });
          if (!response.ok) throw new Error(`Photo upload failed: ${response.status}`);
        }
        return recipe.id;
      },
      { fields, photoData },
    );
    recipeIds[fields.name] = id;
  }
  await page.context().close();
});

for (const language of LANGUAGES) {
  test(`screenshots (${language})`, async ({ browser }) => {
    const desktop = await openPage(browser, language);

    await goto(desktop, "");
    await expect(panel(desktop).getByText("Crème brûlée")).toBeVisible();
    await shot(desktop, `${language}-list`);

    // Taller window: photo, ingredients and steps together.
    await desktop.setViewportSize({ width: 1280, height: 1350 });
    await goto(desktop, `/recipe/${recipeIds["Crème brûlée"]}`);
    await shot(desktop, `${language}-recipe`);
    await desktop.setViewportSize({ width: 1280, height: 800 });

    await goto(desktop, `/edit/${recipeIds["Quiche lorraine"]}`);
    await expect(desktop.locator("cookbook-recipe-editor input[name='name']")).toHaveValue("Quiche lorraine");
    // Scrolled past the photo (already on the other screenshots): fields, then ingredients.
    await desktop.locator("cookbook-recipe-editor section.card:not(.photo)").first().evaluate((el) => el.scrollIntoView());
    await shot(desktop, `${language}-editor`);
    await desktop.context().close();

    const mobile = await openPage(browser, language, { mobile: true, dark: true });
    await goto(mobile, `/recipe/${recipeIds["Quiche lorraine"]}?parts=6`);
    await shot(mobile, `${language}-mobile`);
    await mobile.context().close();
  });
}
