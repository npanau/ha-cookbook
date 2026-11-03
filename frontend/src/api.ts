import type { Category, HomeAssistant, Recipe, RecipeFields, RecipeSummary } from "./types";

/** Error returned by a `cookbook/*` WebSocket command. */
export interface ApiError {
  code: string;
  message: string;
  /** Extra data of some errors (e.g. duplicate_source: recipe_id, name). */
  translation_placeholders?: Record<string, string>;
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

  /** Preview of the recipe at `url` (nothing saved), its photo URL, an already imported duplicate. */
  scrape(url: string): Promise<{ recipe: RecipeFields; image_url: string | null; duplicate: RecipeSummary | null }> {
    return this.hass.callWS({ type: "cookbook/scrape", url });
  }

  /** Sets the photo of a recipe (resized and stored by the server). */
  async uploadImage(recipeId: string, file: File): Promise<Recipe> {
    const body = new FormData();
    body.append("file", file);
    return this.imageRequest(recipeId, { method: "POST", body });
  }

  removeImage(recipeId: string): Promise<Recipe> {
    return this.imageRequest(recipeId, { method: "DELETE" });
  }

  /** Downloads the photo of an imported recipe (server side, same protections as the page). */
  importImage(recipeId: string, url: string): Promise<Recipe> {
    return this.hass.callWS<Recipe>({ type: "cookbook/import_image", recipe_id: recipeId, url });
  }

  private async imageRequest(recipeId: string, init: RequestInit): Promise<Recipe> {
    const response = await this.hass.fetchWithAuth(
      `/api/cookbook/recipes/${encodeURIComponent(recipeId)}/image`,
      init,
    );
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw { code: body.code ?? `http_${response.status}`, message: body.message ?? response.statusText } as ApiError;
    }
    return body as Recipe;
  }

  async delete(recipeId: string): Promise<void> {
    await this.hass.callWS<null>({ type: "cookbook/delete", recipe_id: recipeId });
  }
}
