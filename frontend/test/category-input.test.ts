import { afterEach, describe, expect, it } from "vitest";
import type { CookbookCategoryInput } from "../src/components/category-input";
import "../src/components/category-input";
import { $, $$, mount, settle } from "./helpers";

async function input(value: string[] = [], suggestions: string[] = ["Dessert", "Plat"]) {
  const el = await mount<CookbookCategoryInput>("cookbook-category-input", { value, suggestions });
  const changes: string[][] = [];
  el.addEventListener("value-changed", (e) => changes.push((e as CustomEvent).detail.value));
  return { el, changes, field: $<HTMLInputElement>(el, "input")! };
}

const press = (field: HTMLInputElement, key: string) =>
  field.dispatchEvent(new KeyboardEvent("keydown", { key, cancelable: true }));

describe("category input", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("adds the typed category on Enter or comma", async () => {
    const { el, changes, field } = await input();
    field.value = "Été";
    press(field, "Enter");
    field.value = "Rapide";
    press(field, ",");
    await settle(el);
    expect(changes.at(-1)).toEqual(["Été", "Rapide"]);
    expect(field.value).toBe("");
    expect($$(el, ".chip").map((c) => c.textContent!.trim())).toEqual(["Été", "Rapide"]);
  });

  it("reuses the existing spelling and ignores duplicates", async () => {
    const { changes, field } = await input(["Plat"]);
    field.value = "dessért";
    press(field, "Enter");
    field.value = "PLAT";
    press(field, "Enter");
    expect(changes).toEqual([["Plat", "Dessert"]]);
  });

  it("adds on blur and removes with Backspace or the cross", async () => {
    const { el, changes, field } = await input(["Plat", "Dessert"]);
    field.value = "Hiver";
    field.dispatchEvent(new FocusEvent("blur"));
    expect(changes.at(-1)).toEqual(["Plat", "Dessert", "Hiver"]);

    press(field, "Backspace");
    expect(changes.at(-1)).toEqual(["Plat", "Dessert"]);

    await settle(el);
    $<HTMLButtonElement>(el, ".chip button")!.click();
    expect(changes.at(-1)).toEqual(["Dessert"]);
  });

  it("only suggests categories not already chosen", async () => {
    const { el, field } = await input(["Plat"]);
    field.dispatchEvent(new FocusEvent("focus"));
    await settle(el);
    expect($$(el, "[role=option]").map((o) => o.textContent!.trim())).toEqual(["Dessert"]);
  });

  it("opens the list on focus and filters it while typing, ignoring accents", async () => {
    const { el, field } = await input([], ["Dessert", "Plat principal", "Entrée", "Apéritif"]);
    const listbox = $<HTMLElement>(el, "[role=listbox]")!;
    expect(listbox.hidden).toBe(true);

    field.dispatchEvent(new FocusEvent("focus"));
    await settle(el);
    expect(listbox.hidden).toBe(false);
    expect(field.getAttribute("aria-expanded")).toBe("true");
    expect($$(el, "[role=option]")).toHaveLength(4);

    field.value = "pla";
    field.dispatchEvent(new InputEvent("input"));
    await settle(el);
    expect($$(el, "[role=option]").map((o) => o.textContent!.trim())).toEqual(["Plat principal"]);

    // Starts-with first, then contains; accents ignored.
    field.value = "e";
    field.dispatchEvent(new InputEvent("input"));
    await settle(el);
    expect($$(el, "[role=option]").map((o) => o.textContent!.trim())).toEqual([
      "Entrée",
      "Dessert",
      "Apéritif",
    ]);

    field.value = "zzz";
    field.dispatchEvent(new InputEvent("input"));
    await settle(el);
    expect(listbox.hidden).toBe(true);
  });

  it("picks a suggestion with the mouse without losing the focus", async () => {
    const { el, changes, field } = await input([], ["Dessert", "Plat principal"]);
    field.dispatchEvent(new FocusEvent("focus"));
    field.value = "pla";
    field.dispatchEvent(new InputEvent("input"));
    await settle(el);
    const option = $<HTMLElement>(el, "[role=option]")!;
    const mousedown = new MouseEvent("mousedown", { cancelable: true, bubbles: true });
    option.dispatchEvent(mousedown);
    expect(mousedown.defaultPrevented).toBe(true);
    option.click();
    await settle(el);
    expect(changes).toEqual([["Plat principal"]]);
    expect(field.value).toBe("");
    // Leaving the field afterwards keeps the chip and adds nothing.
    field.dispatchEvent(new FocusEvent("blur"));
    await settle(el);
    expect(changes).toEqual([["Plat principal"]]);
    expect($$(el, ".chip").map((c) => c.textContent!.trim())).toEqual(["Plat principal"]);
  });

  it("navigates with the arrows, Enter picks, Escape closes", async () => {
    const { el, changes, field } = await input([], ["Dessert", "Plat", "Entrée"]);
    field.dispatchEvent(new FocusEvent("focus"));
    await settle(el);
    press(field, "ArrowDown");
    press(field, "ArrowDown");
    await settle(el);
    expect(field.getAttribute("aria-activedescendant")).toBe("option-1");
    press(field, "Enter");
    expect(changes).toEqual([["Plat"]]);

    press(field, "ArrowUp");
    await settle(el);
    expect($<HTMLElement>(el, "[aria-selected=true]")!.textContent!.trim()).toBe("Entrée");
    press(field, "Escape");
    await settle(el);
    expect($<HTMLElement>(el, "[role=listbox]")!.hidden).toBe(true);
    // Closed: Enter adds the typed text, not the previously highlighted suggestion.
    field.value = "Hiver";
    press(field, "Enter");
    expect(changes.at(-1)).toEqual(["Plat", "Hiver"]);
  });
});
