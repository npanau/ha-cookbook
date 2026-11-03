import { describe, expect, it } from "vitest";
import en from "../src/i18n/en.json";
import fr from "../src/i18n/fr.json";
import { getLanguage, getLocalize } from "../src/i18n";
import type { HomeAssistant } from "../src/types";

const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
const hass = (language: string) => ({ language, locale: { language } }) as HomeAssistant;

describe("i18n", () => {
  it("has the same keys in every language", () => {
    expect(Object.keys(fr).sort()).toEqual(Object.keys(en).sort());
  });

  it("has the same placeholders in every language", () => {
    for (const key of Object.keys(en) as (keyof typeof en)[]) {
      expect(placeholders(fr[key]), key).toEqual(placeholders(en[key]));
    }
  });

  it("picks the user language and falls back to English", () => {
    expect(getLanguage(hass("fr-FR"))).toBe("fr");
    expect(getLanguage(hass("de"))).toBe("en");
    expect(getLanguage(undefined)).toBe("en");
  });

  it("replaces parameters", () => {
    expect(getLocalize(hass("fr"))("updated_by", { name: "Nico", date: "2 nov." })).toBe(
      "Modifiée par Nico le 2 nov.",
    );
    expect(getLocalize(hass("en"))("delete")).toBe("Delete");
  });
});
