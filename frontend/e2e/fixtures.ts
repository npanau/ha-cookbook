import { type Browser, type Locator, type Page, test as base, expect } from "@playwright/test";
import type { Recipe, RecipeFields } from "../src/types";
import { storageStatePath } from "./ha-setup";

export { expect };

/** Helpers bound to one page: navigation inside the panel and direct API calls. */
export class Cookbook {
  constructor(readonly page: Page) {}

  /** The panel root: every locator is scoped to it (HA's own UI is around). */
  get panel(): Locator {
    return this.page.locator("cookbook-panel");
  }

  async goto(path = "") {
    await this.page.goto(`/cookbook${path}`);
    await expect(this.panel.locator(".toolbar")).toBeVisible();
  }

  /** Calls a cookbook/* command as the logged-in user, through the HA frontend connection. */
  callWS<T>(msg: Record<string, unknown>): Promise<T> {
    return this.page.evaluate(async (message) => {
      const app = document.querySelector("home-assistant") as unknown as {
        hass?: { callWS(m: unknown): Promise<unknown> };
      };
      for (let i = 0; i < 100 && !app?.hass; i++) await new Promise((r) => setTimeout(r, 100));
      return app.hass!.callWS(message);
    }, msg) as Promise<T>;
  }

  createRecipe(fields: Partial<RecipeFields> & { name: string }): Promise<Recipe> {
    return this.callWS<Recipe>({ type: "cookbook/create", ...fields });
  }

  /** Toolbar-side "New recipe" button (the empty state has a second one). */
  newRecipeButton(): Locator {
    return this.panel.locator("cookbook-recipe-list .top").getByRole("button", { name: "Nouvelle recette" });
  }

  editor(): Locator {
    return this.panel.locator("cookbook-recipe-editor");
  }

  sheet(): Locator {
    return this.panel.locator("cookbook-recipe-view");
  }

  /** Pastes text in a field the way a browser does (ClipboardEvent with text/plain). */
  async paste(field: Locator, text: string) {
    await field.evaluate((element, value) => {
      const data = new DataTransfer();
      data.setData("text/plain", value);
      element.dispatchEvent(new ClipboardEvent("paste", { clipboardData: data, bubbles: true, cancelable: true }));
    }, text);
  }

  async search(text: string) {
    await this.panel.getByRole("searchbox").fill(text);
  }

  cards(): Locator {
    return this.panel.locator("cookbook-recipe-list a.recipe");
  }
}

interface Fixtures {
  /** Unique per test and project: tests run in parallel against the same HA. */
  uid: string;
  cookbook: Cookbook;
  /** A second page logged in as the non-admin member. */
  member: Cookbook;
}

async function memberPage(browser: Browser, use: (page: Page) => Promise<void>) {
  const context = await browser.newContext({ storageState: storageStatePath("member"), locale: "fr-FR" });
  await use(await context.newPage());
  await context.close();
}

export const test = base.extend<Fixtures>({
  uid: async ({}, use, testInfo) => {
    await use(`${testInfo.project.name[0]}${testInfo.workerIndex}${Date.now().toString(36)}`);
  },
  cookbook: async ({ page }, use) => {
    await use(new Cookbook(page));
  },
  member: async ({ browser }, use) => {
    await memberPage(browser, (page) => use(new Cookbook(page)));
  },
});
