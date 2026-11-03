/** Panel sub-routes. HA passes the part after /cookbook as `route.path`. */
export type View =
  | { name: "list" }
  | { name: "recipe"; id: string }
  | { name: "new" }
  | { name: "edit"; id: string }
  | { name: "not-found" };

export const PANEL_PREFIX = "/cookbook";

export function parsePath(path: string): View {
  const parts = path.split("/").filter(Boolean).map(decodeURIComponent);
  if (parts.length === 0) return { name: "list" };
  if (parts.length === 1 && parts[0] === "new") return { name: "new" };
  if (parts.length === 2 && parts[0] === "recipe") return { name: "recipe", id: parts[1] };
  if (parts.length === 2 && parts[0] === "edit") return { name: "edit", id: parts[1] };
  return { name: "not-found" };
}

export function recipeUrl(id: string): string {
  return `${PANEL_PREFIX}/recipe/${encodeURIComponent(id)}`;
}

export function editUrl(id: string): string {
  return `${PANEL_PREFIX}/edit/${encodeURIComponent(id)}`;
}

export const NEW_URL = `${PANEL_PREFIX}/new`;

/** Navigate inside HA the same way the HA frontend does. */
export function navigate(url: string, options: { replace?: boolean } = {}): void {
  if (options.replace) {
    history.replaceState(history.state, "", url);
  } else {
    history.pushState(null, "", url);
  }
  window.dispatchEvent(
    new CustomEvent("location-changed", { detail: { replace: options.replace ?? false } }),
  );
}

// Last search/filter of the list ("?q=...&category=..."), restored by the back button.
let lastListSearch = "";

export function rememberListSearch(search: string): void {
  lastListSearch = search;
}

export function listUrl(): string {
  return `${PANEL_PREFIX}${lastListSearch}`;
}
