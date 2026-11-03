import { resolve } from "node:path";
import { defineConfig } from "vite";

// Builds a single ES module served by the integration at /cookbook_static/.
export default defineConfig(({ mode }) => ({
  build: {
    outDir: resolve(import.meta.dirname, "../custom_components/cookbook/frontend"),
    emptyOutDir: true,
    sourcemap: mode === "development",
    minify: mode !== "development",
    lib: {
      entry: resolve(import.meta.dirname, "src/cookbook-panel.ts"),
      formats: ["es"],
      fileName: () => "cookbook-panel.js",
    },
  },
}));
