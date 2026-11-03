import { LitElement, css, html, nothing } from "lit";
import { getLocalize } from "./i18n";
import { PANEL_PREFIX, listUrl, navigate, parsePath } from "./router";
import { sharedStyles } from "./styles";
import type { HomeAssistant, PanelRoute } from "./types";
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
          ? html`<button class="icon-btn back" aria-label=${t("back")} @click=${() => navigate(listUrl())}>
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
