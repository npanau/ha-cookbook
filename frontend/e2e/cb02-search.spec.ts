import { expect, test } from "./fixtures";

test("CB02 : rechercher par ingrédient, filtrer, et retrouver sa recherche au retour", async ({ cookbook, uid }) => {
  const { page } = cookbook;
  await cookbook.goto();
  const category = `Cat ${uid}`;
  await cookbook.createRecipe({ name: `Omelette ${uid}`, ingredients: [{ text: "3 œufs", section: null }] });
  await cookbook.createRecipe({ name: `Flan ${uid}`, categories: [category], ingredients: [{ text: "4 oeufs", section: null }] });
  await cookbook.createRecipe({ name: `Tarte ${uid}`, categories: [category], ingredients: [{ text: "4 pommes", section: null }] });
  await page.reload();

  // Accent/ligature-insensitive; the matching ingredient is shown and highlighted.
  await cookbook.search(`oeufs ${uid}`);
  await expect(cookbook.cards().locator("h3")).toHaveText([`Flan ${uid}`, `Omelette ${uid}`]);
  await expect(cookbook.cards().nth(1).locator(".matches mark")).toHaveText("œufs");
  await expect(page).toHaveURL(new RegExp(`\\?q=oeufs`));

  // Category filter on top of the search.
  await cookbook.panel.locator(`button[data-category="${category}"]`).click();
  await expect(cookbook.cards().locator("h3")).toHaveText([`Flan ${uid}`]);

  // Open the recipe, come back: search and filter are kept.
  await cookbook.cards().first().click();
  await expect(cookbook.sheet().getByRole("heading", { level: 1 })).toHaveText(`Flan ${uid}`);
  await cookbook.panel.getByRole("button", { name: "Retour" }).click();
  await expect(cookbook.panel.getByRole("searchbox")).toHaveValue(`oeufs ${uid}`);
  await expect(cookbook.panel.locator(`button[data-category="${category}"]`)).toHaveAttribute("aria-pressed", "true");
  await expect(cookbook.cards().locator("h3")).toHaveText([`Flan ${uid}`]);

  // Without the search: the whole category.
  await cookbook.panel.getByRole("button", { name: "Effacer la recherche" }).click();
  await expect(cookbook.cards().locator("h3")).toHaveText([`Flan ${uid}`, `Tarte ${uid}`]);
});

test("CB02 : recherche sans résultat", async ({ cookbook, uid }) => {
  await cookbook.goto();
  await cookbook.search(`introuvable ${uid}`);
  await expect(cookbook.panel.getByText("Aucune recette ne correspond à votre recherche.")).toBeVisible();
});
