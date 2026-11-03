import { afterEach, describe, expect, it } from "vitest";
import type { CookbookItemListEditor, ItemListLabels } from "../src/components/item-list-editor";
import "../src/components/item-list-editor";
import type { RecipeItem } from "../src/types";
import { $, $$, mount, settle } from "./helpers";

const labels: ItemListLabels = {
  itemPlaceholder: "item",
  sectionPlaceholder: "section",
  addItem: "add",
  addSection: "add section",
  moveUp: "up",
  moveDown: "down",
  remove: "remove",
  drag: "drag",
};

async function editor(items: RecipeItem[] = [], props: Record<string, unknown> = {}) {
  const el = await mount<CookbookItemListEditor>("cookbook-item-list-editor", { items, labels, ...props });
  const changes: RecipeItem[][] = [];
  el.addEventListener("items-changed", (e) => changes.push((e as CustomEvent).detail.items));
  return { el, changes };
}

const fields = (el: Element) => $$<HTMLInputElement>(el, "input, textarea");
const texts = (el: Element) => fields(el).map((f) => f.value);

function key(field: HTMLElement, key: string, options: KeyboardEventInit = {}) {
  field.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...options }));
}

function paste(field: HTMLElement, text: string) {
  const event = new Event("paste", { bubbles: true, cancelable: true }) as ClipboardEvent;
  Object.defineProperty(event, "clipboardData", { value: { getData: () => text } });
  field.dispatchEvent(event);
  return event;
}

describe("item list editor", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("starts with one empty line", async () => {
    const { el } = await editor();
    expect(texts(el)).toEqual([""]);
  });

  it("emits items while typing", async () => {
    const { el, changes } = await editor();
    const input = fields(el)[0];
    input.value = "200 g de farine";
    input.dispatchEvent(new Event("input"));
    expect(changes.at(-1)).toEqual([{ text: "200 g de farine", section: null }]);
  });

  it("adds a line on Enter and focuses it", async () => {
    const { el } = await editor([{ text: "farine", section: null }]);
    key(fields(el)[0], "Enter");
    await settle(el);
    expect(texts(el)).toEqual(["farine", ""]);
    expect(el.shadowRoot!.activeElement).toBe(fields(el)[1]);
  });

  it("removes an empty line on Backspace", async () => {
    const { el, changes } = await editor([{ text: "farine", section: null }]);
    key(fields(el)[0], "Enter");
    await settle(el);
    key(fields(el)[1], "Backspace");
    await settle(el);
    expect(texts(el)).toEqual(["farine"]);
    expect(changes.at(-1)).toEqual([{ text: "farine", section: null }]);
  });

  it("splits a multi-line paste into several lines", async () => {
    const { el, changes } = await editor([{ text: "sel", section: null }]);
    const event = paste(fields(el)[0], "- 200 g de farine\n- 2 œufs");
    await settle(el);
    expect(event.defaultPrevented).toBe(true);
    expect(texts(el)).toEqual(["sel 200 g de farine", "2 œufs"]);
    expect(changes.at(-1)).toHaveLength(2);
  });

  it("lets a single-line paste through", async () => {
    const { el } = await editor();
    expect(paste(fields(el)[0], "farine").defaultPrevented).toBe(false);
  });

  it("moves lines with the arrow buttons", async () => {
    const { el, changes } = await editor([
      { text: "a", section: null },
      { text: "b", section: null },
    ]);
    expect($<HTMLButtonElement>(el, ".up")!.disabled).toBe(true);
    $$<HTMLButtonElement>(el, ".up")[1].click();
    await settle(el);
    expect(texts(el)).toEqual(["b", "a"]);
    expect(changes.at(-1)!.map((i) => i.text)).toEqual(["b", "a"]);
  });

  it("adds sections that apply to the following lines", async () => {
    const { el, changes } = await editor([{ text: "sel", section: null }]);
    $<HTMLButtonElement>(el, ".add-section")!.click();
    await settle(el);
    const section = fields(el)[1];
    section.value = "Pâte";
    section.dispatchEvent(new Event("input"));
    key(section, "Enter");
    await settle(el);
    const item = fields(el)[2];
    item.value = "farine";
    item.dispatchEvent(new Event("input"));
    expect(changes.at(-1)).toEqual([
      { text: "sel", section: null },
      { text: "farine", section: "Pâte" },
    ]);
  });

  it("numbers steps and uses textareas when multiline", async () => {
    const { el } = await editor(
      [
        { text: "Mélanger", section: "Appareil" },
        { text: "Cuire", section: null },
      ],
      { multiline: true, numbered: true },
    );
    expect($$(el, ".number").map((n) => n.textContent)).toEqual(["1", "2"]);
    expect($$(el, "textarea")).toHaveLength(2);
  });

  it("does not rebuild its lines when the parent echoes its own items", async () => {
    const { el } = await editor();
    el.addEventListener("items-changed", (e) => (el.items = (e as CustomEvent).detail.items));
    const input = fields(el)[0];
    input.value = "x";
    input.dispatchEvent(new Event("input"));
    key(input, "Enter");
    await settle(el);
    // The new empty line survives (rebuilding from items would have dropped it).
    expect(texts(el)).toEqual(["x", ""]);
  });

  it("reloads its lines when the parent gives new items", async () => {
    const { el } = await editor([{ text: "a", section: null }]);
    el.items = [{ text: "z", section: null }];
    await settle(el);
    expect(texts(el)).toEqual(["z"]);
  });
});
