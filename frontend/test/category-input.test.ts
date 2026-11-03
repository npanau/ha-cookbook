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
    const { el } = await input(["Plat"]);
    expect($$<HTMLOptionElement>(el, "option").map((o) => o.value)).toEqual(["Dessert"]);
  });
});
