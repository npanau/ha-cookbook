import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { rememberListSearch } from "../src/router";
import type { RecipeItem } from "../src/types";
import {
  type CookbookRecipeEditor,
  formFromRecipe,
  parseMinutes,
  parseServings,
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
      servings_unit: null,
      ingredients: [],
      steps: [],
      notes: "Bon",
      source_url: null,
    });
  });

  it("validates and converts the number of servings", () => {
    expect(parseServings("")).toBeNull();
    expect(parseServings(" 6 ")).toBe(6);
    for (const invalid of ["0", "2.5", "4 pers", "1001"]) expect(parseServings(invalid)).toBeUndefined();
    expect(validate({ ...formFromRecipe(), name: "x", servings: "deux" })).toEqual({ servings: "servings_invalid" });
  });

  it("gives a default unit to a number of servings", () => {
    const form = { ...formFromRecipe(), name: "x", servings: "4" };
    expect(toFields(form, [], [], "personnes")).toMatchObject({ servings: 4, servings_unit: "personnes" });
    expect(toFields({ ...form, servings_unit: "ramequins" }, [], [], "personnes").servings_unit).toBe("ramequins");
    expect(toFields({ ...form, servings: "" }, [], [], "personnes")).toMatchObject({ servings: null, servings_unit: null });
  });

  it("round-trips a recipe", () => {
    const recipe = makeRecipe();
    const fields = toFields(formFromRecipe(recipe), recipe.ingredients, recipe.steps);
    expect(fields).toMatchObject({
      name: recipe.name,
      prep_time: 20,
      total_time: null,
      notes: null,
      servings: 4,
      servings_unit: "personnes",
    });
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
      servings_unit: null,
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

  it("explains a source URL already used by another recipe", async () => {
    const { hass } = mockHass({
      "cookbook/categories": categories,
      "cookbook/create": () =>
        Promise.reject({
          code: "duplicate_source",
          message: "Another recipe already has this source URL",
          translation_placeholders: { recipe_id: "old", name: "Ma crème brûlée" },
        }),
    });
    const el = await mount<CookbookRecipeEditor>("cookbook-recipe-editor", { hass });
    type(el, "name", "Copie");
    type(el, "source_url", "https://www.marmiton.org/x");
    save(el);
    await settle(el);
    expect($(el, ".duplicate")!.textContent).toContain(
      "Une autre recette a déjà cette URL source : « Ma crème brûlée ».",
    );
    expect($(el, '[name="source_url"]')!.getAttribute("aria-invalid")).toBe("true");
    expect(location.pathname).toBe("/cookbook/new");

    // Opening the existing recipe asks first (the form has unsaved changes).
    $<HTMLButtonElement>(el, ".open-duplicate")!.click();
    await settle(el);
    expect($(el, "cookbook-confirm-dialog")!.hasAttribute("open")).toBe(true);
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

  it("sends servings with the default unit", async () => {
    const { hass, callWS } = mockHass({
      "cookbook/categories": categories,
      "cookbook/create": () => makeRecipe({ id: "s" }),
    });
    const el = await mount<CookbookRecipeEditor>("cookbook-recipe-editor", { hass });
    type(el, "name", "Tarte");
    type(el, "servings", "8");
    save(el);
    await settle(el);
    expect(callWS).toHaveBeenCalledWith(
      expect.objectContaining({ type: "cookbook/create", servings: 8, servings_unit: "personnes" }),
    );
  });

  describe("photo", () => {
    const photoFile = () => new File([new Uint8Array(10)], "p.jpg", { type: "image/jpeg" });
    const choosePhoto = (el: Element, file: File | null) =>
      $(el, "cookbook-photo-input")!.dispatchEvent(new CustomEvent("photo-changed", { detail: { file } }));
    const ok = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });

    beforeEach(() => {
      URL.createObjectURL = vi.fn(() => "blob:preview");
      URL.revokeObjectURL = vi.fn();
    });

    it("saves the recipe, then uploads the chosen photo", async () => {
      const { hass, callWS, fetchWithAuth } = mockHass(
        { "cookbook/categories": categories, "cookbook/create": () => makeRecipe({ id: "p1" }) },
        { fetch: () => ok(makeRecipe({ id: "p1", image: "img" })) },
      );
      const el = await mount<CookbookRecipeEditor>("cookbook-recipe-editor", { hass });
      type(el, "name", "Avec photo");
      choosePhoto(el, photoFile());
      await settle(el);
      expect($<HTMLImageElement>(el, "cookbook-photo-input")!.getAttribute("src") ?? "").toBe("");
      expect(($(el, "cookbook-photo-input") as unknown as { src: string }).src).toBe("blob:preview");

      save(el);
      await settle(el);
      expect(callWS).toHaveBeenCalledWith(expect.objectContaining({ type: "cookbook/create" }));
      const [path, init] = fetchWithAuth.mock.calls[0];
      expect(path).toBe("/api/cookbook/recipes/p1/image");
      expect(init!.method).toBe("POST");
      expect((init!.body as FormData).get("file")).toBeInstanceOf(File);
      expect(location.pathname).toBe("/cookbook/recipe/p1");
    });

    it("a photo change alone counts as unsaved", async () => {
      const { hass } = mockHass({ "cookbook/categories": categories, "cookbook/get": () => makeRecipe() });
      const el = await mount<CookbookRecipeEditor>("cookbook-recipe-editor", { hass, recipeId: "r1" });
      expect(el.dirty).toBe(false);
      choosePhoto(el, photoFile());
      expect(el.dirty).toBe(true);
    });

    it("removes the saved photo", async () => {
      const recipe = makeRecipe({ image: "img", image_url: "/api/cookbook/images/img/large.webp?authSig=s" });
      const { hass, fetchWithAuth } = mockHass(
        { "cookbook/categories": categories, "cookbook/get": () => recipe, "cookbook/update": () => recipe },
        { fetch: () => ok({ ...recipe, image: null, image_url: null }) },
      );
      const el = await mount<CookbookRecipeEditor>("cookbook-recipe-editor", { hass, recipeId: "r1" });
      expect(($(el, "cookbook-photo-input") as unknown as { src: string }).src).toContain("authSig=s");
      choosePhoto(el, null);
      await settle(el);
      expect(($(el, "cookbook-photo-input") as unknown as { src: string | null }).src).toBeNull();
      save(el);
      await settle(el);
      expect(fetchWithAuth).toHaveBeenCalledWith("/api/cookbook/recipes/r1/image", { method: "DELETE" });
    });

    it("downloads the photo of an imported page after saving", async () => {
      const { hass, callWS } = mockHass({
        "cookbook/categories": categories,
        "cookbook/create": () => makeRecipe({ id: "imp" }),
        "cookbook/import_image": () => makeRecipe({ id: "imp", image: "img" }),
      });
      const draft = { ...makeRecipe(), source_url: "https://site.fr/r" };
      const el = await mount<CookbookRecipeEditor>("cookbook-recipe-editor", {
        hass,
        draftImageUrl: "https://site.fr/photo.jpg",
        draft,
      });
      expect(($(el, "cookbook-photo-input") as unknown as { src: string }).src).toBe("https://site.fr/photo.jpg");
      save(el);
      await settle(el);
      expect(callWS).toHaveBeenCalledWith({
        type: "cookbook/import_image",
        recipe_id: "imp",
        url: "https://site.fr/photo.jpg",
      });
      expect(location.pathname).toBe("/cookbook/recipe/imp");
    });

    it("the imported photo can be removed before saving", async () => {
      const { hass, callWS } = mockHass({
        "cookbook/categories": categories,
        "cookbook/create": () => makeRecipe({ id: "imp" }),
      });
      const el = await mount<CookbookRecipeEditor>("cookbook-recipe-editor", {
        hass,
        draftImageUrl: "https://site.fr/photo.jpg",
        draft: makeRecipe(),
      });
      choosePhoto(el, null);
      save(el);
      await settle(el);
      expect(callWS).not.toHaveBeenCalledWith(expect.objectContaining({ type: "cookbook/import_image" }));
    });

    it("keeps the saved recipe and lets retry when the photo fails", async () => {
      let attempt = 0;
      const { hass, callWS } = mockHass(
        {
          "cookbook/categories": categories,
          "cookbook/create": () => makeRecipe({ id: "p2" }),
          "cookbook/update": () => makeRecipe({ id: "p2" }),
        },
        {
          fetch: () =>
            ++attempt === 1
              ? new Response(JSON.stringify({ code: "invalid_image", message: "This file is not a valid photo" }), { status: 400 })
              : ok(makeRecipe({ id: "p2", image: "img" })),
        },
      );
      const el = await mount<CookbookRecipeEditor>("cookbook-recipe-editor", { hass });
      type(el, "name", "Photo ratée");
      choosePhoto(el, photoFile());
      save(el);
      await settle(el);
      expect($(el, ".banner.error")!.textContent).toContain(
        "La recette est enregistrée, mais la photo n'a pas pu être ajoutée (This file is not a valid photo)",
      );
      expect(location.pathname).toBe("/cookbook/new");

      // Saving again updates the recipe (no second copy) and retries the photo.
      save(el);
      await settle(el);
      expect(callWS.mock.calls.filter(([m]) => m.type === "cookbook/create")).toHaveLength(1);
      expect(callWS).toHaveBeenCalledWith(expect.objectContaining({ type: "cookbook/update", recipe_id: "p2" }));
      expect(location.pathname).toBe("/cookbook/recipe/p2");
    });
  });

  it("passes existing categories as suggestions", async () => {
    const { hass } = mockHass({ "cookbook/categories": categories });
    const el = await mount<CookbookRecipeEditor>("cookbook-recipe-editor", { hass });
    const input = $(el, "cookbook-category-input") as HTMLElement & { suggestions: string[] };
    expect(input.suggestions).toEqual(["Dessert"]);
  });
});
