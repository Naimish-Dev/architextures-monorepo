import { defineConfig } from "vite";

export default defineConfig({
  publicDir: true,
  build: {
    outDir: "../backend/public",
    emptyOutDir: true,
  },
});
