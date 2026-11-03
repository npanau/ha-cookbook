import { expect, test } from "./fixtures";

test("CB05 : mode cuisine et impression", async ({ cookbook, uid }) => {
  const { page } = cookbook;
  await cookbook.goto();
  const recipe = await cookbook.createRecipe({
    name: `Pâtes ${uid}`,
    ingredients: [
      { text: "500 g de pâtes", section: null },
      { text: "Sel", section: null },
    ],
    steps: [{ text: "Cuire 10 min", section: null }],
  });
  await cookbook.goto(`/recipe/${recipe.id}`);
  const sheet = cookbook.sheet();

  // Ticked items survive a reload (stored on the device).
  await sheet.getByRole("checkbox", { name: "500 g de pâtes" }).check();
  await page.reload();
  await expect(sheet.getByRole("checkbox", { name: "500 g de pâtes" })).toBeChecked();
  await expect(sheet.getByRole("checkbox", { name: "Sel" })).not.toBeChecked();
  await sheet.getByRole("button", { name: "Tout décocher" }).click();
  await expect(sheet.getByRole("checkbox", { name: "500 g de pâtes" })).not.toBeChecked();

  // Larger text.
  await sheet.getByRole("button", { name: "Texte agrandi" }).click();
  await expect(sheet).toHaveAttribute("large-text", "");

  // Printing renders the recipe alone in a hidden iframe.
  await page.evaluate(() => {
    const w = window as unknown as { printed: string[] };
    w.printed = [];
    new MutationObserver((mutations) => {
      for (const m of mutations)
        for (const node of m.addedNodes) if (node instanceof HTMLIFrameElement) w.printed.push(node.srcdoc);
    }).observe(document.body, { childList: true });
  });
  await sheet.getByRole("button", { name: "Imprimer" }).click();
  const printed = await page.waitForFunction(() => (window as unknown as { printed: string[] }).printed[0]);
  const html = await printed.jsonValue();
  expect(html).toContain(`<h1>Pâtes ${uid}</h1>`);
  expect(html).toContain("<li>500 g de pâtes</li>");
  expect(html).not.toContain("Supprimer");
});
