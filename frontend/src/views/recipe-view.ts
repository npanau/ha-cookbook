import { LitElement, css, html, nothing } from "lit";
import { CookbookApi, isApiError } from "../api";
import "../components/confirm-dialog";
import { formatDate, formatDuration, groupBySection, totalTime } from "../format";
import { type Localize, getLanguage, getLocalize } from "../i18n";
import { printRecipe } from "../print";
import { editUrl, listUrl, navigate } from "../router";
import { sharedStyles } from "../styles";
import type { HomeAssistant, Recipe, RecipeItem } from "../types";

const LARGE_TEXT_KEY = "cookbook:large-text";
const checksKey = (id: string) => `cookbook:checks:${id}`;

// localStorage may be unavailable (private mode, blocked storage): never fail because of it.
function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string | null): void {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

/** Recipe sheet, readable while cooking: tick items, larger text, keep the screen on. */
export class CookbookRecipeView extends LitElement {
  static properties = {
    hass: { attribute: false },
    recipeId: { attribute: "recipe-id" },
    recipe: { state: true },
    error: { state: true },
    notFound: { state: true },
    checked: { state: true },
    largeText: { type: Boolean, reflect: true, attribute: "large-text" },
    awake: { state: true },
    confirmDelete: { state: true },
  };

  hass!: HomeAssistant;
  recipeId = "";
  recipe: Recipe | null = null;
  error: string | null = null;
  notFound = false;
  /** Keys "i<index>" (ingredient) and "s<index>" (step), stored per device. */
  checked = new Set<string>();
  largeText = readStorage(LARGE_TEXT_KEY) === "1";
  awake = false;
  confirmDelete = false;

  private wakeLock: WakeLockSentinel | null = null;

  private onVisibilityChange = () => {
    // The browser releases the wake lock when the page is hidden: take it back.
    if (this.awake && document.visibilityState === "visible") void this.requestWakeLock();
  };

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("visibilitychange", this.onVisibilityChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    void this.releaseWakeLock();
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has("recipeId") && this.recipeId) void this.load();
  }

  private async load() {
    const id = this.recipeId;
    this.recipe = null;
    this.error = null;
    this.notFound = false;
    this.checked = new Set(JSON.parse(readStorage(checksKey(id)) ?? "[]") as string[]);
    try {
      const recipe = await new CookbookApi(this.hass).get(id);
      if (id === this.recipeId) this.recipe = recipe;
    } catch (error) {
      if (id !== this.recipeId) return;
      if (isApiError(error) && error.code === "not_found") {
        this.notFound = true;
      } else {
        const message = isApiError(error) ? error.message : String(error);
        this.error = getLocalize(this.hass)("error", { message });
      }
    }
  }

  private toggleCheck(key: string) {
    const checked = new Set(this.checked);
    if (checked.has(key)) checked.delete(key);
    else checked.add(key);
    this.checked = checked;
    writeStorage(checksKey(this.recipeId), checked.size ? JSON.stringify([...checked]) : null);
  }

  private resetChecks() {
    this.checked = new Set();
    writeStorage(checksKey(this.recipeId), null);
  }

  private toggleLargeText() {
    this.largeText = !this.largeText;
    writeStorage(LARGE_TEXT_KEY, this.largeText ? "1" : null);
  }

  /** Wake Lock needs a secure context (HTTPS or localhost). */
  static get wakeLockSupported(): boolean {
    return window.isSecureContext && "wakeLock" in navigator;
  }

  private async requestWakeLock() {
    try {
      this.wakeLock = await navigator.wakeLock.request("screen");
    } catch {
      this.awake = false;
    }
  }

  private async releaseWakeLock() {
    const lock = this.wakeLock;
    this.wakeLock = null;
    await lock?.release().catch(() => undefined);
  }

  private async toggleAwake() {
    this.awake = !this.awake;
    if (this.awake) await this.requestWakeLock();
    else await this.releaseWakeLock();
  }

  private async deleteRecipe() {
    this.confirmDelete = false;
    try {
      await new CookbookApi(this.hass).delete(this.recipeId);
      writeStorage(checksKey(this.recipeId), null);
      navigate(listUrl(), { replace: true });
    } catch (error) {
      const message = isApiError(error) ? error.message : String(error);
      this.error = getLocalize(this.hass)("error", { message });
    }
  }

  protected render() {
    const t = getLocalize(this.hass);
    if (this.notFound) {
      return html`<div class="message">
        <p>${t("recipe_not_found")}</p>
        <button class="btn" @click=${() => navigate(listUrl())}>${t("back_to_list")}</button>
      </div>`;
    }
    if (this.error) return html`<p class="message error">${this.error}</p>`;
    if (!this.recipe) return html`<p class="message">${t("loading")}</p>`;
    return this.renderRecipe(this.recipe, t);
  }

  private renderRecipe(recipe: Recipe, t: Localize) {
    const language = getLanguage(this.hass);
    const meta = [
      { key: "prep_time", icon: "mdi:knife", value: formatDuration(recipe.prep_time, t) },
      { key: "cook_time", icon: "mdi:pot-steam-outline", value: formatDuration(recipe.cook_time, t) },
      { key: "total_time", icon: "mdi:clock-outline", value: formatDuration(totalTime(recipe), t) },
      { key: "servings", icon: "mdi:account-group-outline", value: recipe.servings ?? "" },
    ] as const;
    const updated = formatDate(recipe.updated_at, language);
    return html`
      <div class="actions">
        <button class="btn" aria-pressed=${String(this.largeText)} @click=${this.toggleLargeText}>
          <ha-icon icon="mdi:format-size"></ha-icon>${t("larger_text")}
        </button>
        ${CookbookRecipeView.wakeLockSupported
          ? html`<button class="btn awake" aria-pressed=${String(this.awake)} @click=${this.toggleAwake}>
              <ha-icon icon="mdi:cellphone-screenshot"></ha-icon>${t("keep_awake")}
            </button>`
          : nothing}
        ${this.checked.size
          ? html`<button class="btn reset" @click=${this.resetChecks}>
              <ha-icon icon="mdi:checkbox-blank-off-outline"></ha-icon>${t("reset_checks")}
            </button>`
          : nothing}
        <span class="spacer"></span>
        <button class="btn primary edit" @click=${() => navigate(editUrl(recipe.id))}>
          <ha-icon icon="mdi:pencil"></ha-icon>${t("edit")}
        </button>
        <button class="btn print" @click=${() => printRecipe(recipe, t, language)}>
          <ha-icon icon="mdi:printer"></ha-icon>${t("print")}
        </button>
        ${this.hass.user?.is_admin
          ? html`<button class="btn danger delete" @click=${() => (this.confirmDelete = true)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>${t("delete")}
            </button>`
          : nothing}
      </div>

      <article class="card">
        <h1>${recipe.name}</h1>
        ${recipe.categories.length
          ? html`<div class="chips">${recipe.categories.map((c) => html`<span class="chip">${c}</span>`)}</div>`
          : nothing}
        <div class="meta">
          ${meta
            .filter((m) => m.value)
            .map(
              (m) => html`<div class="meta-item">
                <ha-icon icon=${m.icon}></ha-icon>
                <div><div class="muted label">${t(m.key)}</div><div>${m.value}</div></div>
              </div>`,
            )}
        </div>
        ${recipe.description ? html`<p class="text description">${recipe.description}</p>` : nothing}

        <div class="columns">
          ${recipe.ingredients.length
            ? html`<section class="ingredients">
                <h2>${t("ingredients")}</h2>
                ${this.renderItems(recipe.ingredients, "i")}
              </section>`
            : nothing}
          ${recipe.steps.length
            ? html`<section class="steps">
                <h2>${t("steps")}</h2>
                ${this.renderItems(recipe.steps, "s")}
              </section>`
            : nothing}
        </div>

        ${recipe.notes
          ? html`<section class="notes"><h2>${t("notes")}</h2><p class="text">${recipe.notes}</p></section>`
          : nothing}

        <footer class="muted">
          ${recipe.source_url
            ? html`<a href=${recipe.source_url} target="_blank" rel="noopener noreferrer">
                <ha-icon icon="mdi:open-in-new"></ha-icon>${t("view_source")}
              </a>`
            : nothing}
          <span class="updated">
            ${recipe.updated_by_name
              ? t("updated_by", { name: recipe.updated_by_name, date: updated })
              : t("updated_on", { date: updated })}
          </span>
        </footer>
      </article>

      <cookbook-confirm-dialog
        .open=${this.confirmDelete}
        .heading=${t("delete_confirm_title")}
        .text=${t("delete_confirm_text", { name: recipe.name })}
        .confirmLabel=${t("delete")}
        .cancelLabel=${t("cancel")}
        @confirm=${this.deleteRecipe}
        @cancel=${() => (this.confirmDelete = false)}
      ></cookbook-confirm-dialog>
    `;
  }

  /** Items keep their global index (stable check keys); steps are numbered across sections. */
  private renderItems(items: RecipeItem[], prefix: "i" | "s") {
    let index = 0;
    return groupBySection(items).map(
      (group) => html`
        ${group.section ? html`<h3>${group.section}</h3>` : nothing}
        <ul class=${prefix === "s" ? "numbered" : ""}>
          ${group.items.map((item) => {
            const key = `${prefix}${index++}`;
            const done = this.checked.has(key);
            return html`<li>
              <label class=${done ? "done" : ""}>
                <input type="checkbox" .checked=${done} @change=${() => this.toggleCheck(key)} />
                ${prefix === "s" ? html`<span class="number">${index}</span>` : nothing}
                <span class="item-text">${item.text}</span>
              </label>
            </li>`;
          })}
        </ul>
      `,
    );
  }

  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        padding: var(--cb-gap);
        max-width: 1000px;
        margin: 0 auto;
        box-sizing: border-box;
        --cb-text-size: 16px;
      }
      :host([large-text]) {
        --cb-text-size: 21px;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: var(--cb-gap);
      }
      .spacer {
        flex: 1;
      }
      article {
        padding: 24px;
        font-size: var(--cb-text-size);
        line-height: 1.5;
      }
      h1 {
        margin: 0 0 8px;
        font-size: 1.75em;
        font-weight: 500;
        line-height: 1.2;
      }
      h2 {
        margin: 24px 0 8px;
        font-size: 1.2em;
        font-weight: 500;
      }
      h3 {
        margin: 12px 0 4px;
        font-size: 1em;
        font-weight: 500;
        color: var(--secondary-text-color);
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }
      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 12px 32px;
        margin: 16px 0;
      }
      .meta-item {
        display: flex;
        align-items: center;
        gap: 8px;
        --mdc-icon-size: 22px;
      }
      .meta-item ha-icon {
        color: var(--primary-color);
      }
      .label {
        font-size: 0.75em;
      }
      .text {
        white-space: pre-line;
      }
      .columns {
        display: grid;
        grid-template-columns: minmax(220px, 1fr) 2fr;
        gap: 0 32px;
      }
      @media (max-width: 700px) {
        .columns {
          grid-template-columns: 1fr;
        }
        article {
          padding: 16px;
        }
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      li {
        margin: 2px 0;
      }
      label {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 6px 4px;
        border-radius: 8px;
        cursor: pointer;
      }
      label:hover {
        background: var(--secondary-background-color);
      }
      input[type="checkbox"] {
        flex: none;
        width: 1.1em;
        height: 1.1em;
        margin-top: 0.2em;
        accent-color: var(--primary-color);
      }
      .number {
        flex: none;
        min-width: 1.6em;
        font-weight: 500;
        color: var(--primary-color);
      }
      .done .item-text,
      .done .number {
        color: var(--secondary-text-color);
        text-decoration: line-through;
      }
      footer {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 8px;
        margin-top: 24px;
        padding-top: 12px;
        border-top: 1px solid var(--divider-color);
        font-size: 14px;
      }
      footer a {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        color: var(--primary-color);
        --mdc-icon-size: 16px;
      }
    `,
  ];
}

if (!customElements.get("cookbook-recipe-view")) {
  customElements.define("cookbook-recipe-view", CookbookRecipeView);
}
