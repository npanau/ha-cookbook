import { LitElement, css, html } from "lit";
import { sharedStyles } from "../styles";
import { fold } from "../text";

/**
 * Categories as removable chips, with a dropdown of existing categories (custom combobox: the native
 * <datalist> behaves differently in each browser and opens erratically inside shadow DOM).
 * The list opens on focus or click and is filtered while typing (accents and case ignored).
 * Enter, comma or leaving the field adds the typed text (or the highlighted suggestion); Backspace on
 * an empty field removes the last chip. Fires "value-changed" with { value: string[] }.
 */
export class CookbookCategoryInput extends LitElement {
  static properties = {
    value: { attribute: false },
    suggestions: { attribute: false },
    placeholder: {},
    removeLabel: { attribute: false },
    open: { state: true },
    query: { state: true },
    active: { state: true },
  };

  value: string[] = [];
  suggestions: string[] = [];
  placeholder = "";
  removeLabel: (name: string) => string = (name) => name;
  private open = false;
  private query = "";
  /** Index of the highlighted suggestion in `filtered`, -1 when none. */
  private active = -1;

  private get input() {
    return this.renderRoot.querySelector<HTMLInputElement>("input")!;
  }

  /** Suggestions not chosen yet and containing the typed text; those starting with it first. */
  private get filtered(): string[] {
    const query = fold(this.query.trim());
    const available = this.suggestions.filter((s) => !this.value.some((v) => fold(v) === fold(s)));
    if (!query) return available;
    const starts = available.filter((s) => fold(s).startsWith(query));
    const contains = available.filter((s) => !fold(s).startsWith(query) && fold(s).includes(query));
    return [...starts, ...contains];
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

  private clearInput() {
    this.input.value = "";
    this.query = "";
    this.active = -1;
  }

  private commit() {
    this.add(this.input.value);
    this.clearInput();
  }

  private pick(name: string) {
    this.add(name);
    this.clearInput();
    this.input.focus();
  }

  private move(step: number) {
    const count = this.filtered.length;
    this.open = true;
    if (!count) return;
    this.active = this.active < 0 ? (step > 0 ? 0 : count - 1) : (this.active + step + count) % count;
  }

  private onKeydown(event: KeyboardEvent) {
    if (event.isComposing) return;
    const highlighted = this.open ? this.filtered[this.active] : undefined;
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      if (highlighted) this.pick(highlighted);
      else this.commit();
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      this.move(event.key === "ArrowDown" ? 1 : -1);
    } else if (event.key === "Escape" && this.open) {
      event.preventDefault();
      event.stopPropagation();
      this.open = false;
      this.active = -1;
    } else if (event.key === "Backspace" && !this.input.value && this.value.length) {
      this.removeAt(this.value.length - 1);
    }
  }

  private onInput() {
    this.query = this.input.value;
    this.active = -1;
    this.open = true;
  }

  private onBlur() {
    this.commit();
    this.open = false;
  }

  protected updated() {
    this.renderRoot.querySelector(".option.active")?.scrollIntoView?.({ block: "nearest" });
  }

  protected render() {
    const matches = this.filtered;
    const shown = this.open && matches.length > 0;
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
          role="combobox"
          autocomplete="off"
          aria-autocomplete="list"
          aria-controls="suggestions"
          aria-expanded=${shown ? "true" : "false"}
          aria-activedescendant=${shown && this.active >= 0 ? `option-${this.active}` : ""}
          placeholder=${this.placeholder}
          aria-label=${this.placeholder}
          @keydown=${this.onKeydown}
          @input=${this.onInput}
          @focus=${() => (this.open = true)}
          @click=${() => (this.open = true)}
          @blur=${this.onBlur}
        />
        <ul id="suggestions" role="listbox" aria-label=${this.placeholder} ?hidden=${!shown}>
          ${matches.map(
            (name, index) => html`<li
              id="option-${index}"
              class="option ${index === this.active ? "active" : ""}"
              role="option"
              aria-selected=${index === this.active ? "true" : "false"}
              @mousedown=${(e: Event) => e.preventDefault() /* keeps the focus in the field */}
              @mousemove=${() => (this.active = index)}
              @click=${() => this.pick(name)}
            >
              ${name}
            </li>`,
          )}
        </ul>
      </div>
    `;
  }

  static styles = [
    sharedStyles,
    css`
      .field {
        position: relative;
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
      ul {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        right: 0;
        z-index: 5;
        max-height: 240px;
        margin: 0;
        padding: 4px 0;
        overflow-y: auto;
        list-style: none;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
      ul[hidden] {
        display: none;
      }
      .option {
        padding: 8px 12px;
        color: var(--primary-text-color);
        cursor: pointer;
      }
      .option.active {
        background: var(--secondary-background-color);
      }
    `,
  ];
}

if (!customElements.get("cookbook-category-input")) {
  customElements.define("cookbook-category-input", CookbookCategoryInput);
}
