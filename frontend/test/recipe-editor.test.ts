import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { rememberListSearch } from "../src/router";
import type { RecipeItem } from "../src/types";
import {
  type CookbookRecipeEditor,
  formFromRecipe,
  parseMinutes,
  toFields,
  validate,
} from "../src/views/recipe-editor";
import "../src/views/recipe-editor";
import { $, apiError, makeRecipe, mockHass, mount, settle } from "./helpers";

const categories = () => ({ categories: [{ name: "Dessert", count: 1 }] });

function type(el: Element, name: string, value: string) {
  const field = $<HTMLInputElement>(el, `[name="${name}"]`)!;
  field.value = value;
  field.dispatchEvent(new Event("input"));
}

const save = (el: Element) => $<HTMLButtonElement>(el, ".save")!.click();
const lists = (el: Element) =>
  [...el.shadowRoot!.querySelectorAll("cookbook-item-list-editor")] as (HTMLElement & {
    dispatchEvent(e: Event): boolean;
  })[];

function setItems(list: HTMLElement, items: RecipeItem[]) {
  list.dispatchEvent(new CustomEvent("items-changed", { detail: { items } }));
}

describe("editor form helpers", () => {
  it("parses minutes", () => {
    expect(parseMinutes("")).toBeNull();
    expect(parseMinutes(" 45 ")).toBe(45);
    expect(parseMinutes("1h")).toBeUndefined();
    expect(parseMinutes("-5")).toBeUndefined();
    expect(parseMinutes("2.5")).toBeUndefined();
  });

  it("validates the form", () => {
    const form = { ...formFromRecipe(), name: " ", prep_time: "abc", source_url: "ftp://x" };
    expect(validate(form)).toEqual({
      name: "name_required",
      prep_time: "minutes_invalid",
      source_url: "source_url_invalid",
    });
    expect(validate({ ...formFromRecipe(), name: "Tarte", source_url: "https://x.fr" })).toEqual({});
  });

  it("builds the API payload", () => {
    const form = { ...formFromRecipe(), name: " Tarte ", prep_time: "15", servings: "  ", notes: "Bon" };
    expect(toFields(form, [], [])).toEqual({
      name: "Tarte",
      description: null,
      categories: [],
      prep_time: 15,
      cook_time: null,
      total_time: null,
      servings: null,
      ingredients: [],
      steps: [],
      notes: "Bon",
      source_url: null,
    });
  });

  it("round-trips a recipe", () => {
    const recipe = makeRecipe();
    const fields = toFields(formFromRecipe(recipe), recipe.ingredients, recipe.steps);
    expect(fields).toMatchObject({ name: recipe.name, prep_time: 20, total_time: null, notes: null });
  });
});

describe("recipe editor", () => {
  beforeEach(() => history.replaceState(null, "", "/cookbook/new"));
  afterEach(() => {
    document.body.innerHTML = "";
    rememberListSearch("");
  });

  it("creates a recipe and opens it", async () => {
    const { hass, callWS } = mockHass({
      "cookbook/categories": categories,
      "cookbook/create": (msg) => makeRecipe({ id: "new1", name: msg.name as string }),
    });
    const el = await mount<CookbookRecipeEditor>("cookbook-recipe-editor", { hass });
    expect($(el, "h1")!.textContent).toBe("Nouvelle recette");

    type(el, "name", "Tarte aux pommes");
    type(el, "cook_time", "35");
    const [ingredients, steps] = lists(el);
    setItems(ingredients, [{ text: "4 pommes", section: null }]);
    setItems(steps, [{ text: "Cuire", section: null }]);
    expect(el.dirty).toBe(true);

    save(el);
    await settle(el);
    expect(callWS).toHaveBeenCalledWith({
      type: "cookbook/create",
      name: "Tarte aux pommes",
      description: null,
      categories: [],
      prep_time: null,
      cook_time: 35,
      total_time: null,
      servings: null,
      ingredients: [{ text: "4 pommes", section: null }],
      steps: [{ text: "Cuire", section: null }],
      notes: null,
      source_url: null,
    });
    expect(location.pathname).toBe("/cookbook/recipe/new1");
  });

  it("shows validation errors without calling the API", async () => {
    const { hass, callWS } = mockHass({ "cookbook/categories": categories });
    const el = await mount<CookbookRecipeEditor>("cookbook-recipe-editor", { hass });
    type(el, "prep_time", "vingt");
    save(el);
    await settle(el);
    expect($(el, ".field-error")!.textContent).toBe("Le nom est obligatoire.");
    expect($(el, '[name="prep_time"]')!.getAttribute("aria-invalid")).toBe("true");
    expect(callWS).not.toHaveBeenCalledWith(expect.objectContaining({ type: "cookbook/create" }));

    type(el, "name", "x");
    await settle(el);
    expect($(el, '[name="name"]')!.getAttribute("aria-invalid")).toBe("false");
  });

  it("suggests the total from prep and cook times", async () => {
    const { hass } = mockHass({ "cookbook/categories": categories });
    const el = await mount<CookbookRecipeEditor>("cookbook-recipe-editor", { hass });
    type(el, "prep_time", "20");
    type(el, "cook_time", "70");
    await settle(el);
    expect($<HTMLInputElement>(el, '[name="total_time"]')!.placeholder).toBe("auto : 1 h 30 min");
  });

  it("edits a recipe with the conflict check", async () => {
    const { hass, callWS } = mockHass({
      "cookbook/categories": categories,
      "cookbook/get": () => makeRecipe(),
      "cookbook/update": () => makeRecipe({ notes: "Top" }),
    });
    const el = await mount<CookbookRecipeEditor>("cookbook-recipe-editor", { hass, recipeId: "r1" });
    expect($(el, "h1")!.textContent).toBe("Modifier la recette");
    expect($<HTMLInputElement>(el, '[name="name"]')!.value).toBe("Crème brûlée");
    expect(el.dirty).toBe(false);

    type(el, "notes", "Top");
    save(el);
    await settle(el);
    expect(callWS).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "cookbook/update",
        recipe_id: "r1",
        expected_updated_at: "2026-11-02T10:00:00+00:00",
        notes: "Top",
      }),
    );
    expect(location.pathname).toBe("/cookbook/recipe/r1");
  });

  it("handles a conflict: overwrite or load the saved version", async () => {
    const latest = makeRecipe({ notes: "Version de Marie", updated_by_name: "Marie", updated_at: "2026-11-03T08:00:00+00:00" });
    let conflict = true;
    const { hass, callWS } = mockHass({
      "cookbook/categories": categories,
      "cookbook/get": vi.fn().mockReturnValueOnce(makeRecipe()).mockReturnValue(latest),
      "cookbook/update": () => (conflict ? apiError("conflict") : latest),
    });
    const el = await mount<CookbookRecipeEditor>("cookbook-recipe-editor", { hass, recipeId: "r1" });
    type(el, "notes", "Ma version");
    save(el);
    await settle(el);
    expect($(el, ".conflict")!.textContent).toContain("Marie a modifié cette recette entre-temps.");

    // Overwrite: same changes, without the conflict check.
    conflict = false;
    $<HTMLButtonElement>(el, ".overwrite")!.click();
    await settle(el);
    const last = callWS.mock.calls.at(-1)![0];
    expect(last).toMatchObject({ type: "cookbook/update", notes: "Ma version" });
    expect(last).not.toHaveProperty("expected_updated_at");
  });

  it("can discard its changes for the saved version", async () => {
    const latest = makeRecipe({ notes: "Version de Marie", updated_by_name: "Marie" });
    const { hass } = mockHass({
      "cookbook/categories": categories,
      "cookbook/get": vi.fn().mockReturnValueOnce(makeRecipe()).mockReturnValue(latest),
      "cookbook/update": () => apiError("conflict"),
    });
    const el = await mount<CookbookRecipeEditor>("cookbook-recipe-editor", { hass, recipeId: "r1" });
    type(el, "notes", "Ma version");
    save(el);
    await settle(el);
    $<HTMLButtonElement>(el, ".reload")!.click();
    await settle(el);
    expect($<HTMLTextAreaElement>(el, '[name="notes"]')!.value).toBe("Version de Marie");
    expect($(el, ".conflict")).toBeNull();
    expect(el.dirty).toBe(false);
  });

  it("shows server errors", async () => {
    const { hass } = mockHass({
      "cookbook/categories": categories,
      "cookbook/create": () => apiError("invalid_format", "expected str"),
    });
    const el = await mount<CookbookRecipeEditor>("cookbook-recipe-editor", { hass });
    type(el, "name", "x");
    save(el);
    await settle(el);
    expect($(el, ".banner.error")!.textContent).toContain("expected str");
  });

  it("asks before leaving with unsaved changes", async () => {
    rememberListSearch("?q=tarte");
    const { hass } = mockHass({ "cookbook/categories": categories });
    const el = await mount<CookbookRecipeEditor>("cookbook-recipe-editor", { hass });
    type(el, "name", "Brouillon");
    $<HTMLButtonElement>(el, ".cancel")!.click();
    await settle(el);
    const dialog = $(el, "cookbook-confirm-dialog")!;
    expect(dialog.hasAttribute("open")).toBe(true);
    expect(location.pathname).toBe("/cookbook/new");

    const unload = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(unload);
    expect(unload.defaultPrevented).toBe(true);

    dialog.shadowRoot!.querySelector<HTMLButtonElement>(".confirm")!.click();
    await settle(el);
    expect(location.pathname + location.search).toBe("/cookbook?q=tarte");
  });

  it("leaves directly without changes", async () => {
    const { hass } = mockHass({ "cookbook/categories": categories, "cookbook/get": () => makeRecipe() });
    const el = await mount<CookbookRecipeEditor>("cookbook-recipe-editor", { hass, recipeId: "r1" });
    $<HTMLButtonElement>(el, ".cancel")!.click();
    await settle(el);
    expect(location.pathname).toBe("/cookbook/recipe/r1");
  });

  it("saves with Ctrl+S", async () => {
    const { hass, callWS } = mockHass({
      "cookbook/categories": categories,
      "cookbook/create": () => makeRecipe({ id: "k" }),
    });
    const el = await mount<CookbookRecipeEditor>("cookbook-recipe-editor", { hass });
    type(el, "name", "Raccourci");
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "s", ctrlKey: true, cancelable: true }));
    await settle(el);
    expect(callWS).toHaveBeenCalledWith(expect.objectContaining({ type: "cookbook/create", name: "Raccourci" }));
  });

  it("passes existing categories as suggestions", async () => {
    const { hass } = mockHass({ "cookbook/categories": categories });
    const el = await mount<CookbookRecipeEditor>("cookbook-recipe-editor", { hass });
    const input = $(el, "cookbook-category-input") as HTMLElement & { suggestions: string[] };
    expect(input.suggestions).toEqual(["Dessert"]);
  });
});
