import type { Localize, MessageKey } from "./i18n";

/** home-assistant-js-websocket error codes meaning "no usable connection" (ERR_CANNOT_CONNECT, ERR_CONNECTION_LOST). */
const CONNECTION_ERROR_CODES = new Set([1, 3]);

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

/**
 * Unwraps the error objects a WebSocket command can be rejected with:
 * `{code, message}` (command error) or `{type: "result", success: false, error: {code, message}}`
 * (commands pending when the socket closed).
 */
function wsError(error: unknown): { code?: unknown; message?: unknown } | null {
  if (!isObject(error)) return null;
  if (error.type === "result" && isObject(error.error)) return error.error;
  return "code" in error || "message" in error ? error : null;
}

/**
 * True when the call failed because the WebSocket was down: rejected while closing
 * (`{type: "result", error: {code: 3}}`) or sent while disconnected (plain `3`).
 */
export function isConnectionError(error: unknown): boolean {
  if (typeof error === "number") return CONNECTION_ERROR_CODES.has(error);
  const code = wsError(error)?.code;
  return typeof code === "number" && CONNECTION_ERROR_CODES.has(code);
}

function describe(error: unknown, t: Localize): string {
  if (isConnectionError(error)) return t("error_connection_lost");
  if (typeof error === "string") return error || t("error_unknown");
  // fetch() rejects with a TypeError ("Failed to fetch", "Load failed") when the network is down.
  if (error instanceof TypeError && /fetch|load failed|network/i.test(error.message)) return t("error_network");
  if (error instanceof Error) return error.message || error.name;
  if (typeof Response !== "undefined" && error instanceof Response) {
    return t("error_http", { status: error.status });
  }
  const ws = wsError(error);
  if (ws) {
    if (typeof ws.message === "string" && ws.message) return ws.message;
    // Photo upload/removal: HTTP error without a JSON body (see CookbookApi.imageRequest).
    const http = typeof ws.code === "string" ? /^http_(\d+)$/.exec(ws.code) : null;
    if (http) return t("error_http", { status: http[1] });
    if (ws.code !== undefined && ws.code !== null) return String(ws.code);
  }
  try {
    return JSON.stringify(error) ?? String(error);
  } catch {
    return String(error);
  }
}

/**
 * Localized message for any error (Error, HA WebSocket error, photo upload HTTP error, string…),
 * inserted in `key` ("Something went wrong: {message}" by default). The raw error goes to the console.
 */
export function formatError(error: unknown, t: Localize, key: MessageKey = "error"): string {
  console.error("[cookbook]", error);
  return t(key, { message: describe(error, t) });
}
