import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { RecipeFields } from "../src/types";
import type { CookbookRecipeEditor } from "../src/views/recipe-editor";
import { type CookbookRecipeImport, siteName } from "../src/views/recipe-import";
import "../src/views/recipe-import";
import { $, apiError, mockHass, mount, settle } from "./helpers";

const SCRAPED: RecipeFields = {
  name: "Crème brûlée",
  description: null,
  categories: ["Dessert"],
  prep_time: 20,
  cook_time: 50,
  total_time: 70,
  servings: 8,
  servings_unit: null,
  ingredients: [{ text: "6 jaunes d'oeuf", section: null }],
  steps: [{ text: "Cuire.", section: null }],
  notes: null,
  source_url: "https://www.marmiton.org/recettes/creme-brulee.aspx",
};

function setup(scrape: (msg: Record<string, unknown>) => unknown = () => ({ recipe: SCRAPED, duplicate: null })) {
  return mockHass({
    "cookbook/scrape": scrape,
    "cookbook/categories": () => ({ categories: [] }),
    "cookbook/create": () => ({ ...SCRAPED, id: "new1" }),
  });
}

async function analyze(el: CookbookRecipeImport, url: string) {
  const input = $<HTMLInputElement>(el, 'input[name="url"]')!;
  input.value = url;
  input.dispatchEvent(new Event("input"));
  await settle(el);
  $<HTMLButtonElement>(el, ".analyze")!.click();
  await settle(el);
}

const editorOf = (el: Element) => $<CookbookRecipeEditor>(el, "cookbook-recipe-editor");

describe("recipe import", () => {
  beforeEach(() => history.replaceState(null, "", "/cookbook/import"));
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("names the site", () => {
    expect(siteName("https://www.marmiton.org/recettes/x.aspx")).toBe("marmiton.org");
    expect(siteName("not a url")).toBe("not a url");
  });

  it("analyzes the page and opens the editor prefilled", async () => {
    const { hass, callWS } = setup();
    const el = await mount<CookbookRecipeImport>("cookbook-recipe-import", { hass });
    expect($<HTMLButtonElement>(el, ".analyze")!.disabled).toBe(true);

    await analyze(el, " https://www.marmiton.org/recettes/creme-brulee.aspx ");
    expect(callWS).toHaveBeenCalledWith({
      type: "cookbook/scrape",
      url: "https://www.marmiton.org/recettes/creme-brulee.aspx",
    });
    const editor = editorOf(el)!;
    await settle(editor);
    expect($<HTMLInputElement>(editor, '[name="name"]')!.value).toBe("Crème brûlée");
    expect($<HTMLInputElement>(editor, '[name="servings"]')!.value).toBe("8");
    expect($(editor, ".imported")!.textContent).toContain("Importée depuis marmiton.org");
    // Not saved yet: leaving asks for confirmation.
    expect(editor.dirty).toBe(true);
  });

  it("saves the preview as a new recipe", async () => {
    const { hass, callWS } = setup();
    const el = await mount<CookbookRecipeImport>("cookbook-recipe-import", { hass });
    await analyze(el, "https://www.marmiton.org/x");
    const editor = editorOf(el)!;
    await settle(editor);
    $<HTMLButtonElement>(editor, ".save")!.click();
    await settle(editor);
    expect(callWS).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "cookbook/create",
        name: "Crème brûlée",
        servings: 8,
        servings_unit: "personnes",
        source_url: SCRAPED.source_url,
      }),
    );
    expect(location.pathname).toBe("/cookbook/recipe/new1");
  });

  it.each([
    ["not_a_recipe", "Aucune recette n'a été trouvée sur cette page."],
    ["blocked_url", "Les adresses du réseau local ne peuvent pas être importées."],
    ["too_large", "Cette page est trop lourde pour être importée."],
    ["fetch_failed", "Le site n'a pas pu être joint (The site answered HTTP 403)."],
    ["unknown_error", "Une erreur est survenue : The site answered HTTP 403"],
  ])("explains the %s error", async (code, message) => {
    const { hass } = setup(() => apiError(code, "The site answered HTTP 403"));
    const el = await mount<CookbookRecipeImport>("cookbook-recipe-import", { hass });
    await analyze(el, "https://x.fr");
    expect($(el, '[role="alert"]')!.textContent).toBe(message);
    expect(editorOf(el)).toBeNull();
  });

  it("does not offer a page already imported", async () => {
    const duplicate = { id: "old", name: "Ma crème brûlée" };
    const { hass } = setup(() => ({ recipe: SCRAPED, duplicate }));
    const el = await mount<CookbookRecipeImport>("cookbook-recipe-import", { hass });
    await analyze(el, "https://www.marmiton.org/x");
    expect($(el, ".duplicate")!.textContent).toContain("Cette recette est déjà dans le livre : « Ma crème brûlée ».");
    // One recipe per source URL: no preview to save a second copy.
    expect(editorOf(el)).toBeNull();

    const open = $<HTMLButtonElement>(el, ".open-duplicate")!;
    expect(open.textContent!.trim()).toBe("Voir la recette");
    open.click();
    expect(location.pathname).toBe("/cookbook/recipe/old");
  });

  it("starts over with another address", async () => {
    const { hass } = setup(() => ({ recipe: SCRAPED, duplicate: { id: "old", name: "x" } }));
    const el = await mount<CookbookRecipeImport>("cookbook-recipe-import", { hass });
    await analyze(el, "https://www.marmiton.org/x");
    $<HTMLButtonElement>(el, ".restart")!.click();
    await settle(el);
    expect($(el, ".duplicate")).toBeNull();
    expect($<HTMLInputElement>(el, 'input[name="url"]')!.value).toBe("https://www.marmiton.org/x");
  });

  it("starts the analysis from ?url=", async () => {
    history.replaceState(null, "", "/cookbook/import?url=https%3A%2F%2Fwww.marmiton.org%2Fx");
    const { hass, callWS } = setup();
    const el = await mount<CookbookRecipeImport>("cookbook-recipe-import", { hass });
    await settle(el);
    expect(callWS).toHaveBeenCalledWith({ type: "cookbook/scrape", url: "https://www.marmiton.org/x" });
    expect(editorOf(el)).not.toBeNull();
  });

  it("asks the editor before leaving, or leaves directly without a preview", async () => {
    const { hass } = setup();
    const el = await mount<CookbookRecipeImport>("cookbook-recipe-import", { hass });
    el.requestLeave("/cookbook");
    expect(location.pathname).toBe("/cookbook");

    history.replaceState(null, "", "/cookbook/import");
    await analyze(el, "https://www.marmiton.org/x");
    const spy = vi.spyOn(editorOf(el)!, "requestLeave");
    el.requestLeave("/cookbook");
    expect(spy).toHaveBeenCalledWith("/cookbook");
  });
});
