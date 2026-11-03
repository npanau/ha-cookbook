import { fileURLToPath } from "node:url";
import type { Locator } from "@playwright/test";
import { expect, test } from "./fixtures";

const PHOTO = fileURLToPath(new URL("./sites/tarte.jpg", import.meta.url));

/** The image is really displayed (downloaded through its signed URL and decoded). */
async function expectLoaded(image: Locator) {
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
}

test("CB09 : ajouter, afficher, remplacer et retirer la photo d'une recette", async ({ cookbook, uid }) => {
  await cookbook.goto();
  const recipe = await cookbook.createRecipe({ name: `Tarte ${uid}` });
  await cookbook.goto(`/edit/${recipe.id}`);
  const editor = cookbook.editor();
  const photo = editor.locator("cookbook-photo-input");

  await photo.locator("input[type=file]").setInputFiles(PHOTO);
  await expectLoaded(photo.locator("img.preview"));
  await editor.getByRole("button", { name: "Enregistrer" }).click();

  // Sheet: large photo; list: thumbnail. Both served by HA through signed URLs.
  const sheet = cookbook.sheet();
  await expect(sheet.getByRole("heading", { level: 1 })).toHaveText(`Tarte ${uid}`);
  await expectLoaded(sheet.getByRole("img", { name: `Tarte ${uid}` }));
  const src = await sheet.locator("img.hero").getAttribute("src");
  expect(src).toMatch(/\/api\/cookbook\/images\/\w+\/large\.webp\?authSig=/);

  await cookbook.goto();
  await cookbook.search(uid);
  await expectLoaded(cookbook.cards().first().locator("img"));

  // Without the signature, the photo is not served.
  const unsigned = await cookbook.page.request.get(src!.split("?")[0]);
  expect(unsigned.status()).toBe(401);

  // Remove it.
  await cookbook.goto(`/edit/${recipe.id}`);
  await photo.getByRole("button", { name: "Retirer" }).click();
  await editor.getByRole("button", { name: "Enregistrer" }).click();
  await expect(sheet.getByRole("heading", { level: 1 })).toHaveText(`Tarte ${uid}`);
  await expect(sheet.locator("img.hero")).toHaveCount(0);
});

test("CB09 : un fichier qui n'est pas une photo est refusé", async ({ cookbook }) => {
  await cookbook.goto("/new");
  const photo = cookbook.editor().locator("cookbook-photo-input");
  await photo.locator("input[type=file]").setInputFiles({
    name: "notes.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("pas une photo"),
  });
  await expect(photo.getByRole("alert")).toHaveText("Formats acceptés : JPEG, PNG, WebP.");
  await expect(photo.locator("img.preview")).toHaveCount(0);
});
