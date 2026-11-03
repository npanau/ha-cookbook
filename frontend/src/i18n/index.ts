import type { HomeAssistant } from "../types";
import en from "./en.json";
import fr from "./fr.json";

type Messages = typeof en;
export type MessageKey = keyof Messages;

const LANGUAGES: Record<string, Messages> = { en, fr };

/** Returns a translate function bound to the HA user's language (fallback: en). */
export function getLocalize(hass?: HomeAssistant) {
  const lang = (hass?.locale?.language ?? hass?.language ?? "en").split("-")[0];
  const messages = LANGUAGES[lang] ?? en;
  return (key: MessageKey, params: Record<string, string> = {}): string =>
    Object.entries(params).reduce(
      (text, [name, value]) => text.replaceAll(`{${name}}`, value),
      messages[key] ?? en[key] ?? key,
    );
}
