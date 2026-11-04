import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as print from "../src/print";
import { rememberListSearch } from "../src/router";
import type { CookbookRecipeView } from "../src/views/recipe-view";
import "../src/views/recipe-view";
import { $, $$, apiError, makeRecipe, mockHass, mount, settle } from "./helpers";

function setup(options: { admin?: boolean } = {}) {
  return mockHass(
    {
      "cookbook/get": () => makeRecipe(),
      "cookbook/delete": () => null,
    },
    options,
  );
}

const view = (hass: unknown) =>
  mount<CookbookRecipeView>("cookbook-recipe-view", { hass, recipeId: "r1" });

describe("recipe view", () => {
  beforeEach(() => {
    localStorage.clear();
    history.replaceState(null, "", "/cookbook/recipe/r1");
  });
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders the recipe", async () => {
    const el = await view(setup().hass);
    expect($(el, "h1")!.textContent).toBe("Crème brûlée");
    const meta = $$(el, ".meta-item").map((item) =>
      `${item.querySelector(".label")!.textContent} ${item.querySelector(".label")!.nextElementSibling!.textContent!.replace(/\s+/g, " ").trim()}`,
    );
    expect(meta).toEqual(["Préparation 20 min", "Cuisson 40 min", "Total 1 h", "Pour 4 personnes"]);
    expect($$(el, ".ingredients .item-text").map((e) => e.textContent)).toEqual([
      "4 jaunes d'œufs",
      "50 cl de crème",
    ]);
    // Steps are numbered across sections.
    expect($$(el, ".steps h3").map((e) => e.textContent)).toEqual(["Appareil", "Cuisson"]);
    expect($$(el, ".steps .number").map((e) => e.textContent)).toEqual(["1", "2"]);
    expect($(el, "footer a")!.getAttribute("rel")).toBe("noopener noreferrer");
    expect($(el, ".updated")!.textContent).toContain("Modifiée par Nicolas le 2 novembre 2026");
  });

  it("shows the delete button to admins only", async () => {
    expect($(await view(setup().hass), ".delete")).toBeNull();
    document.body.innerHTML = "";
    expect($(await view(setup({ admin: true }).hass), ".delete")).not.toBeNull();
  });

  it("deletes after confirmation and goes back to the list", async () => {
    rememberListSearch("?q=creme");
    const { hass, callWS } = setup({ admin: true });
    const el = await view(hass);

    $<HTMLButtonElement>(el, ".delete")!.click();
    await settle(el);
    const dialog = $(el, "cookbook-confirm-dialog")!;
    expect(dialog.shadowRoot!.textContent).toContain("« Crème brûlée » sera définitivement supprimée.");

    dialog.shadowRoot!.querySelector<HTMLButtonElement>(".cancel")!.click();
    await settle(el);
    expect(callWS).not.toHaveBeenCalledWith(expect.objectContaining({ type: "cookbook/delete" }));

    $<HTMLButtonElement>(el, ".delete")!.click();
    await settle(el);
    dialog.shadowRoot!.querySelector<HTMLButtonElement>(".confirm")!.click();
    await settle(el);
    expect(callWS).toHaveBeenCalledWith({ type: "cookbook/delete", recipe_id: "r1" });
    expect(location.pathname + location.search).toBe("/cookbook?q=creme");
  });

  it("shows the photo on top", async () => {
    const { hass } = mockHass({
      "cookbook/get": () => makeRecipe({ image: "img", image_url: "/api/cookbook/images/img/large.webp?authSig=l" }),
    });
    const el = await view(hass);
    const hero = $<HTMLImageElement>(el, ".hero")!;
    expect(hero.getAttribute("src")).toContain("large.webp?authSig=l");
    expect(hero.alt).toBe("Crème brûlée");
    document.body.innerHTML = "";
    expect($(await view(setup().hass), ".hero")).toBeNull();
  });

  it("opens the editor", async () => {
    const el = await view(setup().hass);
    $<HTMLButtonElement>(el, ".edit")!.click();
    expect(location.pathname).toBe("/cookbook/edit/r1");
  });

  it("shows a not-found message", async () => {
    const { hass } = mockHass({ "cookbook/get": () => apiError("not_found") });
    const el = await view(hass);
    expect($(el, ".message")!.textContent).toContain("Cette recette n'existe pas");
  });

  it("keeps ticked items on the device", async () => {
    const el = await view(setup().hass);
    const box = $<HTMLInputElement>(el, ".ingredients input")!;
    box.click();
    await settle(el);
    expect($(el, ".ingredients label")!.classList.contains("done")).toBe(true);
    expect(JSON.parse(localStorage.getItem("cookbook:checks:r1")!)).toEqual(["i0"]);

    document.body.innerHTML = "";
    const again = await view(setup().hass);
    expect($<HTMLInputElement>(again, ".ingredients input")!.checked).toBe(true);

    $<HTMLButtonElement>(again, ".reset")!.click();
    await settle(again);
    expect(localStorage.getItem("cookbook:checks:r1")).toBeNull();
    expect($(again, ".reset")).toBeNull();
  });

  it("keeps a label on icon-only buttons and on edit", async () => {
    const el = await view(setup({ admin: true }).hass);
    const compact = $$<HTMLButtonElement>(el, ".actions .btn.compact");
    expect(compact.map((b) => b.title)).toEqual(["Texte agrandi", "Imprimer", "Supprimer"]);
    // The label stays in the button (accessible name), only hidden on touch screens.
    for (const button of compact) expect(button.querySelector(".label")!.textContent).toBe(button.title);
    expect($(el, ".actions .edit")!.classList.contains("compact")).toBe(false);
  });

  it("toggles larger text and remembers it", async () => {
    const el = await view(setup().hass);
    $<HTMLButtonElement>(el, ".actions .btn")!.click();
    await settle(el);
    expect(el.hasAttribute("large-text")).toBe(true);
    expect(localStorage.getItem("cookbook:large-text")).toBe("1");
  });

  it("keeps the screen on when supported", async () => {
    const release = vi.fn(async () => undefined);
    const request = vi.fn(async () => ({ release }));
    vi.stubGlobal("isSecureContext", true);
    Object.defineProperty(navigator, "wakeLock", { value: { request }, configurable: true });

    const el = await view(setup().hass);
    $<HTMLButtonElement>(el, ".awake")!.click();
    await settle(el);
    expect(request).toHaveBeenCalledWith("screen");

    el.remove();
    await Promise.resolve();
    expect(release).toHaveBeenCalled();
    delete (navigator as { wakeLock?: unknown }).wakeLock;
    vi.unstubAllGlobals();
  });

  it("hides the keep-awake button without Wake Lock support", async () => {
    const el = await view(setup().hass);
    expect($(el, ".awake")).toBeNull();
  });

  it("prints the recipe", async () => {
    const spy = vi.spyOn(print, "printRecipe").mockImplementation(() => undefined);
    const el = await view(setup().hass);
    $<HTMLButtonElement>(el, ".print")!.click();
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ id: "r1" }), expect.any(Function), "fr", 4);
  });

  it("adapts the quantities to the number of servings", async () => {
    const recipe = makeRecipe({
      ingredients: [
        { text: "200 g de farine", section: null },
        { text: "3 œufs", section: null },
        { text: "Sel", section: null },
      ],
    });
    const { hass } = mockHass({ "cookbook/get": () => recipe });
    const el = await view(hass);
    const texts = () => $$(el, ".ingredients .item-text").map((e) => e.textContent!.trim());
    expect($(el, ".reset-servings")).toBeNull();
    expect($(el, ".fewer")!.hasAttribute("disabled")).toBe(false);

    $<HTMLButtonElement>(el, ".more")!.click();
    $<HTMLButtonElement>(el, ".more")!.click();
    await settle(el);
    expect($(el, ".count")!.textContent).toBe("6 personnes");
    expect(texts()).toEqual(["300 g de farine", "4½ œufs", "Sel"]);
    expect($$(el, ".scaled").map((e) => e.textContent)).toEqual(["300", "4½"]);
    // Small reset icon next to the stepper; the notice is for screen readers only.
    expect($(el, ".reset-servings")!.getAttribute("aria-label")).toBe("Revenir à 4");
    const status = $(el, '[role="status"]')!;
    expect(status.classList.contains("visually-hidden")).toBe(true);
    expect(status.textContent).toContain("Quantités adaptées pour 6 personnes (recette pour 4)");
    expect(location.search).toBe("?parts=6");
    // Steps are never scaled.
    expect($$(el, ".steps .item-text").map((e) => e.textContent!.trim())).toEqual(["Mélanger", "Cuire"]);

    $<HTMLButtonElement>(el, ".reset-servings")!.click();
    await settle(el);
    expect(texts()).toEqual(["200 g de farine", "3 œufs", "Sel"]);
    expect($(el, ".scaled")).toBeNull();
    expect($(el, ".reset-servings")).toBeNull();
    expect(location.search).toBe("");
  });

  it("keeps the chosen number on reload and prints it", async () => {
    history.replaceState(null, "", "/cookbook/recipe/r1?parts=2");
    const spy = vi.spyOn(print, "printRecipe").mockImplementation(() => undefined);
    const el = await view(setup().hass);
    expect($(el, ".count")!.textContent).toBe("2 personnes");
    $<HTMLButtonElement>(el, ".print")!.click();
    expect(spy).toHaveBeenCalledWith(expect.anything(), expect.any(Function), "fr", 2);
  });

  it("ignores an invalid number in the URL", async () => {
    history.replaceState(null, "", "/cookbook/recipe/r1?parts=abc");
    const el = await view(setup().hass);
    expect($(el, ".count")!.textContent).toBe("4 personnes");
  });

  it("does not go below one", async () => {
    history.replaceState(null, "", "/cookbook/recipe/r1?parts=1");
    const el = await view(setup().hass);
    expect($(el, ".fewer")!.hasAttribute("disabled")).toBe(true);
  });

  it("has no stepper for a recipe without a number of servings", async () => {
    const { hass } = mockHass({ "cookbook/get": () => makeRecipe({ servings: null, servings_unit: "1 grand plat" }) });
    const el = await view(hass);
    expect($(el, ".stepper")).toBeNull();
    expect($(el, ".meta")!.textContent).toContain("1 grand plat");
  });
});
