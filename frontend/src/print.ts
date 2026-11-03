import { formatDuration, formatServings, groupBySection, totalTime } from "./format";
import type { Localize } from "./i18n";
import { scaledText } from "./quantity";
import type { Recipe, RecipeItem } from "./types";

const escape = (text: string): string =>
  text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function items(list: RecipeItem[], tag: "ul" | "ol", text: (item: RecipeItem) => string): string {
  return groupBySection(list)
    .map(
      (group) =>
        `${group.section ? `<h3>${escape(group.section)}</h3>` : ""}<${tag}>${group.items
          .map((item) => `<li>${escape(text(item))}</li>`)
          .join("")}</${tag}>`,
    )
    .join("");
}

/**
 * Standalone HTML document of a recipe, with its own print stylesheet.
 * `servings`: number of people to print the quantities for (default: the recipe's).
 */
export function buildPrintHtml(recipe: Recipe, t: Localize, language: string, servings = recipe.servings): string {
  const factor = recipe.servings && servings ? servings / recipe.servings : 1;
  const ingredient = (item: RecipeItem) => scaledText(item.text, factor, language);
  const meta = [
    ["prep_time", formatDuration(recipe.prep_time, t)],
    ["cook_time", formatDuration(recipe.cook_time, t)],
    ["total_time", formatDuration(totalTime(recipe), t)],
    ["servings", formatServings(servings, recipe.servings_unit)],
  ] as const;
  const metaHtml = meta
    .filter(([, value]) => value)
    .map(([key, value]) => `<span><strong>${escape(t(key))}</strong> ${escape(value)}</span>`)
    .join("");
  const section = (title: string, body: string) =>
    body ? `<section><h2>${escape(title)}</h2>${body}</section>` : "";
  const paragraph = (text: string | null) => (text ? `<p class="text">${escape(text)}</p>` : "");

  return `<!doctype html>
<html lang="${escape(language)}">
<head>
<meta charset="utf-8">
<title>${escape(recipe.name)}</title>
<style>
  @page { margin: 15mm; }
  body { font-family: Georgia, "Times New Roman", serif; font-size: 11pt; line-height: 1.45; color: #000; }
  h1 { font-size: 22pt; margin: 0 0 4pt; }
  h2 { font-size: 14pt; margin: 14pt 0 6pt; border-bottom: 1px solid #999; }
  h3 { font-size: 11pt; margin: 8pt 0 4pt; font-style: italic; }
  .meta { display: flex; flex-wrap: wrap; gap: 4pt 16pt; margin: 6pt 0; }
  .categories { color: #555; }
  .text { white-space: pre-line; }
  ol li { margin-bottom: 5pt; }
  section, li { break-inside: avoid; }
  h2, h3 { break-after: avoid; }
  .source { font-size: 9pt; color: #555; word-break: break-all; }
</style>
</head>
<body>
<h1>${escape(recipe.name)}</h1>
${recipe.categories.length ? `<div class="categories">${escape(recipe.categories.join(" · "))}</div>` : ""}
${metaHtml ? `<div class="meta">${metaHtml}</div>` : ""}
${paragraph(recipe.description)}
${section(t("ingredients"), recipe.ingredients.length ? items(recipe.ingredients, "ul", ingredient) : "")}
${section(t("steps"), recipe.steps.length ? items(recipe.steps, "ol", (item) => item.text) : "")}
${section(t("notes"), paragraph(recipe.notes))}
${recipe.source_url ? `<p class="source">${escape(recipe.source_url)}</p>` : ""}
</body>
</html>`;
}

/** Prints the recipe alone (not the HA sidebar) through a hidden iframe. */
export function printRecipe(recipe: Recipe, t: Localize, language: string, servings = recipe.servings): void {
  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;width:0;height:0;border:0;visibility:hidden";
  iframe.srcdoc = buildPrintHtml(recipe, t, language, servings);
  iframe.addEventListener("load", () => {
    const win = iframe.contentWindow;
    if (!win) return;
    win.addEventListener("afterprint", () => iframe.remove());
    setTimeout(() => iframe.remove(), 60_000); // afterprint is not fired everywhere
    win.focus();
    win.print();
  });
  document.body.append(iframe);
}
