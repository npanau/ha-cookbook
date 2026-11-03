import { describe, expect, it } from "vitest";
import {
  formatCount,
  formatMetric,
  parseLeadingQuantity,
  parseNumber,
  scaleLine,
  scaledText,
} from "../src/quantity";

// The table validated with the users: a recipe for 4, displayed for 6.
const FOR_6 = 6 / 4;

describe("quantity scaling", () => {
  it.each([
    ["200 g de farine", "300 g de farine"],
    ["1,5 l de lait", "2,25 l de lait"],
    ["3 œufs", "4½ œufs"],
    ["½ citron", "¾ citron"],
    ["2 à 3 c. à soupe d'huile", "3 à 4½ c. à soupe d'huile"],
    ["1 boîte de 400 g de tomates", "1½ boîte de 400 g de tomates"],
    ["Sel, poivre", "Sel, poivre"],
    ["10 cl de crème", "15 cl de crème"],
  ])("%s → %s", (text, expected) => {
    expect(scaledText(text, FOR_6, "fr")).toBe(expected);
  });

  it("only scales digits and fractions, never quantities in words", () => {
    expect(scaledText("une pincée de sel", 2, "fr")).toBe("une pincée de sel");
    expect(scaledText("un filet d'huile d'olive", 2, "fr")).toBe("un filet d'huile d'olive");
  });

  it("leaves the text untouched when the factor is 1", () => {
    expect(scaledText("1.5 l de lait", 1, "fr")).toBe("1.5 l de lait");
  });

  it("understands the usual ways of writing numbers", () => {
    expect(parseNumber("200")).toBe(200);
    expect(parseNumber("1,5")).toBe(1.5);
    expect(parseNumber("1.5")).toBe(1.5);
    expect(parseNumber("1/2")).toBe(0.5);
    expect(parseNumber("1 1/2")).toBe(1.5);
    expect(parseNumber("1½")).toBe(1.5);
    expect(parseNumber("¾")).toBe(0.75);
  });

  it.each([
    ["1/2 litre de lait", 2, "1 litre de lait"],
    ["1 1/2 tasse de riz", 2, "3 tasse de riz"],
    ["200g de beurre", 2, "400g de beurre"],
    ["2-3 gousses d'ail", 2, "4-6 gousses d'ail"],
    ["4 ou 5 pommes", 2, "8 ou 10 pommes"],
    ["  2 oignons", 2, "  4 oignons"],
    ["4 oeufs", 0.5, "2 oeufs"],
    ["1 œuf", 1 / 3, "⅓ œuf"],
    ["250 g de sucre", 1.5, "375 g de sucre"],
    ["8 g de levure", 1.5, "12 g de levure"],
    ["25 cl de crème", 0.5, "12,5 cl de crème"],
    ["1 kg de pommes de terre", 1 / 3, "0,3 kg de pommes de terre"],
    ["6 tranches de jambon", 2.5, "15 tranches de jambon"],
  ])("%s ×%d → %s", (text, factor, expected) => {
    expect(scaledText(text, factor, "fr")).toBe(expected);
  });

  it("uses the language decimal separator", () => {
    expect(scaledText("1,5 l de lait", FOR_6, "en")).toBe("2.25 l de lait");
  });

  it("does not treat words starting like a unit as metric", () => {
    expect(parseLeadingQuantity("2 limes")!.metric).toBe(false);
    expect(parseLeadingQuantity("2 l d'eau")!.metric).toBe(true);
    expect(parseLeadingQuantity("2 gousses d'ail")!.metric).toBe(false);
    expect(parseLeadingQuantity("500 grammes de farine")!.metric).toBe(true);
  });

  it("ignores lines without a leading quantity", () => {
    expect(parseLeadingQuantity("Sel")).toBeNull();
    expect(parseLeadingQuantity("Farine : 200 g")).toBeNull();
    expect(parseLeadingQuantity("0 g de sucre")).toBeNull();
  });

  it("formats counted quantities with fractions", () => {
    expect(formatCount(0.1)).toBe("¼");
    expect(formatCount(0.5)).toBe("½");
    expect(formatCount(1.3)).toBe("1⅓");
    expect(formatCount(2.9)).toBe("3");
    expect(formatCount(4)).toBe("4");
    expect(formatCount(12.4)).toBe("12");
  });

  it("formats metric quantities with a sensible precision", () => {
    expect(formatMetric(333.3, "fr")).toBe("335");
    expect(formatMetric(37.4, "fr")).toBe("37,5");
    expect(formatMetric(2.25, "fr")).toBe("2,25");
    expect(formatMetric(1.33, "fr")).toBe("1,3");
    expect(formatMetric(3, "fr")).toBe("3");
  });

  it("returns the scaled quantity separately, to highlight it", () => {
    expect(scaleLine("200 g de farine", 2, "fr")).toEqual({ indent: "", quantity: "400", rest: " g de farine" });
    expect(scaleLine("Sel", 2, "fr")).toBeNull();
  });
});
