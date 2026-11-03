import { expect, test } from "./fixtures";

test("CB03 : modifier une recette", async ({ cookbook, uid }) => {
  await cookbook.goto();
  const recipe = await cookbook.createRecipe({ name: `Gratin ${uid}`, servings: 4, servings_unit: "personnes" });
  await cookbook.goto(`/recipe/${recipe.id}`);
  await cookbook.sheet().getByRole("button", { name: "Modifier" }).click();

  const editor = cookbook.editor();
  await expect(editor.locator('input[name="name"]')).toHaveValue(`Gratin ${uid}`);
  await editor.locator('input[name="name"]').fill(`Gratin dauphinois ${uid}`);
  await editor.locator('textarea[name="notes"]').fill("Frotter le plat à l'ail.");
  await editor.getByRole("button", { name: "Enregistrer" }).click();

  const sheet = cookbook.sheet();
  await expect(sheet.getByRole("heading", { level: 1 })).toHaveText(`Gratin dauphinois ${uid}`);
  await expect(sheet.locator(".notes")).toContainText("Frotter le plat à l'ail.");
  await expect(sheet.locator(".meta")).toContainText("4 personnes");
});

test("CB03 : conflit entre deux onglets", async ({ cookbook, uid, context }) => {
  await cookbook.goto();
  const recipe = await cookbook.createRecipe({ name: `Soupe ${uid}` });
  const other = await context.newPage();
  const { Cookbook } = await import("./fixtures");
  const second = new Cookbook(other);

  // Both tabs open the editor; the second one saves first.
  await cookbook.goto(`/edit/${recipe.id}`);
  await second.goto(`/edit/${recipe.id}`);
  await second.editor().locator('textarea[name="notes"]').fill("Version de l'onglet 2");
  await second.editor().getByRole("button", { name: "Enregistrer" }).click();
  await expect(second.sheet().locator(".notes")).toContainText("Version de l'onglet 2");

  const editor = cookbook.editor();
  await editor.locator('textarea[name="notes"]').fill("Version de l'onglet 1");
  await editor.getByRole("button", { name: "Enregistrer" }).click();
  await expect(editor.getByRole("alert")).toContainText("Admin E2E a modifié cette recette entre-temps.");

  // Load the saved version: my changes are replaced by the other tab's ones.
  await editor.getByRole("button", { name: "Charger la version enregistrée" }).click();
  await expect(editor.locator('textarea[name="notes"]')).toHaveValue("Version de l'onglet 2");

  // Conflict again, this time overwrite.
  await second.goto(`/edit/${recipe.id}`);
  await second.editor().locator('textarea[name="notes"]').fill("Version 3 de l'onglet 2");
  await second.editor().getByRole("button", { name: "Enregistrer" }).click();
  await expect(second.sheet().locator(".notes")).toContainText("Version 3");

  await editor.locator('textarea[name="notes"]').fill("Ma version finale");
  await editor.getByRole("button", { name: "Enregistrer" }).click();
  await editor.getByRole("button", { name: "Écraser avec mes modifications" }).click();
  await expect(cookbook.sheet().locator(".notes")).toContainText("Ma version finale");
});
