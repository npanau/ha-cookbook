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
      `${item.querySelector(".label")!.textContent} ${item.querySelector(".label")!.nextElementSibling!.textContent}`,
    );
    expect(meta).toEqual(["Préparation 20 min", "Cuisson 40 min", "Total 1 h", "Parts 4 personnes"]);
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
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ id: "r1" }), expect.any(Function), "fr");
  });
});
