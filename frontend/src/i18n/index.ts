import type { HomeAssistant } from "../types";
import en from "./en.json";
import fr from "./fr.json";

type Messages = typeof en;
export type MessageKey = keyof Messages;
export type Localize = (key: MessageKey, params?: Record<string, string | number>) => string;

export const LANGUAGES: Record<string, Messages> = { en, fr };

/** Base language of the HA user ("fr-FR" -> "fr"), "en" when unsupported. */
export function getLanguage(hass?: HomeAssistant): string {
  const lang = (hass?.locale?.language ?? hass?.language ?? "en").split("-")[0];
  return lang in LANGUAGES ? lang : "en";
}

/** Returns a translate function bound to the HA user's language (fallback: en). */
export function getLocalize(hass?: HomeAssistant): Localize {
  const messages = LANGUAGES[getLanguage(hass)];
  return (key, params = {}) =>
    Object.entries(params).reduce(
      (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
      messages[key] ?? en[key] ?? key,
    );
}
