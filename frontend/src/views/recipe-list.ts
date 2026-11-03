import { LitElement, css, html, nothing } from "lit";
import { CookbookApi, isApiError } from "../api";
import { formatDuration, totalTime } from "../format";
import { getLocalize } from "../i18n";
import { navigate, recipeUrl, rememberListSearch } from "../router";
import { sharedStyles } from "../styles";
import type { Category, HomeAssistant, RecipeSummary } from "../types";

export const SEARCH_DEBOUNCE_MS = 250;

/** Recipe list with full-text search and category filter, both kept in the URL. */
export class CookbookRecipeList extends LitElement {
  static properties = {
    hass: { attribute: false },
    recipes: { state: true },
    categories: { state: true },
    query: { state: true },
    category: { state: true },
    loading: { state: true },
    error: { state: true },
  };

  hass!: HomeAssistant;
  recipes: RecipeSummary[] = [];
  categories: Category[] = [];
  query = "";
  category: string | null = null;
  loading = true;
  error: string | null = null;

  private debounce?: ReturnType<typeof setTimeout>;
  private requestId = 0;

  connectedCallback() {
    super.connectedCallback();
    const params = new URLSearchParams(location.search);
    this.query = params.get("q") ?? "";
    this.category = params.get("category");
    void this.loadCategories();
    void this.loadRecipes();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this.debounce);
  }

  private get api() {
    return new CookbookApi(this.hass);
  }

  private async loadCategories() {
    try {
      this.categories = await this.api.categories();
    } catch (error) {
      this.showError(error);
    }
  }

  /** Latest request wins: slower earlier responses are ignored. */
  private async loadRecipes() {
    const id = ++this.requestId;
    const query = this.query.trim();
    const category = this.category ?? undefined;
    this.loading = true;
    try {
      const recipes = query
        ? await this.api.search(query, category)
        : await this.api.list(category);
      if (id !== this.requestId) return;
      this.recipes = recipes;
      this.error = null;
    } catch (error) {
      if (id === this.requestId) this.showError(error);
    } finally {
      if (id === this.requestId) this.loading = false;
    }
  }

  private showError(error: unknown) {
    const message = isApiError(error) ? error.message : String(error);
    this.error = getLocalize(this.hass)("error", { message });
  }

  private syncUrl() {
    const params = new URLSearchParams();
    if (this.query.trim()) params.set("q", this.query.trim());
    if (this.category) params.set("category", this.category);
    const search = params.size ? `?${params}` : "";
    rememberListSearch(search);
    history.replaceState(history.state, "", `${location.pathname}${search}`);
  }

  private onInput(event: InputEvent) {
    this.query = (event.target as HTMLInputElement).value;
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      this.syncUrl();
      void this.loadRecipes();
    }, SEARCH_DEBOUNCE_MS);
  }

  private clearSearch() {
    this.query = "";
    clearTimeout(this.debounce);
    this.syncUrl();
    void this.loadRecipes();
  }

  private selectCategory(category: string | null) {
    this.category = category === this.category ? null : category;
    this.syncUrl();
    void this.loadRecipes();
  }

  private open(event: MouseEvent, id: string) {
    // Keep ctrl/cmd-click and middle-click opening a new tab.
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    navigate(recipeUrl(id));
  }

  protected render() {
    const t = getLocalize(this.hass);
    return html`
      <div class="search">
        <ha-icon icon="mdi:magnify"></ha-icon>
        <input
          type="search"
          .value=${this.query}
          placeholder=${t("search_placeholder")}
          aria-label=${t("search_placeholder")}
          @input=${this.onInput}
        />
        ${this.query
          ? html`<button class="clear" aria-label=${t("clear_search")} @click=${this.clearSearch}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>`
          : nothing}
      </div>
      ${this.categories.length
        ? html`<div class="filters" role="group">
            <button
              class="btn"
              aria-pressed=${String(this.category === null)}
              @click=${() => this.selectCategory(null)}
            >
              ${t("all_categories")}
            </button>
            ${this.categories.map(
              (c) => html`<button
                class="btn"
                data-category=${c.name}
                aria-pressed=${String(this.category?.toLowerCase() === c.name.toLowerCase())}
                @click=${() => this.selectCategory(c.name)}
              >
                ${c.name} <span class="muted">${c.count}</span>
              </button>`,
            )}
          </div>`
        : nothing}
      ${this.error ? html`<p class="message error">${this.error}</p>` : this.renderRecipes(t)}
    `;
  }

  private renderRecipes(t: ReturnType<typeof getLocalize>) {
    if (this.loading && !this.recipes.length) {
      return html`<p class="message">${t("loading")}</p>`;
    }
    if (!this.recipes.length) {
      const filtered = this.query.trim() || this.category;
      return filtered
        ? html`<p class="message">${t("no_results")}</p>`
        : html`<div class="message">
            <ha-icon class="big" icon="mdi:chef-hat"></ha-icon>
            <h2>${t("no_recipes")}</h2>
            <p>${t("no_recipes_hint")}</p>
          </div>`;
    }
    return html`<div class="grid">
      ${this.recipes.map((recipe) => {
        const total = totalTime(recipe);
        return html`<a
          class="card recipe"
          href=${recipeUrl(recipe.id)}
          @click=${(e: MouseEvent) => this.open(e, recipe.id)}
        >
          <div class="picture"><ha-icon icon="mdi:silverware-fork-knife"></ha-icon></div>
          <div class="body">
            <h3>${recipe.name}</h3>
            ${total != null
              ? html`<div class="muted time">
                  <ha-icon icon="mdi:clock-outline"></ha-icon>${formatDuration(total, t)}
                </div>`
              : nothing}
            <div class="chips">${recipe.categories.map((c) => html`<span class="chip">${c}</span>`)}</div>
          </div>
        </a>`;
      })}
    </div>`;
  }

  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        padding: var(--cb-gap);
        max-width: 1200px;
        margin: 0 auto;
        box-sizing: border-box;
      }
      .search {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 12px;
        border-radius: 24px;
        background: var(--card-background-color);
        border: 1px solid var(--divider-color);
        color: var(--secondary-text-color);
      }
      .search input {
        flex: 1;
        min-width: 0;
        height: 44px;
        border: 0;
        outline: 0;
        background: transparent;
        color: var(--primary-text-color);
        font: inherit;
        font-size: 16px;
      }
      .search input::-webkit-search-cancel-button {
        display: none;
      }
      .clear {
        border: 0;
        background: none;
        color: inherit;
        cursor: pointer;
        padding: 4px;
      }
      .filters {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        padding: 12px 0 4px;
        scrollbar-width: none;
      }
      .filters .btn {
        flex: none;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: var(--cb-gap);
        margin-top: var(--cb-gap);
      }
      .recipe {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        color: inherit;
        text-decoration: none;
      }
      .recipe:hover {
        border-color: var(--primary-color);
      }
      .picture {
        display: flex;
        align-items: center;
        justify-content: center;
        aspect-ratio: 16 / 9;
        background: var(--secondary-background-color);
        color: var(--disabled-text-color, var(--secondary-text-color));
        --mdc-icon-size: 40px;
      }
      .body {
        padding: 12px;
      }
      h3 {
        margin: 0 0 6px;
        font-size: 16px;
        font-weight: 500;
      }
      .time {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        --mdc-icon-size: 16px;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: 8px;
      }
      .big {
        --mdc-icon-size: 64px;
        color: var(--primary-color);
      }
    `,
  ];
}

if (!customElements.get("cookbook-recipe-list")) {
  customElements.define("cookbook-recipe-list", CookbookRecipeList);
}
