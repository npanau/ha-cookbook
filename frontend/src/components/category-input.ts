import { LitElement, css, html } from "lit";
import { sharedStyles } from "../styles";
import { fold } from "../text";

/**
 * Categories as removable chips, with suggestions of existing categories.
 * Enter, comma or leaving the field adds the typed text; Backspace on an empty field removes the
 * last chip. Fires "value-changed" with { value: string[] }.
 */
export class CookbookCategoryInput extends LitElement {
  static properties = {
    value: { attribute: false },
    suggestions: { attribute: false },
    placeholder: {},
    removeLabel: { attribute: false },
  };

  value: string[] = [];
  suggestions: string[] = [];
  placeholder = "";
  removeLabel: (name: string) => string = (name) => name;

  private get input() {
    return this.renderRoot.querySelector<HTMLInputElement>("input")!;
  }

  private emit(value: string[]) {
    this.value = value;
    this.dispatchEvent(new CustomEvent("value-changed", { detail: { value } }));
  }

  /** Adds a category; an existing spelling (from suggestions) wins over the typed one. */
  add(text: string) {
    const name = text.trim();
    if (!name) return;
    if (this.value.some((v) => fold(v) === fold(name))) return;
    const known = this.suggestions.find((s) => fold(s) === fold(name));
    this.emit([...this.value, known ?? name]);
  }

  private removeAt(index: number) {
    this.emit(this.value.filter((_, i) => i !== index));
  }

  private commit() {
    this.add(this.input.value);
    this.input.value = "";
  }

  private onKeydown(event: KeyboardEvent) {
    if ((event.key === "Enter" || event.key === ",") && !event.isComposing) {
      event.preventDefault();
      this.commit();
    } else if (event.key === "Backspace" && !this.input.value && this.value.length) {
      this.removeAt(this.value.length - 1);
    }
  }

  /** Picking a suggestion in the datalist fires "input" with the full value. */
  private onInput(event: InputEvent) {
    const typed = this.input.value;
    const picked = event.inputType === undefined || event.inputType === "insertReplacementText";
    if (picked && this.suggestions.includes(typed)) this.commit();
  }

  protected render() {
    const available = this.suggestions.filter((s) => !this.value.some((v) => fold(v) === fold(s)));
    return html`
      <div class="field">
        ${this.value.map(
          (name, index) => html`<span class="chip">
            ${name}
            <button aria-label=${this.removeLabel(name)} @click=${() => this.removeAt(index)}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </span>`,
        )}
        <input
          list="suggestions"
          placeholder=${this.placeholder}
          aria-label=${this.placeholder}
          @keydown=${this.onKeydown}
          @input=${this.onInput}
          @blur=${this.commit}
        />
        <datalist id="suggestions">${available.map((s) => html`<option value=${s}></option>`)}</datalist>
      </div>
    `;
  }

  static styles = [
    sharedStyles,
    css`
      .field {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
        padding: 6px 8px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color);
      }
      .field:focus-within {
        outline: 2px solid var(--primary-color);
        outline-offset: -1px;
      }
      .chip {
        gap: 2px;
        padding-right: 2px;
        font-size: 14px;
        color: var(--primary-text-color);
      }
      .chip button {
        display: inline-flex;
        padding: 2px;
        border: 0;
        border-radius: 50%;
        background: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        --mdc-icon-size: 14px;
      }
      input {
        flex: 1;
        min-width: 120px;
        padding: 4px;
        border: 0;
        outline: 0;
        background: transparent;
        color: var(--primary-text-color);
        font: inherit;
        font-size: 15px;
      }
    `,
  ];
}

if (!customElements.get("cookbook-category-input")) {
  customElements.define("cookbook-category-input", CookbookCategoryInput);
}
