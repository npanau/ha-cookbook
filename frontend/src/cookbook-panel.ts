import { LitElement, css, html } from "lit";
import { getLocalize } from "./i18n";
import type { HomeAssistant } from "./types";

class CookbookPanel extends LitElement {
  static properties = {
    hass: { attribute: false },
    narrow: { type: Boolean },
  };

  hass?: HomeAssistant;
  narrow = false;

  protected render() {
    const t = getLocalize(this.hass);
    const name = this.hass?.user?.name ?? t("unknown_user");
    return html`
      <div class="toolbar">
        ${this.narrow
          ? html`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>`
          : ""}
        <div class="title">Cookbook</div>
      </div>
      <main>
        <ha-icon icon="mdi:chef-hat"></ha-icon>
        <h1>${t("hello", { name })}</h1>
        <p>${t("subtitle")}</p>
      </main>
    `;
  }

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--primary-background-color);
      color: var(--primary-text-color);
      font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
    }
    .toolbar {
      display: flex;
      align-items: center;
      height: var(--header-height, 56px);
      padding: 0 16px;
      background: var(--app-header-background-color, var(--primary-color));
      color: var(--app-header-text-color, var(--text-primary-color));
      font-size: 20px;
    }
    .title {
      margin-left: 8px;
    }
    main {
      max-width: 640px;
      margin: 48px auto;
      padding: 0 16px;
      text-align: center;
    }
    ha-icon {
      --mdc-icon-size: 64px;
      color: var(--primary-color);
    }
    p {
      color: var(--secondary-text-color);
    }
  `;
}

if (!customElements.get("cookbook-panel")) {
  customElements.define("cookbook-panel", CookbookPanel);
}
