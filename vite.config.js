import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "./back/public/",
    minify: true,
    target: "es2015",
  },
});
