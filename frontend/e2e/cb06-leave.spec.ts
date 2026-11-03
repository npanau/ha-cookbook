import { expect, test } from "./fixtures";

test("CB06 : confirmation avant de quitter l'éditeur avec des modifications", async ({ cookbook, uid }) => {
  const { page } = cookbook;
  await cookbook.goto("/new");
  await cookbook.editor().locator('input[name="name"]').fill(`Brouillon ${uid}`);

  await cookbook.panel.getByRole("button", { name: "Retour" }).click();
  const dialog = cookbook.editor().getByRole("alertdialog");
  await expect(dialog).toContainText("Quitter sans enregistrer ?");
  await dialog.getByRole("button", { name: "Annuler" }).click();
  await expect(dialog).toHaveCount(0);
  await expect(cookbook.editor().locator('input[name="name"]')).toHaveValue(`Brouillon ${uid}`);

  await cookbook.editor().getByRole("button", { name: "Annuler" }).click();
  await dialog.getByRole("button", { name: "Quitter" }).click();
  await expect(page).toHaveURL(/\/cookbook$/);
});

test("CB06 : sans modification, on quitte directement", async ({ cookbook, uid }) => {
  await cookbook.goto();
  const recipe = await cookbook.createRecipe({ name: `Salade ${uid}` });
  await cookbook.goto(`/edit/${recipe.id}`);
  await expect(cookbook.editor().locator('input[name="name"]')).toHaveValue(`Salade ${uid}`);
  await cookbook.panel.getByRole("button", { name: "Retour" }).click();
  await expect(cookbook.page).toHaveURL(new RegExp(`/cookbook/recipe/${recipe.id}$`));
});
