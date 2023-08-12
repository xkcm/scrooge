import path from "node:path";
import url from "node:url";

import { defineConfig } from "vite";

import vue from "@vitejs/plugin-vue";
import viteDts from "vite-plugin-dts";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "./src/main.ts",
      formats: ["es"],
      name: "UiLibrary",
      fileName: "main",
    },
    rollupOptions: {
      external: ["vue", "@iconify/vue"],
      output: {
        globals: {
          Vue: "vue",
        },
      },
    },
  },
  plugins: [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    }),
    viteDts({
      outDir: "./dist",
      entryRoot: "./src",
      compilerOptions: {
        sourceMap: true,
        declarationMap: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
