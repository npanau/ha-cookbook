import { expect, test } from "./fixtures";

test("CB01 : créer une recette avec sections, collage et réordonnancement", async ({ cookbook, uid }, testInfo) => {
  const { page } = cookbook;
  await cookbook.goto();
  await cookbook.newRecipeButton().click();
  await expect(page).toHaveURL(/\/cookbook\/new$/);
  const editor = cookbook.editor();

  await editor.locator('input[name="name"]').fill(`Crème brûlée ${uid}`);
  const category = editor.locator("cookbook-category-input input");
  await category.fill(`Dessert ${uid}`);
  await category.press("Enter");
  await editor.locator('input[name="prep_time"]').fill("20");
  await editor.locator('input[name="cook_time"]').fill("40");
  await expect(editor.locator('input[name="total_time"]')).toHaveAttribute("placeholder", "auto : 1 h");

  // Ingredients: a pasted list becomes several lines, then a "Finition" section.
  const ingredients = editor.locator("cookbook-item-list-editor.ingredients");
  await cookbook.paste(ingredients.locator("input").first(), "- 6 jaunes d'œufs\n- 50 cl de crème\n- 100 g de sucre");
  await expect(ingredients.locator("li.item input")).toHaveCount(3);
  await ingredients.getByRole("button", { name: "Ajouter une section" }).click();
  await page.keyboard.type("Finition");
  await page.keyboard.press("Enter");
  await page.keyboard.type("Cassonade");

  // Steps typed in the wrong order, then reordered.
  const steps = editor.locator("cookbook-item-list-editor.steps");
  await steps.locator("textarea").first().fill("Fouetter les jaunes et le sucre");
  await steps.locator("textarea").first().press("Enter");
  await page.keyboard.type("Cuire 40 min à 100 °C");
  await page.keyboard.press("Enter");
  await page.keyboard.type("Ajouter la crème");
  const lastStep = steps.locator("li").nth(2);
  if (testInfo.project.name === "desktop") {
    await lastStep.locator(".handle").dragTo(steps.locator("li").nth(1).locator(".handle"));
  } else {
    await lastStep.getByRole("button", { name: "Monter" }).click();
  }
  const expected = ["Fouetter les jaunes et le sucre", "Ajouter la crème", "Cuire 40 min à 100 °C"];
  for (const [index, text] of expected.entries()) {
    await expect(steps.locator("textarea").nth(index)).toHaveValue(text);
  }

  await editor.getByRole("button", { name: "Enregistrer" }).click();
  await expect(page).toHaveURL(/\/cookbook\/recipe\/\w+$/);

  const sheet = cookbook.sheet();
  await expect(sheet.getByRole("heading", { level: 1 })).toHaveText(`Crème brûlée ${uid}`);
  await expect(sheet.locator(".meta")).toContainText("1 h");
  await expect(sheet.locator(".ingredients .item-text")).toHaveText([
    "6 jaunes d'œufs",
    "50 cl de crème",
    "100 g de sucre",
    "Cassonade",
  ]);
  await expect(sheet.locator(".ingredients h3")).toHaveText(["Finition"]);
  await expect(sheet.locator(".steps .item-text")).toHaveText([
    "Fouetter les jaunes et le sucre",
    "Ajouter la crème",
    "Cuire 40 min à 100 °C",
  ]);
  await expect(sheet.locator(".chip")).toHaveText([`Dessert ${uid}`]);
});

test("CB01 : le nom est obligatoire", async ({ cookbook }) => {
  await cookbook.goto("/new");
  const editor = cookbook.editor();
  await editor.locator('input[name="prep_time"]').fill("vingt");
  await editor.getByRole("button", { name: "Enregistrer" }).click();
  await expect(editor.getByText("Le nom est obligatoire.")).toBeVisible();
  await expect(editor.getByText("Indiquez un nombre entier de minutes.")).toBeVisible();
  await expect(cookbook.page).toHaveURL(/\/cookbook\/new$/);
});
