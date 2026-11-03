/** Minimal subset of the Home Assistant frontend `hass` object we rely on. */
export interface HomeAssistant {
  user?: { id: string; name: string; is_admin: boolean };
  language: string;
  locale?: { language: string };
}
