import { LitElement, css, html, nothing } from "lit";
import { repeat } from "lit/directives/repeat.js";
import Sortable from "sortablejs/modular/sortable.core.esm.js";
import { type Row, itemsToRows, moveRow, newRow, rowsToItems, splitPastedLines } from "../editor-rows";
import { sharedStyles } from "../styles";
import type { RecipeItem } from "../types";

export interface ItemListLabels {
  itemPlaceholder: string;
  sectionPlaceholder: string;
  addItem: string;
  addSection: string;
  moveUp: string;
  moveDown: string;
  remove: string;
  drag: string;
}

type Field = HTMLInputElement | HTMLTextAreaElement;

/**
 * Editable list of ingredients or steps, with sections.
 * Enter adds a line, Backspace on an empty line removes it, pasting several lines splits them,
 * rows can be dragged (handle) or moved with the arrow buttons. Fires "items-changed".
 */
export class CookbookItemListEditor extends LitElement {
  static properties = {
    items: { attribute: false },
    multiline: { type: Boolean },
    numbered: { type: Boolean },
    labels: { attribute: false },
    rows: { state: true },
  };

  items: RecipeItem[] = [];
  multiline = false;
  numbered = false;
  labels!: ItemListLabels;
  rows: Row[] = [newRow("item")];

  private lastEmitted?: RecipeItem[];
  private sortable?: Sortable;
  private focusAfterRender?: { id: number; atEnd: boolean };

  protected willUpdate(changed: Map<string, unknown>) {
    // Rebuild rows only when the parent gives new items, not when it echoes ours back.
    if (changed.has("items") && this.items !== this.lastEmitted) {
      const rows = itemsToRows(this.items);
      this.rows = rows.length ? rows : [newRow("item")];
    }
  }

  protected firstUpdated() {
    const list = this.renderRoot.querySelector<HTMLElement>("ol")!;
    this.sortable = Sortable.create(list, {
      handle: ".handle",
      animation: 150,
      onEnd: ({ oldIndex, newIndex, item, from }) => {
        if (oldIndex == null || newIndex == null || oldIndex === newIndex) return;
        // Put the node back where Lit expects it, then let Lit re-render from the new order.
        from.removeChild(item);
        from.insertBefore(item, from.children[oldIndex] ?? null);
        this.setRows(moveRow(this.rows, oldIndex, newIndex));
      },
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.sortable?.destroy();
    this.sortable = undefined;
  }

  protected updated() {
    if (!this.focusAfterRender) return;
    const { id, atEnd } = this.focusAfterRender;
    this.focusAfterRender = undefined;
    const field = this.renderRoot.querySelector<Field>(`[data-row="${id}"]`);
    if (!field) return;
    field.focus();
    const position = atEnd ? field.value.length : 0;
    field.setSelectionRange(position, position);
  }

  private setRows(rows: Row[]) {
    this.rows = rows;
    const items = rowsToItems(rows);
    this.lastEmitted = items;
    this.items = items;
    this.dispatchEvent(new CustomEvent("items-changed", { detail: { items } }));
  }

  private insertAfter(index: number, newRows: Row[], focus: Row = newRows.at(-1)!) {
    const rows = [...this.rows];
    rows.splice(index + 1, 0, ...newRows);
    this.focusAfterRender = { id: focus.id, atEnd: true };
    this.setRows(rows);
  }

  addRow(kind: Row["kind"]) {
    this.insertAfter(this.rows.length - 1, [newRow(kind)]);
  }

  private onInput(index: number, event: Event) {
    const field = event.target as Field;
    const rows = [...this.rows];
    rows[index] = { ...rows[index], text: field.value };
    this.setRows(rows);
    if (field instanceof HTMLTextAreaElement) this.autoGrow(field);
  }

  private onKeydown(index: number, event: KeyboardEvent) {
    const row = this.rows[index];
    if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      this.insertAfter(index, [newRow("item")]);
    } else if (event.key === "Backspace" && row.text === "" && this.rows.length > 1) {
      event.preventDefault();
      this.removeRow(index);
    }
  }

  private onPaste(index: number, event: ClipboardEvent) {
    const lines = splitPastedLines(event.clipboardData?.getData("text/plain") ?? "");
    if (lines.length < 2) return; // a single line: default paste
    event.preventDefault();
    const row = this.rows[index];
    const rows = [...this.rows];
    // The current line takes the first pasted line (appended if it already has text).
    rows[index] = { ...row, text: row.text ? `${row.text} ${lines[0]}` : lines[0] };
    const added = lines.slice(1).map((line) => newRow("item", line));
    rows.splice(index + 1, 0, ...added);
    this.focusAfterRender = { id: added.at(-1)!.id, atEnd: true };
    this.setRows(rows);
  }

  private removeRow(index: number) {
    const rows = this.rows.filter((_, i) => i !== index);
    const focus = rows[Math.max(0, index - 1)];
    if (focus) this.focusAfterRender = { id: focus.id, atEnd: true };
    this.setRows(rows.length ? rows : [newRow("item")]);
  }

  private move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= this.rows.length) return;
    this.setRows(moveRow(this.rows, index, target));
  }

  private autoGrow(field: HTMLTextAreaElement) {
    field.style.height = "auto";
    field.style.height = `${field.scrollHeight}px`;
  }

  protected render() {
    let number = 0;
    return html`
      <ol>
        ${repeat(
          this.rows,
          (row) => row.id,
          (row, index) => {
            const isSection = row.kind === "section";
            if (!isSection) number++;
            const common = {
              placeholder: isSection ? this.labels.sectionPlaceholder : this.labels.itemPlaceholder,
            };
            return html`<li class=${row.kind}>
              <span class="handle" title=${this.labels.drag} aria-hidden="true">
                <ha-icon icon="mdi:drag"></ha-icon>
              </span>
              ${this.numbered && !isSection ? html`<span class="number">${number}</span>` : nothing}
              ${this.multiline && !isSection
                ? html`<textarea
                    rows="1"
                    data-row=${row.id}
                    .value=${row.text}
                    placeholder=${common.placeholder}
                    aria-label=${common.placeholder}
                    @input=${(e: Event) => this.onInput(index, e)}
                    @keydown=${(e: KeyboardEvent) => this.onKeydown(index, e)}
                    @paste=${(e: ClipboardEvent) => this.onPaste(index, e)}
                  ></textarea>`
                : html`<input
                    data-row=${row.id}
                    .value=${row.text}
                    placeholder=${common.placeholder}
                    aria-label=${common.placeholder}
                    @input=${(e: Event) => this.onInput(index, e)}
                    @keydown=${(e: KeyboardEvent) => this.onKeydown(index, e)}
                    @paste=${(e: ClipboardEvent) => this.onPaste(index, e)}
                  />`}
              <span class="row-actions">
                <button
                  class="icon up"
                  aria-label=${this.labels.moveUp}
                  ?disabled=${index === 0}
                  @click=${() => this.move(index, -1)}
                >
                  <ha-icon icon="mdi:chevron-up"></ha-icon>
                </button>
                <button
                  class="icon down"
                  aria-label=${this.labels.moveDown}
                  ?disabled=${index === this.rows.length - 1}
                  @click=${() => this.move(index, 1)}
                >
                  <ha-icon icon="mdi:chevron-down"></ha-icon>
                </button>
                <button class="icon remove" aria-label=${this.labels.remove} @click=${() => this.removeRow(index)}>
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              </span>
            </li>`;
          },
        )}
      </ol>
      <div class="add">
        <button class="btn add-item" @click=${() => this.addRow("item")}>
          <ha-icon icon="mdi:plus"></ha-icon>${this.labels.addItem}
        </button>
        <button class="btn add-section" @click=${() => this.addRow("section")}>
          <ha-icon icon="mdi:format-header-pound"></ha-icon>${this.labels.addSection}
        </button>
      </div>
    `;
  }

  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }
      ol {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      li {
        display: flex;
        align-items: flex-start;
        gap: 4px;
        padding: 2px 0;
      }
      li.section {
        margin-top: 12px;
      }
      li.sortable-ghost {
        opacity: 0.4;
      }
      .handle {
        flex: none;
        display: flex;
        padding: 8px 2px;
        color: var(--secondary-text-color);
        cursor: grab;
        touch-action: none;
      }
      .number {
        flex: none;
        min-width: 1.6em;
        padding-top: 9px;
        font-weight: 500;
        color: var(--primary-color);
      }
      input,
      textarea {
        flex: 1;
        min-width: 0;
        box-sizing: border-box;
        padding: 8px 10px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font: inherit;
        font-size: 15px;
        line-height: 1.4;
      }
      textarea {
        resize: none;
        overflow: hidden;
      }
      input:focus,
      textarea:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: -1px;
      }
      li.section input {
        font-weight: 500;
        border-style: dashed;
      }
      .row-actions {
        flex: none;
        display: flex;
      }
      .icon {
        display: inline-flex;
        padding: 6px;
        border: 0;
        border-radius: 50%;
        background: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        --mdc-icon-size: 20px;
      }
      .icon:hover:not([disabled]) {
        background: var(--secondary-background-color);
      }
      .icon[disabled] {
        opacity: 0.3;
        cursor: default;
      }
      .add {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
      }
      @media (max-width: 600px) {
        .icon {
          padding: 4px;
        }
      }
    `,
  ];
}

if (!customElements.get("cookbook-item-list-editor")) {
  customElements.define("cookbook-item-list-editor", CookbookItemListEditor);
}
