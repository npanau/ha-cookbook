import { describe, expect, it } from "vitest";
import { getLocalize } from "../src/i18n";
import { buildPrintHtml } from "../src/print";
import type { HomeAssistant } from "../src/types";
import { makeRecipe } from "./helpers";

const t = getLocalize({ language: "fr" } as HomeAssistant);

describe("print", () => {
  it("renders the recipe with sections and numbered steps", () => {
    const html = buildPrintHtml(makeRecipe(), t, "fr");
    expect(html).toContain("<h1>Crème brûlée</h1>");
    expect(html).toContain("<strong>Total</strong> 1 h");
    expect(html).toContain("<h2>Ingrédients</h2><ul><li>4 jaunes d&#39;œufs</li>");
    expect(html).toContain("<h3>Appareil</h3><ol><li>Mélanger</li></ol><h3>Cuisson</h3>");
    expect(html).toContain("https://www.marmiton.org/recettes/creme-brulee.aspx");
    expect(html).not.toContain("<h2>Notes</h2>");
  });

  it("escapes user content", () => {
    const html = buildPrintHtml(makeRecipe({ name: '<script>alert("x")</script>' }), t, "fr");
    expect(html).not.toContain("<script>");
    expect(html).toContain("&#60;script&#62;");
  });
});
