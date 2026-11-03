import { LitElement, css, html, nothing } from "lit";
import { CookbookApi, isApiError } from "../api";
import "../components/category-input";
import "../components/confirm-dialog";
import "../components/item-list-editor";
import "../components/photo-input";
import type { ItemListLabels } from "../components/item-list-editor";
import { formatDuration } from "../format";
import { type Localize, type MessageKey, getLocalize } from "../i18n";
import { listUrl, navigate, recipeUrl } from "../router";
import { sharedStyles } from "../styles";
import type { HomeAssistant, Recipe, RecipeFields, RecipeItem } from "../types";

const TIME_FIELDS = ["prep_time", "cook_time", "total_time"] as const;
type TimeField = (typeof TIME_FIELDS)[number];

/** Form state: times are kept as typed (strings) until saved. */
export interface EditorForm {
  name: string;
  description: string;
  categories: string[];
  prep_time: string;
  cook_time: string;
  total_time: string;
  servings: string;
  servings_unit: string;
  notes: string;
  source_url: string;
}

export type FormErrors = Partial<Record<keyof EditorForm, MessageKey>>;

export function formFromRecipe(recipe?: Partial<RecipeFields> | null): EditorForm {
  const time = (value: number | null | undefined) => (value == null ? "" : String(value));
  return {
    name: recipe?.name ?? "",
    description: recipe?.description ?? "",
    categories: [...(recipe?.categories ?? [])],
    prep_time: time(recipe?.prep_time),
    cook_time: time(recipe?.cook_time),
    total_time: time(recipe?.total_time),
    servings: recipe?.servings == null ? "" : String(recipe.servings),
    servings_unit: recipe?.servings_unit ?? "",
    notes: recipe?.notes ?? "",
    source_url: recipe?.source_url ?? "",
  };
}

/** "" -> null, "45" -> 45, anything else -> undefined (invalid). */
export function parseMinutes(value: string): number | null | undefined {
  const text = value.trim();
  if (!text) return null;
  return /^\d{1,5}$/.test(text) ? Number(text) : undefined;
}

/** "" -> null, "4" -> 4, anything else (0, 2.5, "4 pers.") -> undefined (invalid). */
export function parseServings(value: string): number | null | undefined {
  const text = value.trim();
  if (!text) return null;
  const count = /^\d{1,4}$/.test(text) ? Number(text) : NaN;
  return count >= 1 && count <= 1000 ? count : undefined;
}

export function validate(form: EditorForm): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "name_required";
  if (parseServings(form.servings) === undefined) errors.servings = "servings_invalid";
  for (const field of TIME_FIELDS) {
    if (parseMinutes(form[field]) === undefined) errors[field] = "minutes_invalid";
  }
  const url = form.source_url.trim();
  if (url && !/^https?:\/\//i.test(url)) errors.source_url = "source_url_invalid";
  return errors;
}

/**
 * Form + lists -> payload of cookbook/create / cookbook/update (call after validate).
 * A number of servings without unit gets `defaultUnit` ("personnes").
 */
export function toFields(
  form: EditorForm,
  ingredients: RecipeItem[],
  steps: RecipeItem[],
  defaultUnit: string | null = null,
): RecipeFields {
  const text = (value: string) => value.trim() || null;
  const servings = parseServings(form.servings) ?? null;
  return {
    name: form.name.trim(),
    description: text(form.description),
    categories: form.categories,
    prep_time: parseMinutes(form.prep_time) ?? null,
    cook_time: parseMinutes(form.cook_time) ?? null,
    total_time: parseMinutes(form.total_time) ?? null,
    servings,
    servings_unit: text(form.servings_unit) ?? (servings ? defaultUnit : null),
    ingredients,
    steps,
    notes: text(form.notes),
    source_url: text(form.source_url),
  };
}

/** Pending change of the photo, applied after the recipe itself is saved. */
export type PhotoChange =
  | { kind: "keep" }
  | { kind: "file"; file: File; preview: string }
  | { kind: "url"; url: string }
  | { kind: "remove" };

/** Recipe creation (no recipeId) and edition. */
export class CookbookRecipeEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    recipeId: { attribute: "recipe-id" },
    form: { state: true },
    ingredients: { state: true },
    steps: { state: true },
    errors: { state: true },
    loading: { state: true },
    notFound: { state: true },
    error: { state: true },
    saving: { state: true },
    conflict: { state: true },
    leaveTarget: { state: true },
    duplicateOf: { state: true },
    suggestions: { state: true },
    draft: { attribute: false },
    draftImageUrl: { attribute: false },
    importedFrom: { attribute: false },
    photo: { state: true },
  };

  hass!: HomeAssistant;
  recipeId?: string;
  form: EditorForm = formFromRecipe();
  ingredients: RecipeItem[] = [];
  steps: RecipeItem[] = [];
  errors: FormErrors = {};
  loading = false;
  notFound = false;
  error: string | null = null;
  saving = false;
  conflict: { latest: Recipe } | null = null;
  leaveTarget: string | null = null;
  /** Recipe that already has the source URL (save refused by the server). */
  duplicateOf: { id: string; name: string } | null = null;
  suggestions: string[] = [];
  /** Prefilled, not yet saved recipe (URL import preview): a new recipe, dirty from the start. */
  draft?: RecipeFields;
  /** Photo of the imported page, downloaded by the server on save. */
  draftImageUrl?: string | null;
  /** Site name shown in the "imported from" banner. */
  importedFrom?: string;
  photo: PhotoChange = { kind: "keep" };

  /** Last loaded/saved version: base of the conflict check and of the dirty state. */
  private original: Recipe | null = null;
  private snapshot = "";

  private onBeforeUnload = (event: BeforeUnloadEvent) => {
    if (this.dirty) event.preventDefault();
  };

  private onShortcut = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "s") {
      event.preventDefault();
      void this.save();
    }
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("beforeunload", this.onBeforeUnload);
    window.addEventListener("keydown", this.onShortcut);
    void this.api
      .categories()
      .then((categories) => (this.suggestions = categories.map((c) => c.name)))
      .catch(() => undefined);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("beforeunload", this.onBeforeUnload);
    window.removeEventListener("keydown", this.onShortcut);
    this.setPhoto({ kind: "keep" }); // releases the preview object URL
  }

  private setPhoto(photo: PhotoChange) {
    if (this.photo.kind === "file") URL.revokeObjectURL(this.photo.preview);
    this.photo = photo;
  }

  /** Photo shown in the editor: pending change, or the saved one. */
  private get photoSrc(): string | null {
    switch (this.photo.kind) {
      case "file":
        return this.photo.preview;
      case "url":
        return this.photo.url;
      case "remove":
        return null;
      default:
        return this.original?.image_url ?? null;
    }
  }

  private onPhotoChanged(file: File | null) {
    if (file) this.setPhoto({ kind: "file", file, preview: URL.createObjectURL(file) });
    else if (this.original?.image) this.setPhoto({ kind: "remove" });
    else this.setPhoto({ kind: "keep" });
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has("recipeId") || changed.has("draft")) {
      if (this.recipeId) void this.load(this.recipeId);
      else this.reset(null, this.draft);
    }
  }

  private get api() {
    return new CookbookApi(this.hass);
  }

  private get t(): Localize {
    return getLocalize(this.hass);
  }

  private currentFields(): RecipeFields {
    return toFields(this.form, this.ingredients, this.steps, this.t("servings_unit_default"));
  }

  /** True when the form differs from the last loaded/saved version. */
  get dirty(): boolean {
    return this.photo.kind !== "keep" || JSON.stringify(this.currentFields()) !== this.snapshot;
  }

  /** Leave the editor, asking first if there are unsaved changes. */
  requestLeave(url: string) {
    if (this.dirty) this.leaveTarget = url;
    else navigate(url);
  }

  private get backUrl(): string {
    return this.recipeId ? recipeUrl(this.recipeId) : listUrl();
  }

  /** Loads a saved recipe, or an empty form / a draft for a new one. */
  private reset(recipe: Recipe | null, draft?: RecipeFields) {
    this.original = recipe;
    this.form = formFromRecipe(recipe);
    this.ingredients = recipe ? recipe.ingredients.map((i) => ({ ...i })) : [];
    this.steps = recipe ? recipe.steps.map((s) => ({ ...s })) : [];
    this.errors = {};
    this.conflict = null;
    this.setPhoto({ kind: "keep" });
    this.snapshot = JSON.stringify(this.currentFields());
    if (draft && this.draftImageUrl) this.setPhoto({ kind: "url", url: this.draftImageUrl });
    if (draft) {
      // Snapshot of the empty form: the draft counts as unsaved changes.
      this.form = formFromRecipe(draft);
      this.ingredients = draft.ingredients.map((i) => ({ ...i }));
      this.steps = draft.steps.map((s) => ({ ...s }));
    }
  }

  private async load(id: string) {
    this.loading = true;
    this.notFound = false;
    this.error = null;
    try {
      const recipe = await this.api.get(id);
      if (id === this.recipeId) this.reset(recipe);
    } catch (error) {
      if (id !== this.recipeId) return;
      if (isApiError(error) && error.code === "not_found") this.notFound = true;
      else this.showError(error);
    } finally {
      if (id === this.recipeId) this.loading = false;
    }
  }

  private showError(error: unknown) {
    const message = isApiError(error) ? error.message : String(error);
    this.error = this.t("error", { message });
  }

  private setField<K extends keyof EditorForm>(field: K, value: EditorForm[K]) {
    this.form = { ...this.form, [field]: value };
    if (this.errors[field]) {
      const errors = { ...this.errors };
      delete errors[field];
      this.errors = errors;
    }
  }

  async save(options: { overwrite?: boolean } = {}) {
    if (this.saving) return;
    const errors = validate(this.form);
    this.errors = errors;
    if (Object.keys(errors).length) {
      await this.updateComplete;
      this.renderRoot.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    this.saving = true;
    this.error = null;
    this.duplicateOf = null;
    const fields = this.currentFields();
    try {
      const saved = this.original
        ? await this.api.update(
            this.original.id,
            fields,
            options.overwrite ? undefined : this.original.updated_at,
          )
        : await this.api.create(fields);
      this.original = saved;
      this.snapshot = JSON.stringify(fields);
      this.conflict = null;
      // The recipe is saved; then the photo. If it fails, stay here (retry by saving again).
      if (!(await this.applyPhoto(saved.id))) return;
      navigate(recipeUrl(saved.id), { replace: true });
    } catch (error) {
      const placeholders = isApiError(error) ? error.translation_placeholders : undefined;
      if (isApiError(error) && error.code === "duplicate_source" && placeholders) {
        this.duplicateOf = { id: placeholders.recipe_id, name: placeholders.name };
        this.errors = { ...this.errors, source_url: "duplicate_source_field" };
      } else if (isApiError(error) && error.code === "conflict" && this.original) {
        try {
          this.conflict = { latest: await this.api.get(this.original.id) };
        } catch (inner) {
          this.showError(inner);
        }
      } else {
        this.showError(error);
      }
    } finally {
      this.saving = false;
    }
  }

  /** Sends the pending photo change; false (and a message) if it failed. */
  private async applyPhoto(recipeId: string): Promise<boolean> {
    const photo = this.photo;
    try {
      let saved: Recipe | null = null;
      if (photo.kind === "file") saved = await this.api.uploadImage(recipeId, photo.file);
      else if (photo.kind === "url") saved = await this.api.importImage(recipeId, photo.url);
      else if (photo.kind === "remove") saved = await this.api.removeImage(recipeId);
      if (saved) this.original = saved;
      this.setPhoto({ kind: "keep" });
      return true;
    } catch (error) {
      const message = isApiError(error) ? error.message : String(error);
      this.error = this.t("photo_failed", { message });
      return false;
    }
  }

  private get listLabels(): { ingredients: ItemListLabels; steps: ItemListLabels } {
    const t = this.t;
    const common = {
      sectionPlaceholder: t("section_placeholder"),
      addSection: t("add_section"),
      moveUp: t("move_up"),
      moveDown: t("move_down"),
      remove: t("remove_line"),
      drag: t("drag"),
    };
    return {
      ingredients: { ...common, itemPlaceholder: t("ingredient_placeholder"), addItem: t("add_ingredient") },
      steps: { ...common, itemPlaceholder: t("step_placeholder"), addItem: t("add_step") },
    };
  }

  protected render() {
    const t = this.t;
    if (this.notFound) {
      return html`<div class="message">
        <p>${t("recipe_not_found")}</p>
        <button class="btn" @click=${() => navigate(listUrl())}>${t("back_to_list")}</button>
      </div>`;
    }
    if (this.loading) return html`<p class="message">${t("loading")}</p>`;
    const labels = this.listLabels;
    return html`
      <h1>${this.recipeId ? t("edit_recipe") : t("new_recipe")}</h1>
      ${this.importedFrom
        ? html`<p class="banner imported" role="status">
            <ha-icon icon="mdi:web-check"></ha-icon>${t("imported_from", { site: this.importedFrom })}
          </p>`
        : nothing}
      ${this.conflict ? this.renderConflict(t) : nothing}
      ${this.duplicateOf
        ? html`<div class="banner duplicate" role="alert">
            <p>${t("duplicate_source_text", { name: this.duplicateOf.name })}</p>
            <div class="banner-actions">
              <button class="btn open-duplicate" @click=${() => this.requestLeave(recipeUrl(this.duplicateOf!.id))}>
                ${t("duplicate_open")}
              </button>
            </div>
          </div>`
        : nothing}
      ${this.error ? html`<p class="banner error" role="alert">${this.error}</p>` : nothing}

      <section class="card photo">
        <cookbook-photo-input
          .src=${this.photoSrc}
          .labels=${{
            add: t("add_photo"),
            replace: t("replace_photo"),
            remove: t("remove_photo"),
            dropHint: t("photo_drop_hint"),
            invalid: t("photo_invalid"),
            tooLarge: t("photo_too_large"),
          }}
          @photo-changed=${(e: CustomEvent<{ file: File | null }>) => this.onPhotoChanged(e.detail.file)}
        ></cookbook-photo-input>
      </section>

      <section class="card">
        ${this.renderText("name", t("name"), { required: true, autofocus: !this.recipeId })}
        ${this.renderText("description", t("description"), { multiline: true })}
        <label class="field">
          <span class="label">${t("categories")}</span>
          <cookbook-category-input
            .value=${this.form.categories}
            .suggestions=${this.suggestions}
            .placeholder=${t("category_placeholder")}
            .removeLabel=${(name: string) => t("remove_category", { name })}
            @value-changed=${(e: CustomEvent<{ value: string[] }>) => this.setField("categories", e.detail.value)}
          ></cookbook-category-input>
        </label>
        <div class="times">
          ${TIME_FIELDS.map((field) => this.renderTime(field, t))}
          ${this.renderServings(t)}
        </div>
      </section>

      <section class="card">
        <h2>${t("ingredients")}</h2>
        <cookbook-item-list-editor
          class="ingredients"
          .items=${this.ingredients}
          .labels=${labels.ingredients}
          @items-changed=${(e: CustomEvent<{ items: RecipeItem[] }>) => (this.ingredients = e.detail.items)}
        ></cookbook-item-list-editor>
        <p class="muted hint">${t("editor_hint")}</p>
      </section>

      <section class="card">
        <h2>${t("steps")}</h2>
        <cookbook-item-list-editor
          class="steps"
          multiline
          numbered
          .items=${this.steps}
          .labels=${labels.steps}
          @items-changed=${(e: CustomEvent<{ items: RecipeItem[] }>) => (this.steps = e.detail.items)}
        ></cookbook-item-list-editor>
      </section>

      <section class="card">
        ${this.renderText("notes", t("notes"), { multiline: true })}
        ${this.renderText("source_url", t("source_url"), { type: "url", placeholder: "https://" })}
      </section>

      <div class="bar">
        <button class="btn cancel" @click=${() => this.requestLeave(this.backUrl)}>${t("cancel")}</button>
        <button class="btn primary save" ?disabled=${this.saving} @click=${() => this.save()}>
          <ha-icon icon="mdi:content-save-outline"></ha-icon>${this.saving ? t("saving") : t("save")}
        </button>
      </div>

      <cookbook-confirm-dialog
        .open=${this.leaveTarget !== null}
        .heading=${t("leave_title")}
        .text=${t("leave_text")}
        .confirmLabel=${t("leave_confirm")}
        .cancelLabel=${t("cancel")}
        @confirm=${this.confirmLeave}
        @cancel=${() => (this.leaveTarget = null)}
      ></cookbook-confirm-dialog>
    `;
  }

  private confirmLeave() {
    const url = this.leaveTarget ?? listUrl();
    this.leaveTarget = null;
    this.snapshot = JSON.stringify(this.currentFields()); // no beforeunload prompt any more
    navigate(url);
  }

  private renderConflict(t: Localize) {
    const name = this.conflict!.latest.updated_by_name;
    return html`<div class="banner conflict" role="alert">
      <p>${name ? t("conflict_text", { name }) : t("conflict_text_anonymous")}</p>
      <div class="banner-actions">
        <button class="btn reload" @click=${() => this.reset(this.conflict!.latest)}>${t("conflict_reload")}</button>
        <button class="btn danger overwrite" @click=${() => this.save({ overwrite: true })}>
          ${t("conflict_overwrite")}
        </button>
      </div>
    </div>`;
  }

  private renderText(
    field: "name" | "description" | "notes" | "source_url",
    label: string,
    options: { multiline?: boolean; required?: boolean; autofocus?: boolean; placeholder?: string; type?: string } = {},
  ) {
    const error = this.errors[field];
    const onInput = (e: Event) => this.setField(field, (e.target as HTMLInputElement).value);
    return html`<label class="field">
      <span class="label">${label}${options.required ? " *" : ""}</span>
      ${options.multiline
        ? html`<textarea
            name=${field}
            rows="3"
            .value=${this.form[field]}
            aria-invalid=${error ? "true" : "false"}
            @input=${onInput}
          ></textarea>`
        : html`<input
            name=${field}
            type=${options.type ?? "text"}
            .value=${this.form[field]}
            placeholder=${options.placeholder ?? ""}
            ?autofocus=${options.autofocus}
            aria-invalid=${error ? "true" : "false"}
            @input=${onInput}
          />`}
      ${error ? html`<span class="field-error">${this.t(error)}</span>` : nothing}
    </label>`;
  }

  /** "Pour [4] [personnes]": number (enables scaling) and free unit with suggestions. */
  private renderServings(t: Localize) {
    const error = this.errors.servings;
    const suggestions = t("servings_unit_suggestions").split(",");
    return html`<div class="field servings">
      <span class="label">${t("servings")}</span>
      <div class="servings-inputs">
        <input
          name="servings"
          inputmode="numeric"
          aria-label=${t("servings")}
          .value=${this.form.servings}
          aria-invalid=${error ? "true" : "false"}
          @input=${(e: Event) => this.setField("servings", (e.target as HTMLInputElement).value)}
        />
        <input
          name="servings_unit"
          list="servings-units"
          aria-label=${t("servings_unit")}
          placeholder=${t("servings_unit_default")}
          .value=${this.form.servings_unit}
          @input=${(e: Event) => this.setField("servings_unit", (e.target as HTMLInputElement).value)}
        />
        <datalist id="servings-units">${suggestions.map((u) => html`<option value=${u}></option>`)}</datalist>
      </div>
      ${error ? html`<span class="field-error">${t(error)}</span>` : nothing}
    </div>`;
  }

  private renderTime(field: TimeField, t: Localize) {
    let placeholder = "";
    if (field === "total_time" && !this.form.total_time.trim()) {
      const prep = parseMinutes(this.form.prep_time);
      const cook = parseMinutes(this.form.cook_time);
      if (prep != null || cook != null) {
        placeholder = t("total_auto", { value: formatDuration((prep ?? 0) + (cook ?? 0), t) });
      }
    }
    const error = this.errors[field];
    return html`<label class="field">
      <span class="label">${t(field)} (min)</span>
      <input
        name=${field}
        inputmode="numeric"
        .value=${this.form[field]}
        placeholder=${placeholder}
        aria-invalid=${error ? "true" : "false"}
        @input=${(e: Event) => this.setField(field, (e.target as HTMLInputElement).value)}
      />
      ${error ? html`<span class="field-error">${t(error)}</span>` : nothing}
    </label>`;
  }

  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        padding: var(--cb-gap);
        max-width: 900px;
        margin: 0 auto;
        box-sizing: border-box;
      }
      h1 {
        margin: 0 0 var(--cb-gap);
        font-size: 24px;
        font-weight: 500;
      }
      h2 {
        margin: 0 0 8px;
        font-size: 18px;
        font-weight: 500;
      }
      section {
        padding: 16px;
        margin-bottom: var(--cb-gap);
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 12px;
      }
      .label {
        font-size: 13px;
        color: var(--secondary-text-color);
      }
      .servings-inputs {
        display: flex;
        gap: 6px;
      }
      .servings-inputs input:first-child {
        width: 4.5em;
        flex: none;
      }
      .servings-inputs input:not(:first-child) {
        flex: 1;
        min-width: 0;
      }
      .field > input,
      .field > textarea,
      .servings-inputs input {
        box-sizing: border-box;
        width: 100%;
        padding: 9px 10px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font: inherit;
        font-size: 15px;
      }
      .field > textarea {
        resize: vertical;
      }
      .field > input:focus,
      .field > textarea:focus,
      .servings-inputs input:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: -1px;
      }
      [aria-invalid="true"] {
        border-color: var(--error-color) !important;
      }
      .field-error {
        font-size: 13px;
        color: var(--error-color);
      }
      .times {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 0 12px;
      }
      .hint {
        margin: 8px 0 0;
        font-size: 13px;
      }
      .banner {
        padding: 12px 16px;
        margin: 0 0 var(--cb-gap);
        border-radius: var(--cb-radius);
        border: 1px solid var(--error-color);
      }
      .banner p {
        margin: 0;
      }
      .conflict {
        border-color: var(--warning-color, #ffa600);
      }
      .imported {
        display: flex;
        align-items: center;
        gap: 8px;
        border-color: var(--primary-color);
        --mdc-icon-size: 20px;
      }
      .imported ha-icon {
        color: var(--primary-color);
      }
      .banner-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
      }
      .bar {
        position: sticky;
        z-index: 3;
        bottom: 0;
        margin: 0 calc(-1 * var(--cb-gap));
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
        background: var(--card-background-color);
        border-top: 1px solid var(--divider-color);
      }
      .btn[disabled] {
        opacity: 0.6;
        cursor: default;
      }
    `,
  ];
}

if (!customElements.get("cookbook-recipe-editor")) {
  customElements.define("cookbook-recipe-editor", CookbookRecipeEditor);
}
