import { expect, test } from "./fixtures";

// Pages served by the recipes-site container of the E2E Docker; the query makes the
// source URL unique per test (tests run in parallel on the same HA).
const SITE = "http://recipes-site:8000";

test("CB08 : importer une recette depuis une URL", async ({ cookbook, uid }) => {
  const { page } = cookbook;
  const url = `${SITE}/tarte-aux-poires.html?t=${uid}`;
  await cookbook.goto();
  await cookbook.panel.locator("cookbook-recipe-list .top").getByRole("button", { name: "Importer" }).click();
  await expect(page).toHaveURL(/\/cookbook\/import$/);

  const view = cookbook.panel.locator("cookbook-recipe-import");
  await view.getByRole("textbox", { name: "Adresse de la recette" }).fill(url);
  await view.getByRole("button", { name: "Analyser" }).click();

  // Preview = the editor, prefilled; the marketing suffix of the title is removed.
  const editor = view.locator("cookbook-recipe-editor");
  await expect(editor.locator('input[name="name"]')).toHaveValue("Tarte aux poires et amandes");
  await expect(editor.getByRole("status")).toContainText("Importée depuis recipes-site");
  await expect(editor.locator('input[name="servings"]')).toHaveValue("6");
  await expect(editor.locator('input[name="prep_time"]')).toHaveValue("25");
  await expect(editor.locator("cookbook-item-list-editor.ingredients li.item input")).toHaveCount(4);

  await editor.locator('input[name="name"]').fill(`Tarte aux poires ${uid}`);
  await editor.getByRole("button", { name: "Enregistrer" }).click();

  const sheet = cookbook.sheet();
  await expect(sheet.getByRole("heading", { level: 1 })).toHaveText(`Tarte aux poires ${uid}`);
  await expect(sheet.locator(".count")).toHaveText("6 personnes");
  await expect(sheet.locator(".ingredients .item-text")).toContainText(["100 g de poudre d'amandes"]);
  await expect(sheet.getByRole("link", { name: "Voir la recette d'origine" })).toHaveAttribute("href", url);

  // The same address again: no second copy, the existing recipe is pointed out.
  await cookbook.goto(`/import?url=${encodeURIComponent(url)}`);
  await expect(view.locator(".duplicate")).toContainText(`déjà dans le livre : « Tarte aux poires ${uid} »`);
  await expect(view.locator("cookbook-recipe-editor")).toHaveCount(0);
  await view.getByRole("button", { name: "Voir la recette" }).click();
  await expect(sheet.getByRole("heading", { level: 1 })).toHaveText(`Tarte aux poires ${uid}`);

  // Typing the same source URL by hand is refused too.
  await cookbook.goto("/new");
  const manual = cookbook.editor();
  await manual.locator('input[name="name"]').fill(`Copie ${uid}`);
  await manual.locator('input[name="source_url"]').fill(url);
  await manual.getByRole("button", { name: "Enregistrer" }).click();
  await expect(manual.getByRole("alert")).toContainText(`Une autre recette a déjà cette URL source : « Tarte aux poires ${uid} »`);
  await expect(page).toHaveURL(/\/cookbook\/new$/);
});

test("CB08 : page sans recette", async ({ cookbook, uid }) => {
  await cookbook.goto(`/import?url=${encodeURIComponent(`${SITE}/accueil.html?t=${uid}`)}`);
  const view = cookbook.panel.locator("cookbook-recipe-import");
  await expect(view.getByRole("alert")).toHaveText("Aucune recette n'a été trouvée sur cette page.");
});

test("CB08 : quitter l'aperçu sans l'enregistrer demande confirmation", async ({ cookbook, uid }) => {
  await cookbook.goto(`/import?url=${encodeURIComponent(`${SITE}/tarte-aux-poires.html?t=${uid}`)}`);
  const editor = cookbook.panel.locator("cookbook-recipe-import cookbook-recipe-editor");
  await expect(editor.locator('input[name="name"]')).toHaveValue("Tarte aux poires et amandes");
  await cookbook.panel.getByRole("button", { name: "Retour" }).click();
  await expect(editor.getByRole("alertdialog")).toContainText("Quitter sans enregistrer ?");
});
