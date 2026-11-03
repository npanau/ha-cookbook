import { describe, expect, it } from "vitest";
import { fold, highlight } from "../src/text";

const marked = (text: string, query: string) =>
  highlight(text, query)
    .filter((s) => s.match)
    .map((s) => s.text);

describe("text", () => {
  it("folds like the backend", () => {
    expect(fold("Œufs BRÛLÉS")).toBe("oeufs brules");
    expect(fold("Dessért")).toBe("dessert");
  });

  it("highlights words regardless of accents and ligatures", () => {
    expect(marked("6 jaunes d'œufs", "oeuf")).toEqual(["œuf"]);
    expect(marked("50 cl de crème", "CREME")).toEqual(["crème"]);
    expect(marked("Œufs", "œufs")).toEqual(["Œufs"]);
  });

  it("highlights every word and every occurrence", () => {
    expect(marked("sel, poivre, sel", "sel poivre")).toEqual(["sel", "poivre", "sel"]);
  });

  it("keeps the whole text in order", () => {
    const segments = highlight("2 œufs battus", "oeufs");
    expect(segments.map((s) => s.text).join("")).toBe("2 œufs battus");
    expect(segments).toEqual([
      { text: "2 ", match: false },
      { text: "œufs", match: true },
      { text: " battus", match: false },
    ]);
  });

  it("returns the text unchanged without query", () => {
    expect(highlight("farine", "  ")).toEqual([{ text: "farine", match: false }]);
  });
});
