import { defineConfig } from "vite";

export default defineConfig({
  publicDir: true,
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
