import { afterEach, describe, expect, it } from "vitest";
import { type CookbookPhotoInput, MAX_PHOTO_BYTES, type PhotoLabels } from "../src/components/photo-input";
import "../src/components/photo-input";
import { $, mount, settle } from "./helpers";

const labels: PhotoLabels = {
  add: "Ajouter une photo",
  replace: "Remplacer",
  remove: "Retirer",
  dropHint: "ou déposez",
  invalid: "Formats acceptés : JPEG, PNG, WebP.",
  tooLarge: "La photo dépasse 15 Mo.",
};

async function photo(src: string | null = null) {
  const el = await mount<CookbookPhotoInput>("cookbook-photo-input", { src, labels });
  const changes: (File | null)[] = [];
  el.addEventListener("photo-changed", (e) => changes.push((e as CustomEvent).detail.file));
  return { el, changes };
}

const file = (type = "image/jpeg", size = 1000) =>
  new File([new Uint8Array(size)], "photo", { type });

describe("photo input", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("offers to add a photo when there is none", async () => {
    const { el } = await photo();
    expect($(el, ".empty")!.textContent).toContain("Ajouter une photo");
    expect($(el, ".replace")).toBeNull();
    expect($<HTMLInputElement>(el, "input[type=file]")!.accept).toBe("image/jpeg,image/png,image/webp");
  });

  it("emits a valid file", async () => {
    const { el, changes } = await photo();
    const chosen = file("image/png");
    el.choose(chosen);
    expect(changes).toEqual([chosen]);
  });

  it("refuses other formats and too large files", async () => {
    const { el, changes } = await photo();
    el.choose(file("image/gif"));
    await settle(el);
    expect($(el, ".error")!.textContent).toBe("Formats acceptés : JPEG, PNG, WebP.");
    el.choose(file("image/jpeg", MAX_PHOTO_BYTES + 1));
    await settle(el);
    expect($(el, ".error")!.textContent).toBe("La photo dépasse 15 Mo.");
    expect(changes).toEqual([]);
  });

  it("previews, replaces and removes", async () => {
    const { el, changes } = await photo("/api/cookbook/images/abc/large.webp?authSig=x");
    expect($<HTMLImageElement>(el, ".preview")!.getAttribute("src")).toContain("authSig=x");
    $<HTMLButtonElement>(el, ".remove")!.click();
    expect(changes).toEqual([null]);
    expect($(el, ".replace")).not.toBeNull();
  });

  it("accepts a dropped image", async () => {
    const { el, changes } = await photo();
    const dropped = file("image/webp");
    const event = new Event("drop", { cancelable: true }) as DragEvent;
    Object.defineProperty(event, "dataTransfer", { value: { files: [dropped] } });
    $(el, ".zone")!.dispatchEvent(event);
    expect(changes).toEqual([dropped]);
    expect(event.defaultPrevented).toBe(true);
  });
});
