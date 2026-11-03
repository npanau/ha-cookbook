import { LitElement, css, html, nothing } from "lit";
import { sharedStyles } from "../styles";

export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_PHOTO_BYTES = 15 * 1024 * 1024;

export interface PhotoLabels {
  add: string;
  replace: string;
  remove: string;
  dropHint: string;
  invalid: string;
  tooLarge: string;
}

/**
 * Photo of a recipe: preview, add/replace (file picker — camera or library on phones —
 * or drag and drop) and remove. Fires "photo-changed" with { file: File | null }.
 */
export class CookbookPhotoInput extends LitElement {
  static properties = {
    src: {},
    labels: { attribute: false },
    error: { state: true },
    dragging: { state: true },
  };

  src: string | null = null;
  labels!: PhotoLabels;
  error: string | null = null;
  dragging = false;

  private pick() {
    this.renderRoot.querySelector<HTMLInputElement>("input[type=file]")!.click();
  }

  /** Checks type and size before anything is sent (the server checks again). */
  choose(file: File | undefined | null) {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      this.error = this.labels.invalid;
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      this.error = this.labels.tooLarge;
      return;
    }
    this.error = null;
    this.emit(file);
  }

  private emit(file: File | null) {
    this.dispatchEvent(new CustomEvent("photo-changed", { detail: { file } }));
  }

  private onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragging = false;
    this.choose(event.dataTransfer?.files?.[0]);
  }

  protected render() {
    return html`
      <div
        class="zone ${this.dragging ? "dragging" : ""} ${this.src ? "filled" : ""}"
        @dragover=${(e: DragEvent) => {
          e.preventDefault();
          this.dragging = true;
        }}
        @dragleave=${() => (this.dragging = false)}
        @drop=${this.onDrop}
      >
        ${this.src
          ? html`<img class="preview" src=${this.src} alt="" />`
          : html`<button class="empty" type="button" @click=${this.pick}>
              <ha-icon icon="mdi:camera-plus-outline"></ha-icon>
              <span>${this.labels.add}</span>
              <span class="muted hint">${this.labels.dropHint}</span>
            </button>`}
      </div>
      ${this.src
        ? html`<div class="actions">
            <button class="btn replace" type="button" @click=${this.pick}>
              <ha-icon icon="mdi:camera-flip-outline"></ha-icon>${this.labels.replace}
            </button>
            <button class="btn remove" type="button" @click=${() => this.emit(null)}>
              <ha-icon icon="mdi:image-remove-outline"></ha-icon>${this.labels.remove}
            </button>
          </div>`
        : nothing}
      ${this.error ? html`<p class="error" role="alert">${this.error}</p>` : nothing}
      <input
        type="file"
        accept=${ACCEPTED_TYPES.join(",")}
        hidden
        @change=${(e: Event) => {
          const input = e.target as HTMLInputElement;
          this.choose(input.files?.[0]);
          input.value = ""; // choosing the same file again still fires "change"
        }}
      />
    `;
  }

  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }
      .zone {
        overflow: hidden;
        border: 2px dashed var(--divider-color);
        border-radius: var(--cb-radius);
        aspect-ratio: 16 / 9;
        max-height: 320px;
        width: 100%;
        background: var(--secondary-background-color);
      }
      .zone.filled {
        border-style: solid;
      }
      .zone.dragging {
        border-color: var(--primary-color);
      }
      .preview {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        width: 100%;
        height: 100%;
        border: 0;
        background: none;
        color: var(--primary-color);
        font: inherit;
        cursor: pointer;
        --mdc-icon-size: 40px;
      }
      .hint {
        font-size: 13px;
      }
      .actions {
        display: flex;
        gap: 8px;
        margin-top: 8px;
      }
      .error {
        margin: 8px 0 0;
      }
    `,
  ];
}

if (!customElements.get("cookbook-photo-input")) {
  customElements.define("cookbook-photo-input", CookbookPhotoInput);
}
