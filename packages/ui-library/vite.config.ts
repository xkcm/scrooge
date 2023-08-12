import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import viteDts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: "inline",
    lib: {
      entry: "./src/main.ts",
      formats: ["es"],
      name: "UiLibrary",
      fileName: "main",
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          Vue: "vue",
        },
      },
    },
  },
  plugins: [
    vue(),
    viteDts({
      outDir: "./dist",
      entryRoot: "./src",
      compilerOptions: {
        sourceMap: true,
        declarationMap: true,
      },
    }),
  ],
});
