import { describe, expect, it, vi } from "vitest";
import { listUrl, navigate, parsePath, recipeUrl, rememberListSearch } from "../src/router";

describe("router", () => {
  it("parses panel paths", () => {
    expect(parsePath("")).toEqual({ name: "list" });
    expect(parsePath("/")).toEqual({ name: "list" });
    expect(parsePath("/recipe/abc")).toEqual({ name: "recipe", id: "abc" });
    expect(parsePath("/recipe")).toEqual({ name: "not-found" });
    expect(parsePath("/unknown/x/y")).toEqual({ name: "not-found" });
  });

  it("builds recipe URLs", () => {
    expect(recipeUrl("a/b")).toBe("/cookbook/recipe/a%2Fb");
    expect(parsePath("/recipe/a%2Fb")).toEqual({ name: "recipe", id: "a/b" });
  });

  it("navigates like the HA frontend", () => {
    const listener = vi.fn();
    window.addEventListener("location-changed", listener);
    navigate("/cookbook/recipe/x");
    expect(location.pathname).toBe("/cookbook/recipe/x");
    expect(listener).toHaveBeenCalledOnce();
    window.removeEventListener("location-changed", listener);
  });

  it("remembers the list search for the back button", () => {
    rememberListSearch("?q=tarte");
    expect(listUrl()).toBe("/cookbook?q=tarte");
    rememberListSearch("");
    expect(listUrl()).toBe("/cookbook");
  });
});
