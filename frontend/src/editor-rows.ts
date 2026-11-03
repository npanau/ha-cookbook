import type { RecipeItem } from "./types";

/** Editor representation of a list: section headers and items, in display order. */
export interface Row {
  id: number;
  kind: "item" | "section";
  text: string;
}

let nextId = 1;
export const newRow = (kind: Row["kind"], text = ""): Row => ({ id: nextId++, kind, text });

/** Items -> rows: a header is inserted each time the section changes. */
export function itemsToRows(items: RecipeItem[]): Row[] {
  const rows: Row[] = [];
  let current: string | null = null;
  for (const item of items) {
    if (item.section !== current) {
      // An empty header means "back to no section" (rare, e.g. after an import).
      rows.push(newRow("section", item.section ?? ""));
      current = item.section;
    }
    rows.push(newRow("item", item.text));
  }
  return rows;
}

/** Rows -> items: each item takes the section of the header above it. */
export function rowsToItems(rows: Row[]): RecipeItem[] {
  const items: RecipeItem[] = [];
  let section: string | null = null;
  for (const row of rows) {
    const text = row.text.trim();
    if (row.kind === "section") section = text || null;
    else if (text) items.push({ text, section });
  }
  return items;
}

export function moveRow(rows: Row[], from: number, to: number): Row[] {
  if (to < 0 || to >= rows.length || from === to) return rows;
  const result = [...rows];
  const [row] = result.splice(from, 1);
  result.splice(to, 0, row);
  return result;
}

// Leading bullets / numbering of pasted lists: "- ", "• ", "1. ", "2) ", "* ".
const LIST_MARKER = /^\s*(?:[-*•·–]|\d+[.)])\s+/;

/** Splits pasted text into lines, without list markers or blank lines. */
export function splitPastedLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(LIST_MARKER, "").trim())
    .filter(Boolean);
}
