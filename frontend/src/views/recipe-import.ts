import { LitElement, css, html, nothing } from "lit";
import { CookbookApi, isApiError } from "../api";
import { type Localize, type MessageKey, getLocalize } from "../i18n";
import { navigate, recipeUrl } from "../router";
import { sharedStyles } from "../styles";
import type { HomeAssistant, RecipeFields, RecipeSummary } from "../types";
import type { CookbookRecipeEditor } from "./recipe-editor";
import "./recipe-editor";

const ERROR_CODES = ["invalid_url", "blocked_url", "fetch_failed", "not_a_recipe", "too_large"];

/** "https://www.marmiton.org/recettes/..." -> "marmiton.org". */
export function siteName(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * Import from a URL: analyze the page (cookbook/scrape), then show the editor prefilled
 * with the preview — saving it is a normal creation. `?url=...` starts the analysis.
 */
export class CookbookRecipeImport extends LitElement {
  static properties = {
    hass: { attribute: false },
    url: { state: true },
    loading: { state: true },
    error: { state: true },
    draft: { state: true },
    duplicate: { state: true },
  };

  hass!: HomeAssistant;
  url = "";
  loading = false;
  error: string | null = null;
  draft: RecipeFields | null = null;
  duplicate: RecipeSummary | null = null;

  connectedCallback() {
    super.connectedCallback();
    const url = new URLSearchParams(location.search).get("url");
    if (url) {
      this.url = url;
      void this.analyze();
    }
  }

  /** Same contract as the editor, for the panel's back arrow. */
  requestLeave(target: string) {
    const editor = this.renderRoot.querySelector<CookbookRecipeEditor>("cookbook-recipe-editor");
    if (editor) editor.requestLeave(target);
    else navigate(target);
  }

  private get t(): Localize {
    return getLocalize(this.hass);
  }

  async analyze() {
    const url = this.url.trim();
    if (!url || this.loading) return;
    this.loading = true;
    this.error = null;
    this.duplicate = null;
    try {
      const { recipe, duplicate } = await new CookbookApi(this.hass).scrape(url);
      // One recipe per source URL: an already imported page is not offered again.
      if (duplicate) this.duplicate = duplicate;
      else this.draft = recipe;
    } catch (error) {
      this.error = this.describe(error);
    } finally {
      this.loading = false;
    }
  }

  private describe(error: unknown): string {
    if (isApiError(error) && ERROR_CODES.includes(error.code)) {
      return this.t(`import_error_${error.code}` as MessageKey, { message: error.message });
    }
    const message = isApiError(error) ? error.message : String(error);
    return this.t("error", { message });
  }

  private restart() {
    this.draft = null;
    this.duplicate = null;
    this.error = null;
  }

  protected render() {
    const t = this.t;
    if (this.draft) {
      return html`
        <cookbook-recipe-editor
          .hass=${this.hass}
          .draft=${this.draft}
          .importedFrom=${siteName(this.draft.source_url ?? this.url)}
        ></cookbook-recipe-editor>
      `;
    }
    return html`
      <section class="card">
        <h1>${t("import_recipe")}</h1>
        <p class="muted">${t("import_hint")}</p>
        <form
          @submit=${(e: Event) => {
            e.preventDefault();
            void this.analyze();
          }}
        >
          <input
            name="url"
            type="url"
            inputmode="url"
            autocomplete="off"
            placeholder="https://www.marmiton.org/recettes/…"
            aria-label=${t("import_url")}
            .value=${this.url}
            ?disabled=${this.loading}
            @input=${(e: Event) => (this.url = (e.target as HTMLInputElement).value)}
          />
          <button class="btn primary analyze" type="submit" ?disabled=${this.loading || !this.url.trim()}>
            <ha-icon icon=${this.loading ? "mdi:timer-sand" : "mdi:magnify"}></ha-icon>
            ${this.loading ? t("analyzing") : t("analyze")}
          </button>
        </form>
        ${this.error ? html`<p class="error" role="alert">${this.error}</p>` : nothing}
        ${this.duplicate ? this.renderDuplicate(this.duplicate, t) : nothing}
      </section>
    `;
  }

  private renderDuplicate(duplicate: RecipeSummary, t: Localize) {
    return html`<div class="duplicate" role="alert">
      <span>${t("duplicate_text", { name: duplicate.name })}</span>
      <span class="duplicate-actions">
        <button class="btn open-duplicate" @click=${() => navigate(recipeUrl(duplicate.id))}>
          ${t("duplicate_open")}
        </button>
        <button class="btn restart" @click=${this.restart}>${t("import_another")}</button>
      </span>
    </div>`;
  }

  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }
      section {
        max-width: 720px;
        margin: var(--cb-gap) auto;
        padding: 20px;
        box-sizing: border-box;
      }
      @media (max-width: 760px) {
        section {
          margin: var(--cb-gap);
        }
      }
      h1 {
        margin: 0 0 8px;
        font-size: 22px;
        font-weight: 500;
      }
      form {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 16px;
      }
      input {
        flex: 1 1 280px;
        min-width: 0;
        box-sizing: border-box;
        padding: 10px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font: inherit;
        font-size: 16px;
      }
      input:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: -1px;
      }
      .btn[disabled] {
        opacity: 0.6;
        cursor: default;
      }
      .error {
        margin: 12px 0 0;
      }
      .duplicate {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin: 16px 0 0;
        padding: 12px 16px;
        box-sizing: border-box;
        border: 1px solid var(--warning-color, #ffa600);
        border-radius: var(--cb-radius);
      }
      .duplicate-actions {
        display: flex;
        gap: 8px;
      }
    `,
  ];
}

if (!customElements.get("cookbook-recipe-import")) {
  customElements.define("cookbook-recipe-import", CookbookRecipeImport);
}
