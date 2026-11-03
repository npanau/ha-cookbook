import type { Localize } from "./i18n";
import type { RecipeSummary } from "./types";

/** 75 -> "1 h 15 min"; null/undefined -> "". */
export function formatDuration(minutes: number | null | undefined, t: Localize): string {
  if (minutes == null) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return t("duration_h_min", { h, m });
  if (h) return t("duration_h", { h });
  return t("duration_min", { m });
}

/** Total time as entered, or prep + cook when only those are known. */
export function totalTime(recipe: RecipeSummary): number | null {
  if (recipe.total_time != null) return recipe.total_time;
  if (recipe.prep_time == null && recipe.cook_time == null) return null;
  return (recipe.prep_time ?? 0) + (recipe.cook_time ?? 0);
}

export function formatDate(iso: string, language: string): string {
  return new Intl.DateTimeFormat(language, { dateStyle: "long" }).format(new Date(iso));
}

/** Groups consecutive items by section, keeping their order. */
export function groupBySection<T extends { section: string | null }>(
  items: T[],
): { section: string | null; items: T[] }[] {
  const groups: { section: string | null; items: T[] }[] = [];
  for (const item of items) {
    const last = groups.at(-1);
    if (last && last.section === item.section) {
      last.items.push(item);
    } else {
      groups.push({ section: item.section, items: [item] });
    }
  }
  return groups;
}
