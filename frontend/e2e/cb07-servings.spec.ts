import { expect, test } from "./fixtures";

test("CB07 : adapter les quantités au nombre de personnes", async ({ cookbook, uid }) => {
  const { page } = cookbook;
  await cookbook.goto();
  const recipe = await cookbook.createRecipe({
    name: `Pâte à crêpes ${uid}`,
    servings: 4,
    servings_unit: "personnes",
    ingredients: [
      { text: "200 g de farine", section: null },
      { text: "3 œufs", section: null },
      { text: "½ l de lait", section: null },
      { text: "1 pincée de sel", section: null },
      { text: "Sucre", section: null },
    ],
    steps: [{ text: "Mélanger 200 g de farine et le lait", section: null }],
  });
  await cookbook.goto(`/recipe/${recipe.id}`);
  const sheet = cookbook.sheet();
  const ingredients = sheet.locator(".ingredients .item-text");

  await sheet.getByRole("button", { name: "Une de plus" }).click();
  await sheet.getByRole("button", { name: "Une de plus" }).click();
  await expect(sheet.locator(".count")).toHaveText("6 personnes");
  await expect(ingredients).toHaveText(["300 g de farine", "4½ œufs", "0,75 l de lait", "1½ pincée de sel", "Sucre"]);
  await expect(sheet.getByRole("status")).toContainText("Quantités adaptées pour 6 personnes (recette pour 4)");
  // Steps are not scaled.
  await expect(sheet.locator(".steps .item-text")).toHaveText(["Mélanger 200 g de farine et le lait"]);

  // Kept on reload, then printed with the adapted quantities.
  await expect(page).toHaveURL(/\?parts=6$/);
  await page.reload();
  await expect(ingredients.first()).toHaveText("300 g de farine");
  await page.evaluate(() => {
    const w = window as unknown as { printed: string[] };
    w.printed = [];
    new MutationObserver((mutations) => {
      for (const m of mutations)
        for (const node of m.addedNodes) if (node instanceof HTMLIFrameElement) w.printed.push(node.srcdoc);
    }).observe(document.body, { childList: true });
  });
  await sheet.getByRole("button", { name: "Imprimer" }).click();
  const html = await (await page.waitForFunction(() => (window as unknown as { printed: string[] }).printed[0])).jsonValue();
  expect(html).toContain("<strong>Pour</strong> 6 personnes");
  expect(html).toContain("<li>300 g de farine</li>");

  // Back to the recipe's number.
  await sheet.getByRole("button", { name: "Revenir à 4" }).click();
  await expect(ingredients.first()).toHaveText("200 g de farine");
  await expect(sheet.getByRole("status")).toHaveCount(0);
});

test("CB07 : saisir le nombre de personnes dans l'éditeur", async ({ cookbook, uid }) => {
  await cookbook.goto("/new");
  const editor = cookbook.editor();
  await editor.locator('input[name="name"]').fill(`Gratin ${uid}`);
  await editor.locator('input[name="servings"]').fill("quatre");
  await editor.getByRole("button", { name: "Enregistrer" }).click();
  await expect(editor.getByText("Indiquez un nombre entier entre 1 et 1000.")).toBeVisible();

  await editor.locator('input[name="servings"]').fill("8");
  await editor.getByRole("button", { name: "Enregistrer" }).click();
  // No unit typed: "personnes" by default.
  await expect(cookbook.sheet().locator(".count")).toHaveText("8 personnes");
});
