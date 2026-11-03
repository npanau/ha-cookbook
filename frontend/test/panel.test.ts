import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/cookbook-panel";
import { $, mockHass, mount } from "./helpers";

const hass = mockHass({
  "cookbook/list": () => ({ recipes: [] }),
  "cookbook/categories": () => ({ categories: [] }),
  "cookbook/get": () => new Promise(() => undefined),
}).hass;

const panel = (path: string, narrow = false) =>
  mount("cookbook-panel", { hass, narrow, route: { prefix: "/cookbook", path } });

describe("panel", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("shows the list at the root, without back button", async () => {
    const el = await panel("");
    expect($(el, "cookbook-recipe-list")).not.toBeNull();
    expect($(el, ".back")).toBeNull();
    expect($(el, ".title")!.textContent).toBe("Cookbook");
  });

  it("shows a recipe with a back button", async () => {
    const el = await panel("/recipe/r1");
    const view = $(el, "cookbook-recipe-view") as HTMLElement & { recipeId: string };
    expect(view.recipeId).toBe("r1");
    expect($(el, ".back")).not.toBeNull();
  });

  it("shows the sidebar menu button on narrow screens", async () => {
    expect($(await panel("", true), "ha-menu-button")).not.toBeNull();
    expect($(await panel(""), "ha-menu-button")).toBeNull();
  });

  it("shows the editor for new and edit routes", async () => {
    expect($(await panel("/new"), "cookbook-recipe-editor")).not.toBeNull();
    const el = await panel("/edit/r1");
    const editor = $(el, "cookbook-recipe-editor") as HTMLElement & { recipeId: string };
    expect(editor.recipeId).toBe("r1");
  });

  it("lets the editor guard the back arrow", async () => {
    const el = await panel("/edit/r1");
    const editor = $(el, "cookbook-recipe-editor") as HTMLElement & { requestLeave(url: string): void };
    const spy = vi.spyOn(editor, "requestLeave").mockImplementation(() => undefined);
    $<HTMLButtonElement>(el, ".back")!.click();
    expect(spy).toHaveBeenCalledWith("/cookbook/recipe/r1");
  });

  it("shows the import view, which guards the back arrow too", async () => {
    const el = await panel("/import");
    const view = $(el, "cookbook-recipe-import") as HTMLElement & { requestLeave(url: string): void };
    const spy = vi.spyOn(view, "requestLeave").mockImplementation(() => undefined);
    $<HTMLButtonElement>(el, ".back")!.click();
    expect(spy).toHaveBeenCalledWith("/cookbook");
  });

  it("handles unknown routes", async () => {
    const el = await panel("/nope");
    expect($(el, ".message")!.textContent).toContain("Page introuvable");
  });
});
