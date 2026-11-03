import { LitElement, css, html } from "lit";
import { sharedStyles } from "../styles";

/** Modal confirmation. Fires "confirm" or "cancel"; the parent controls `open`. */
export class CookbookConfirmDialog extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    heading: {},
    text: {},
    confirmLabel: { attribute: "confirm-label" },
    cancelLabel: { attribute: "cancel-label" },
  };

  open = false;
  heading = "";
  text = "";
  confirmLabel = "OK";
  cancelLabel = "Cancel";

  private onKeydown = (event: KeyboardEvent) => {
    if (this.open && event.key === "Escape") this.fire("cancel");
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this.onKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this.onKeydown);
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has("open") && this.open) {
      this.renderRoot.querySelector<HTMLButtonElement>(".cancel")?.focus();
    }
  }

  private fire(name: "confirm" | "cancel") {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true }));
  }

  protected render() {
    if (!this.open) return html``;
    return html`
      <div class="backdrop" @click=${() => this.fire("cancel")}></div>
      <div class="dialog card" role="alertdialog" aria-modal="true" aria-labelledby="heading">
        <h2 id="heading">${this.heading}</h2>
        <p>${this.text}</p>
        <div class="actions">
          <button class="btn cancel" @click=${() => this.fire("cancel")}>${this.cancelLabel}</button>
          <button class="btn danger primary confirm" @click=${() => this.fire("confirm")}>
            ${this.confirmLabel}
          </button>
        </div>
      </div>
    `;
  }

  static styles = [
    sharedStyles,
    css`
      .backdrop {
        position: fixed;
        inset: 0;
        z-index: 10;
        background: rgba(0, 0, 0, 0.5);
      }
      .dialog {
        position: fixed;
        z-index: 11;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: min(420px, calc(100vw - 32px));
        padding: 24px;
      }
      h2 {
        margin: 0 0 8px;
        font-size: 20px;
        font-weight: 500;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 24px;
      }
    `,
  ];
}

if (!customElements.get("cookbook-confirm-dialog")) {
  customElements.define("cookbook-confirm-dialog", CookbookConfirmDialog);
}
