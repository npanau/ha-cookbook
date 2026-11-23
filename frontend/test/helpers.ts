import { vi } from "vitest";
import type { HomeAssistant, Recipe } from "../src/types";

type Handler = (msg: Record<string, unknown>) => unknown;

/** Rejection of a WebSocket command pending when the socket closed (home-assistant-js-websocket). */
export const CONNECTION_LOST = { type: "result", success: false, error: { code: 3, message: "Connection lost" } };

/** Fake `hass.connection`: `drop()` / `restore()` fire "disconnected" / "ready" like the real one. */
export function mockConnection() {
  const listeners = new Map<string, Set<() => void>>();
  const fire = (event: string) => listeners.get(event)?.forEach((callback) => callback());
  const connection = {
    connected: true,
    addEventListener: vi.fn((event: string, callback: () => void) => {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event)!.add(callback);
    }),
    removeEventListener: vi.fn((event: string, callback: () => void) => listeners.get(event)?.delete(callback)),
    listenerCount: () => [...listeners.values()].reduce((sum, set) => sum + set.size, 0),
    drop() {
      connection.connected = false;
      fire("disconnected");
    },
    restore() {
      connection.connected = true;
      fire("ready");
    },
  };
  return connection;
}

/** Fake `hass`: callWS dispatches on the command type; a thrown/returned Error rejects. */
export function mockHass(
  handlers: Record<string, Handler>,
  options: {
    admin?: boolean;
    language?: string;
    /** Answers hass.fetchWithAuth (photo upload/removal). */
    fetch?: (path: string, init?: RequestInit) => Response | Promise<Response>;
  } = {},
) {
  const callWS = vi.fn(async (msg: Record<string, unknown>) => {
    const handler = handlers[msg.type as string];
    if (!handler) throw new Error(`unexpected command ${String(msg.type)}`);
    return handler(msg);
  });
  const fetchWithAuth = vi.fn(async (path: string, init?: RequestInit) => {
    if (!options.fetch) throw new Error(`unexpected fetch ${path}`);
    return options.fetch(path, init);
  });
  const hass = {
    fetchWithAuth,
    user: { id: "u1", name: "Nicolas", is_admin: options.admin ?? false },
    language: options.language ?? "fr",
    locale: { language: options.language ?? "fr" },
    connected: true,
    connection: mockConnection(),
    callWS,
  } as unknown as HomeAssistant;
  const connection = (hass as unknown as { connection: ReturnType<typeof mockConnection> }).connection;
  return { hass, callWS, fetchWithAuth, connection };
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
    image_url: null,
    thumbnail_url: null,
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
  // Enough turns for chained calls (save, then photo upload, then response parsing).
  for (let i = 0; i < 10; i++) {
    await Promise.resolve();
    await el.updateComplete;
  }
}

export const $ = <E extends Element = HTMLElement>(el: Element, selector: string) =>
  el.shadowRoot!.querySelector<E>(selector);
export const $$ = <E extends Element = HTMLElement>(el: Element, selector: string) => [
  ...el.shadowRoot!.querySelectorAll<E>(selector),
];
