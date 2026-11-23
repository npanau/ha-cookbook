import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatError, isConnectionError } from "../src/errors";
import { getLocalize } from "../src/i18n";
import type { HomeAssistant } from "../src/types";
import { CONNECTION_LOST } from "./helpers";

const fr = getLocalize({ language: "fr", locale: { language: "fr" } } as HomeAssistant);
const en = getLocalize({ language: "en", locale: { language: "en" } } as HomeAssistant);

describe("isConnectionError", () => {
  it("recognizes the WebSocket connection errors", () => {
    expect(isConnectionError(CONNECTION_LOST)).toBe(true); // pending when the socket closed
    expect(isConnectionError(3)).toBe(true); // sent while disconnected
    expect(isConnectionError(1)).toBe(true); // cannot connect
    expect(isConnectionError({ code: 3, message: "Connection lost" })).toBe(true);
  });

  it("ignores other errors", () => {
    expect(isConnectionError({ code: "not_found", message: "Recipe not found" })).toBe(false);
    expect(isConnectionError(2)).toBe(false); // invalid auth
    expect(isConnectionError(new Error("boom"))).toBe(false);
    expect(isConnectionError(null)).toBe(false);
    expect(isConnectionError("3")).toBe(false);
  });
});

describe("formatError", () => {
  let consoleError: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
  });
  afterEach(() => {
    consoleError.mockRestore();
  });

  it.each([
    ["an Error", new Error("boom"), "Une erreur est survenue : boom"],
    ["a WebSocket error", { code: "not_loaded", message: "Cookbook is not set up" }, "Une erreur est survenue : Cookbook is not set up"],
    [
      "a lost connection",
      CONNECTION_LOST,
      "Une erreur est survenue : la connexion à Home Assistant a été perdue, réessayez une fois reconnecté",
    ],
    [
      "a call while disconnected",
      3,
      "Une erreur est survenue : la connexion à Home Assistant a été perdue, réessayez une fois reconnecté",
    ],
    ["a wrapped WebSocket error", { type: "result", success: false, error: { code: "x", message: "Wrapped" } }, "Une erreur est survenue : Wrapped"],
    ["an upload HTTP error without body", { code: "http_413", message: "" }, "Une erreur est survenue : le serveur a répondu avec l'erreur HTTP 413"],
    ["an upload error with a message", { code: "invalid_image", message: "Not an image" }, "Une erreur est survenue : Not an image"],
    ["an HTTP response", new Response(null, { status: 502 }), "Une erreur est survenue : le serveur a répondu avec l'erreur HTTP 502"],
    ["a network failure", new TypeError("Load failed"), "Une erreur est survenue : le réseau est injoignable, vérifiez la connexion"],
    ["a string", "Délai dépassé", "Une erreur est survenue : Délai dépassé"],
    ["an empty string", "", "Une erreur est survenue : erreur inconnue"],
    ["an error code alone", { code: "conflict" }, "Une erreur est survenue : conflict"],
    ["anything else", { reason: "odd" }, 'Une erreur est survenue : {"reason":"odd"}'],
    ["undefined", undefined, "Une erreur est survenue : undefined"],
  ])("describes %s", (_, error, expected) => {
    expect(formatError(error, fr)).toBe(expected);
  });

  it("falls back to String() when the value cannot be serialized", () => {
    expect(formatError(10n, fr)).toBe("Une erreur est survenue : 10");
  });

  it("translates", () => {
    expect(formatError(CONNECTION_LOST, en)).toBe(
      "Something went wrong: the connection to Home Assistant was lost, try again once reconnected",
    );
    expect(formatError({ code: "http_500", message: "" }, en)).toBe(
      "Something went wrong: the server answered with HTTP error 500",
    );
  });

  it("uses the given message", () => {
    expect(formatError({ code: "http_413", message: "" }, fr, "photo_failed")).toContain(
      "(le serveur a répondu avec l'erreur HTTP 413)",
    );
  });

  it("logs the complete error", () => {
    const error = { code: "not_loaded", message: "Cookbook is not set up", extra: 1 };
    formatError(error, fr);
    expect(consoleError).toHaveBeenCalledWith("[cookbook]", error);
  });
});
