import path from "node:path";
import url from "node:url";

import { defineConfig } from "vite";

import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import eslint from "vite-plugin-eslint";
import tsconfigPaths from "vite-tsconfig-paths";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true,
      },
    }),
    eslint({
      exclude: path.resolve(__dirname, "../shared/**/*"),
    }),
    svgLoader(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@icons": path.resolve(__dirname, "./src/assets/icons"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@core": path.resolve(__dirname, "./src/features/core"),
    },
  },
});
