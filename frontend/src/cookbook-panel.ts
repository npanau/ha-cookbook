import { LitElement, css, html, nothing } from "lit";
import { getLocalize } from "./i18n";
import { PANEL_PREFIX, type View, listUrl, navigate, parsePath, recipeUrl } from "./router";
import { sharedStyles } from "./styles";
import type { HomeAssistant, PanelRoute } from "./types";
import type { CookbookRecipeEditor } from "./views/recipe-editor";
import "./views/recipe-editor";
import "./views/recipe-list";
import "./views/recipe-view";

/** Root of the panel: toolbar and sub-route dispatch. HA sets hass, narrow and route. */
class CookbookPanel extends LitElement {
  static properties = {
    hass: { attribute: false },
    narrow: { type: Boolean },
    route: { attribute: false },
  };

  hass?: HomeAssistant;
  narrow = false;
  route?: PanelRoute;

  /** Back arrow: editor -> recipe (or list for a new one), recipe -> list. */
  private back(view: View) {
    const target = view.name === "edit" ? recipeUrl(view.id) : listUrl();
    const editor = this.renderRoot.querySelector<CookbookRecipeEditor>("cookbook-recipe-editor");
    if (editor) editor.requestLeave(target);
    else navigate(target);
  }

  protected render() {
    if (!this.hass) return nothing;
    const t = getLocalize(this.hass);
    const view = parsePath(this.route?.path ?? "");
    return html`
      <header class="toolbar">
        ${this.narrow
          ? html`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>`
          : nothing}
        ${view.name !== "list"
          ? html`<button class="icon-btn back" aria-label=${t("back")} @click=${() => this.back(view)}>
              <ha-icon icon="mdi:arrow-left"></ha-icon>
            </button>`
          : nothing}
        <div class="title">Cookbook</div>
      </header>
      <main>
        ${view.name === "list"
          ? html`<cookbook-recipe-list .hass=${this.hass}></cookbook-recipe-list>`
          : view.name === "recipe"
            ? html`<cookbook-recipe-view .hass=${this.hass} .recipeId=${view.id}></cookbook-recipe-view>`
            : view.name === "new"
              ? html`<cookbook-recipe-editor .hass=${this.hass}></cookbook-recipe-editor>`
              : view.name === "edit"
                ? html`<cookbook-recipe-editor .hass=${this.hass} .recipeId=${view.id}></cookbook-recipe-editor>`
                : html`<div class="message">
                <p>${t("page_not_found")}</p>
                <button class="btn" @click=${() => navigate(PANEL_PREFIX)}>${t("back_to_list")}</button>
              </div>`}
      </main>
    `;
  }

  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        min-height: 100vh;
        background: var(--primary-background-color);
        font-family: var(--ha-font-family-body, var(--paper-font-body1_-_font-family, Roboto, sans-serif));
      }
      .toolbar {
        position: sticky;
        top: 0;
        z-index: 2;
        display: flex;
        align-items: center;
        gap: 4px;
        height: var(--header-height, 56px);
        padding: 0 12px;
        box-sizing: border-box;
        background: var(--app-header-background-color, var(--primary-color));
        color: var(--app-header-text-color, var(--text-primary-color));
        border-bottom: var(--app-header-border-bottom, none);
      }
      .title {
        margin-left: 8px;
        font-size: 20px;
      }
      .icon-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border: 0;
        border-radius: 50%;
        background: none;
        color: inherit;
        cursor: pointer;
      }
      .icon-btn:hover {
        background: rgba(127, 127, 127, 0.15);
      }
    `,
  ];
}

if (!customElements.get("cookbook-panel")) {
  customElements.define("cookbook-panel", CookbookPanel);
}
