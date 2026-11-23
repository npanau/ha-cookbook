import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { REFRESH_AFTER_MS } from "../src/connection";
import type { HomeAssistant, RecipeSummary } from "../src/types";
import type { CookbookRecipeEditor } from "../src/views/recipe-editor";
import type { CookbookRecipeList } from "../src/views/recipe-list";
import type { CookbookRecipeView } from "../src/views/recipe-view";
import "../src/views/recipe-editor";
import "../src/views/recipe-list";
import "../src/views/recipe-view";
import { $, $$, CONNECTION_LOST, apiError, makeRecipe, mockHass, mount, settle } from "./helpers";

/** Answers each call with the next value; a function is called (to reject). */
function sequence(...answers: unknown[]) {
  return () => {
    const answer = answers.length > 1 ? answers.shift() : answers[0];
    return typeof answer === "function" ? answer() : answer;
  };
}
const lost = () => Promise.reject(CONNECTION_LOST);

const view = (hass: HomeAssistant) =>
  mount<CookbookRecipeView>("cookbook-recipe-view", { hass, recipeId: "r1" });
const getCalls = (callWS: ReturnType<typeof mockHass>["callWS"]) =>
  callWS.mock.calls.filter(([msg]) => msg.type === "cookbook/get").length;

describe("reconnection", () => {
  let consoleError: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    localStorage.clear();
    history.replaceState(null, "", "/cookbook/recipe/r1");
    consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
  });
  afterEach(() => {
    document.body.innerHTML = "";
    consoleError.mockRestore();
    vi.useRealTimers();
  });

  describe("recipe view", () => {
    it("waits for the connection instead of showing the error, then reloads", async () => {
      const { hass, connection } = mockHass({ "cookbook/get": sequence(lost, makeRecipe()) });
      connection.connected = false;
      const el = await view(hass);
      expect($(el, ".error")).toBeNull();
      expect($(el, ".message")!.textContent).toBe("Chargement…");

      connection.restore();
      await settle(el);
      expect($(el, "h1")!.textContent).toBe("Crème brûlée");
    });

    it("retries at once if the connection is already back", async () => {
      const { hass, callWS } = mockHass({ "cookbook/get": sequence(lost, makeRecipe()) });
      const el = await view(hass);
      expect(getCalls(callWS)).toBe(2);
      expect($(el, "h1")!.textContent).toBe("Crème brûlée");
    });

    it("shows an error if the reload fails again", async () => {
      const { hass, connection } = mockHass({
        "cookbook/get": sequence(lost, () => apiError("not_loaded", "Cookbook is not set up")),
      });
      connection.connected = false;
      const el = await view(hass);
      connection.restore();
      await settle(el);
      expect($(el, ".error")!.textContent).toBe("Une erreur est survenue : Cookbook is not set up");
    });

    it("reloads silently after a disconnection, keeping the ticks and the recipe on screen", async () => {
      let resolveReload!: (recipe: unknown) => void;
      const { hass, callWS, connection } = mockHass({
        "cookbook/get": sequence(
          makeRecipe({ image_url: "/img/r1.webp?authSig=old" }),
          () => new Promise((resolve) => (resolveReload = resolve)),
        ),
      });
      const el = await view(hass);
      $<HTMLInputElement>(el, ".ingredients input")!.click();
      await settle(el);

      connection.drop();
      connection.restore();
      await settle(el);
      expect(getCalls(callWS)).toBe(2);
      expect($(el, "h1")!.textContent).toBe("Crème brûlée"); // no "loading" flash

      resolveReload(makeRecipe({ name: "Crème brûlée maison", image_url: "/img/r1.webp?authSig=new" }));
      await settle(el);
      expect($(el, "h1")!.textContent).toBe("Crème brûlée maison");
      expect($<HTMLImageElement>(el, "img.hero")!.getAttribute("src")).toBe("/img/r1.webp?authSig=new");
      expect($<HTMLInputElement>(el, ".ingredients input")!.checked).toBe(true);
    });

    it("also notices the disconnection through hass.connected", async () => {
      const { hass, callWS } = mockHass({ "cookbook/get": () => makeRecipe() });
      const el = await view(hass);
      el.hass = { ...hass, connected: false } as HomeAssistant;
      await settle(el);
      el.hass = { ...hass, connected: true } as HomeAssistant;
      await settle(el);
      expect(getCalls(callWS)).toBe(2);
    });

    it("does not reload on ordinary hass updates", async () => {
      const { hass, callWS, connection } = mockHass({ "cookbook/get": () => makeRecipe() });
      const el = await view(hass);
      for (let i = 0; i < 3; i++) {
        el.hass = { ...hass } as HomeAssistant;
        await settle(el);
      }
      connection.restore(); // "ready" without a disconnection
      await settle(el);
      expect(getCalls(callWS)).toBe(1);
    });

    it("keeps the recipe when a silent reload fails", async () => {
      const { hass, connection } = mockHass({
        "cookbook/get": sequence(makeRecipe(), () => apiError("not_loaded", "Cookbook is not set up")),
      });
      const el = await view(hass);
      connection.drop();
      connection.restore();
      await settle(el);
      expect($(el, ".error")).toBeNull();
      expect($(el, "h1")!.textContent).toBe("Crème brûlée");
    });

    it("refreshes the signed image URLs before they expire", async () => {
      vi.useFakeTimers({ toFake: ["setInterval", "clearInterval", "Date"] });
      const { hass, callWS } = mockHass({
        "cookbook/get": sequence(
          makeRecipe({ image_url: "/img/r1.webp?authSig=old" }),
          makeRecipe({ image_url: "/img/r1.webp?authSig=new" }),
        ),
      });
      const el = await view(hass);
      vi.advanceTimersByTime(REFRESH_AFTER_MS - 60_000);
      expect(getCalls(callWS)).toBe(1);

      vi.advanceTimersByTime(60_000);
      await settle(el);
      expect(getCalls(callWS)).toBe(2);
      expect($<HTMLImageElement>(el, "img.hero")!.getAttribute("src")).toBe("/img/r1.webp?authSig=new");
    });

    it("stops listening once removed", async () => {
      const { hass, connection } = mockHass({ "cookbook/get": () => makeRecipe() });
      const el = await view(hass);
      expect(connection.listenerCount()).toBe(2);
      el.remove();
      expect(connection.listenerCount()).toBe(0);
    });
  });

  describe("recipe list", () => {
    const summary: RecipeSummary = { ...makeRecipe(), matched_ingredients: undefined };

    it("waits for the connection, then loads", async () => {
      history.replaceState(null, "", "/cookbook");
      const { hass, connection } = mockHass({
        "cookbook/list": sequence(lost, { recipes: [summary] }),
        "cookbook/categories": sequence(lost, { categories: [{ name: "Dessert", count: 1 }] }),
      });
      connection.connected = false;
      const el = await mount<CookbookRecipeList>("cookbook-recipe-list", { hass });
      expect($(el, ".error")).toBeNull();

      connection.restore();
      await settle(el);
      expect($$(el, ".recipe h3").map((h) => h.textContent)).toEqual(["Crème brûlée"]);
    });
  });

  describe("recipe editor", () => {
    it("retries a load that failed, then never reloads the form", async () => {
      history.replaceState(null, "", "/cookbook/edit/r1");
      const { hass, callWS, connection } = mockHass({
        "cookbook/get": sequence(lost, makeRecipe()),
        "cookbook/categories": () => ({ categories: [] }),
      });
      connection.connected = false;
      const el = await mount<CookbookRecipeEditor>("cookbook-recipe-editor", { hass, recipeId: "r1" });
      expect($(el, ".message")!.textContent).toBe("Chargement…");

      connection.restore();
      await settle(el);
      const name = $<HTMLInputElement>(el, "input[name='name']")!;
      expect(name.value).toBe("Crème brûlée");

      // Edited, then disconnected: the form is not overwritten.
      name.value = "Crème brûlée revisitée";
      name.dispatchEvent(new Event("input"));
      connection.drop();
      connection.restore();
      await settle(el);
      expect(getCalls(callWS)).toBe(2);
      expect($<HTMLInputElement>(el, "input[name='name']")!.value).toBe("Crème brûlée revisitée");
    });

    it("explains a save that failed because the connection was lost", async () => {
      history.replaceState(null, "", "/cookbook/edit/r1");
      const { hass } = mockHass({
        "cookbook/get": () => makeRecipe(),
        "cookbook/update": lost,
        "cookbook/categories": () => ({ categories: [] }),
      });
      const el = await mount<CookbookRecipeEditor>("cookbook-recipe-editor", { hass, recipeId: "r1" });
      await el.save();
      await settle(el);
      expect($(el, ".banner.error")!.textContent).toBe(
        "Une erreur est survenue : la connexion à Home Assistant a été perdue, réessayez une fois reconnecté",
      );
    });
  });
});
