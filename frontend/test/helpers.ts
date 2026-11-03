import { vi } from "vitest";
import type { HomeAssistant, Recipe } from "../src/types";

type Handler = (msg: Record<string, unknown>) => unknown;

/** Fake `hass`: callWS dispatches on the command type; a thrown/returned Error rejects. */
export function mockHass(
  handlers: Record<string, Handler>,
  options: { admin?: boolean; language?: string } = {},
) {
  const callWS = vi.fn(async (msg: Record<string, unknown>) => {
    const handler = handlers[msg.type as string];
    if (!handler) throw new Error(`unexpected command ${String(msg.type)}`);
    return handler(msg);
  });
  const hass = {
    user: { id: "u1", name: "Nicolas", is_admin: options.admin ?? false },
    language: options.language ?? "fr",
    locale: { language: options.language ?? "fr" },
    callWS,
  } as unknown as HomeAssistant;
  return { hass, callWS };
}

export function apiError(code: string, message = code) {
  return Promise.reject({ code, message });
}

export function makeRecipe(overrides: Partial<Recipe> = {}): Recipe {
  return {
    id: "r1",
    name: "Crème brûlée",
    description: "Un classique.",
    categories: ["Dessert"],
    prep_time: 20,
    cook_time: 40,
    total_time: null,
    servings: 4,
    servings_unit: "personnes",
    ingredients: [
      { text: "4 jaunes d'œufs", section: null },
      { text: "50 cl de crème", section: null },
    ],
    steps: [
      { text: "Mélanger", section: "Appareil" },
      { text: "Cuire", section: "Cuisson" },
    ],
    notes: null,
    image: null,
    source_url: "https://www.marmiton.org/recettes/creme-brulee.aspx",
    created_at: "2026-11-01T10:00:00+00:00",
    updated_at: "2026-11-02T10:00:00+00:00",
    created_by: "u1",
    updated_by: "u1",
    created_by_name: "Nicolas",
    updated_by_name: "Nicolas",
    ...overrides,
  };
}

/** Mounts a custom element and waits for its first render. */
export async function mount<T extends HTMLElement & { updateComplete: Promise<boolean> }>(
  tag: string,
  props: Record<string, unknown>,
): Promise<T> {
  const el = document.createElement(tag) as T;
  Object.assign(el, props);
  document.body.append(el);
  await settle(el);
  return el;
}

/** Lets pending promises resolve, then waits for Lit to re-render. */
export async function settle(el: { updateComplete: Promise<boolean> }) {
  for (let i = 0; i < 3; i++) {
    await Promise.resolve();
    await el.updateComplete;
  }
}

export const $ = <E extends Element = HTMLElement>(el: Element, selector: string) =>
  el.shadowRoot!.querySelector<E>(selector);
export const $$ = <E extends Element = HTMLElement>(el: Element, selector: string) => [
  ...el.shadowRoot!.querySelectorAll<E>(selector),
];
