import { defineConfig, devices } from "@playwright/test";
import { HA_URL, storageStatePath } from "./e2e/ha-setup";

/**
 * E2E tests against the throwaway HA of `make e2e` (port 8124), never the dev or prod instance.
 * Projects: desktop and mobile (Pixel 7), both logged in as the admin; tests needing the
 * non-admin member open their own context (see fixtures.ts).
 */
export default defineConfig({
  testDir: "e2e",
  globalSetup: "./e2e/ha-setup.ts",
  outputDir: "playwright-output",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]]
    : [["list"], ["html", { open: process.env.OPEN_REPORT ?? "on-failure", outputFolder: "playwright-report" }]],
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: HA_URL,
    locale: "fr-FR",
    timezoneId: "Europe/Paris",
    storageState: storageStatePath("admin"),
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
