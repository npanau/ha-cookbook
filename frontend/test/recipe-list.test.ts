import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { RecipeSummary } from "../src/types";
import { SEARCH_DEBOUNCE_MS, type CookbookRecipeList } from "../src/views/recipe-list";
import "../src/views/recipe-list";
import { $, $$, mockHass, mount, settle } from "./helpers";

const summary = (id: string, name: string, categories: string[] = []): RecipeSummary => ({
  id,
  name,
  categories,
  prep_time: 10,
  cook_time: 20,
  total_time: null,
  image: null,
  updated_at: "2026-11-02T10:00:00+00:00",
});

const RECIPES = [summary("a", "Crème brûlée", ["Dessert"]), summary("b", "Omelette")];

function setup(recipes = RECIPES) {
  return mockHass({
    "cookbook/list": (msg) => ({
      recipes: msg.category ? recipes.filter((r) => r.categories.includes("Dessert")) : recipes,
    }),
    "cookbook/search": () => ({ recipes: recipes.slice(0, 1) }),
    "cookbook/categories": () => ({ categories: [{ name: "Dessert", count: 1 }] }),
  });
}

const names = (el: Element) => $$(el, ".recipe h3").map((h) => h.textContent);

async function type(el: CookbookRecipeList, value: string) {
  const input = $<HTMLInputElement>(el, "input")!;
  input.value = value;
  input.dispatchEvent(new InputEvent("input"));
  await settle(el);
}

describe("recipe list", () => {
  beforeEach(() => history.replaceState(null, "", "/cookbook"));
  afterEach(() => {
    document.body.innerHTML = "";
    vi.useRealTimers();
  });

  it("lists recipes with their total time and categories", async () => {
    const { hass } = setup();
    const el = await mount<CookbookRecipeList>("cookbook-recipe-list", { hass });
    expect(names(el)).toEqual(["Crème brûlée", "Omelette"]);
    expect($(el, ".recipe .time")!.textContent).toContain("30 min");
    expect($(el, ".recipe .chip")!.textContent).toBe("Dessert");
    expect($(el, ".recipe")!.getAttribute("href")).toBe("/cookbook/recipe/a");
  });

  it("debounces the search and keeps it in the URL", async () => {
    vi.useFakeTimers();
    const { hass, callWS } = setup();
    const el = await mount<CookbookRecipeList>("cookbook-recipe-list", { hass });

    await type(el, "cr");
    await type(el, "creme");
    await vi.advanceTimersByTimeAsync(SEARCH_DEBOUNCE_MS - 1);
    expect(callWS).not.toHaveBeenCalledWith(expect.objectContaining({ type: "cookbook/search" }));

    await vi.advanceTimersByTimeAsync(1);
    await settle(el);
    const searches = callWS.mock.calls.filter(([m]) => m.type === "cookbook/search");
    expect(searches).toEqual([[{ type: "cookbook/search", query: "creme" }]]);
    expect(names(el)).toEqual(["Crème brûlée"]);
    expect(location.search).toBe("?q=creme");
  });

  it("filters by category and toggles it off", async () => {
    const { hass, callWS } = setup();
    const el = await mount<CookbookRecipeList>("cookbook-recipe-list", { hass });
    const chip = $<HTMLButtonElement>(el, '[data-category="Dessert"]')!;

    chip.click();
    await settle(el);
    expect(callWS).toHaveBeenLastCalledWith({ type: "cookbook/list", category: "Dessert" });
    expect(names(el)).toEqual(["Crème brûlée"]);
    expect(chip.getAttribute("aria-pressed")).toBe("true");
    expect(location.search).toBe("?category=Dessert");

    chip.click();
    await settle(el);
    expect(callWS).toHaveBeenLastCalledWith({ type: "cookbook/list" });
    expect(location.search).toBe("");
  });

  it("restores search and filter from the URL", async () => {
    history.replaceState(null, "", "/cookbook?q=tarte&category=Dessert");
    const { hass, callWS } = setup();
    const el = await mount<CookbookRecipeList>("cookbook-recipe-list", { hass });
    expect($<HTMLInputElement>(el, "input")!.value).toBe("tarte");
    expect(callWS).toHaveBeenCalledWith({
      type: "cookbook/search",
      query: "tarte",
      category: "Dessert",
    });
  });

  it("ignores a slower, outdated response", async () => {
    let resolveFirst!: (value: unknown) => void;
    const { hass } = mockHass({
      "cookbook/categories": () => ({ categories: [] }),
      "cookbook/list": () => new Promise((resolve) => (resolveFirst = resolve)),
      "cookbook/search": () => ({ recipes: [summary("b", "Omelette")] }),
    });
    vi.useFakeTimers();
    const el = await mount<CookbookRecipeList>("cookbook-recipe-list", { hass });
    await type(el, "omelette");
    await vi.advanceTimersByTimeAsync(SEARCH_DEBOUNCE_MS);
    await settle(el);

    resolveFirst({ recipes: RECIPES });
    await settle(el);
    expect(names(el)).toEqual(["Omelette"]);
  });

  it("distinguishes an empty cookbook from a search without result", async () => {
    const { hass } = setup([]);
    const el = await mount<CookbookRecipeList>("cookbook-recipe-list", { hass });
    expect($(el, ".message h2")!.textContent).toBe("Aucune recette pour l'instant");

    history.replaceState(null, "", "/cookbook?q=zzz");
    const filtered = await mount<CookbookRecipeList>("cookbook-recipe-list", {
      hass: mockHass({
        "cookbook/search": () => ({ recipes: [] }),
        "cookbook/categories": () => ({ categories: [] }),
      }).hass,
    });
    expect($(filtered, ".message")!.textContent).toContain("Aucune recette ne correspond");
  });

  it("shows API errors", async () => {
    const { hass } = mockHass({
      "cookbook/list": () => Promise.reject({ code: "not_loaded", message: "Cookbook is not set up" }),
      "cookbook/categories": () => ({ categories: [] }),
    });
    const el = await mount<CookbookRecipeList>("cookbook-recipe-list", { hass });
    expect($(el, ".error")!.textContent).toContain("Cookbook is not set up");
  });
});
