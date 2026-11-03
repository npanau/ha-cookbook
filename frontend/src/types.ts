/** Minimal subset of the Home Assistant frontend `hass` object we rely on. */
export interface HomeAssistant {
  user?: { id: string; name: string; is_admin: boolean };
  language: string;
  locale?: { language: string };
  callWS<T>(msg: { type: string; [key: string]: unknown }): Promise<T>;
}

/** Route given by HA to a custom panel: prefix is "/cookbook", path the rest. */
export interface PanelRoute {
  prefix: string;
  path: string;
}

export interface RecipeItem {
  text: string;
  section: string | null;
}

export interface RecipeSummary {
  id: string;
  name: string;
  categories: string[];
  prep_time: number | null;
  cook_time: number | null;
  total_time: number | null;
  image: string | null;
  updated_at: string;
  /** Search results only: ingredient lines containing a searched word. */
  matched_ingredients?: string[];
}

export interface Recipe extends RecipeSummary {
  description: string | null;
  servings: string | null;
  ingredients: RecipeItem[];
  steps: RecipeItem[];
  notes: string | null;
  source_url: string | null;
  created_at: string;
  created_by: string | null;
  updated_by: string | null;
  created_by_name: string | null;
  updated_by_name: string | null;
}

export interface Category {
  name: string;
  count: number;
}

/** Fields a client may send to cookbook/create and cookbook/update. */
export interface RecipeFields {
  name: string;
  description: string | null;
  categories: string[];
  prep_time: number | null;
  cook_time: number | null;
  total_time: number | null;
  servings: string | null;
  ingredients: RecipeItem[];
  steps: RecipeItem[];
  notes: string | null;
  source_url: string | null;
}
