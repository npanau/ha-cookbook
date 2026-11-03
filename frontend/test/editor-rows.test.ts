import { describe, expect, it } from "vitest";
import { itemsToRows, moveRow, newRow, rowsToItems, splitPastedLines } from "../src/editor-rows";
import type { RecipeItem } from "../src/types";

const items: RecipeItem[] = [
  { text: "sel", section: null },
  { text: "farine", section: "Pâte" },
  { text: "beurre", section: "Pâte" },
  { text: "pommes", section: "Garniture" },
  { text: "sucre glace", section: null },
];

describe("editor rows", () => {
  it("round-trips items through rows, sections included", () => {
    const rows = itemsToRows(items);
    expect(rows.map((r) => [r.kind, r.text])).toEqual([
      ["item", "sel"],
      ["section", "Pâte"],
      ["item", "farine"],
      ["item", "beurre"],
      ["section", "Garniture"],
      ["item", "pommes"],
      ["section", ""], // back to "no section"
      ["item", "sucre glace"],
    ]);
    expect(rowsToItems(rows)).toEqual(items);
  });

  it("drops empty items and trims texts", () => {
    const rows = [newRow("section", "  Pâte "), newRow("item", " farine "), newRow("item", "   ")];
    expect(rowsToItems(rows)).toEqual([{ text: "farine", section: "Pâte" }]);
  });

  it("moves rows", () => {
    const rows = itemsToRows(items.slice(0, 1).concat({ text: "poivre", section: null }));
    expect(moveRow(rows, 1, 0).map((r) => r.text)).toEqual(["poivre", "sel"]);
    expect(moveRow(rows, 0, 5)).toBe(rows);
  });

  it("splits pasted lists without their markers", () => {
    expect(splitPastedLines("- 200 g de farine\r\n• 2 œufs\n\n1. 10 cl de lait\n2) sel\n* poivre")).toEqual([
      "200 g de farine",
      "2 œufs",
      "10 cl de lait",
      "sel",
      "poivre",
    ]);
    // Quantities at the start of a line are not list numbers.
    expect(splitPastedLines("2 œufs\n100 g de sucre")).toEqual(["2 œufs", "100 g de sucre"]);
  });
});
