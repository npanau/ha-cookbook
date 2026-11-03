import type { Category, HomeAssistant, Recipe, RecipeFields, RecipeSummary } from "./types";

/** Error returned by a `cookbook/*` WebSocket command. */
export interface ApiError {
  code: string;
  message: string;
}

export function isApiError(error: unknown): error is ApiError {
  return typeof error === "object" && error !== null && "code" in error;
}

/** Typed wrapper around the backend WebSocket commands. */
export class CookbookApi {
  constructor(private readonly hass: HomeAssistant) {}

  async list(category?: string): Promise<RecipeSummary[]> {
    const result = await this.hass.callWS<{ recipes: RecipeSummary[] }>({
      type: "cookbook/list",
      ...(category ? { category } : {}),
    });
    return result.recipes;
  }

  async search(query: string, category?: string): Promise<RecipeSummary[]> {
    const result = await this.hass.callWS<{ recipes: RecipeSummary[] }>({
      type: "cookbook/search",
      query,
      ...(category ? { category } : {}),
    });
    return result.recipes;
  }

  async categories(): Promise<Category[]> {
    const result = await this.hass.callWS<{ categories: Category[] }>({
      type: "cookbook/categories",
    });
    return result.categories;
  }

  get(recipeId: string): Promise<Recipe> {
    return this.hass.callWS<Recipe>({ type: "cookbook/get", recipe_id: recipeId });
  }

  create(fields: RecipeFields): Promise<Recipe> {
    return this.hass.callWS<Recipe>({ type: "cookbook/create", ...fields });
  }

  /** Partial update; with `expectedUpdatedAt`, fails with "conflict" if the recipe changed. */
  update(recipeId: string, fields: Partial<RecipeFields>, expectedUpdatedAt?: string): Promise<Recipe> {
    return this.hass.callWS<Recipe>({
      type: "cookbook/update",
      recipe_id: recipeId,
      ...(expectedUpdatedAt ? { expected_updated_at: expectedUpdatedAt } : {}),
      ...fields,
    });
  }

  async delete(recipeId: string): Promise<void> {
    await this.hass.callWS<null>({ type: "cookbook/delete", recipe_id: recipeId });
  }
}
