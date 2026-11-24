import { defineConfig } from "@playwright/test";

/** README screenshots (`make screenshots`), on the throwaway E2E Home Assistant (port 8124). */
export default defineConfig({
  testDir: "screenshots",
  globalSetup: "./e2e/ha-setup.ts",
  outputDir: "playwright-output",
  workers: 1,
  timeout: 120_000,
  expect: { timeout: 15_000 },
  reporter: "list",
});
