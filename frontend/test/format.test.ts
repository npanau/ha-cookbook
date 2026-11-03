import { describe, expect, it } from "vitest";
import { formatDuration, groupBySection, totalTime } from "../src/format";
import { getLocalize } from "../src/i18n";
import { makeRecipe } from "./helpers";

const t = getLocalize(undefined);

describe("format", () => {
  it("formats durations", () => {
    expect(formatDuration(null, t)).toBe("");
    expect(formatDuration(0, t)).toBe("0 min");
    expect(formatDuration(45, t)).toBe("45 min");
    expect(formatDuration(60, t)).toBe("1 h");
    expect(formatDuration(135, t)).toBe("2 h 15 min");
  });

  it("uses the entered total, or prep + cook", () => {
    expect(totalTime(makeRecipe({ total_time: 90 }))).toBe(90);
    expect(totalTime(makeRecipe({ prep_time: 20, cook_time: 40 }))).toBe(60);
    expect(totalTime(makeRecipe({ prep_time: 10, cook_time: null }))).toBe(10);
    expect(totalTime(makeRecipe({ prep_time: null, cook_time: null }))).toBeNull();
  });

  it("groups consecutive items by section", () => {
    const groups = groupBySection([
      { text: "a", section: null },
      { text: "b", section: "Pâte" },
      { text: "c", section: "Pâte" },
      { text: "d", section: null },
    ]);
    expect(groups.map((g) => [g.section, g.items.map((i) => i.text)])).toEqual([
      [null, ["a"]],
      ["Pâte", ["b", "c"]],
      [null, ["d"]],
    ]);
  });
});
