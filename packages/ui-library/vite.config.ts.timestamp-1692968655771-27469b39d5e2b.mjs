// vite.config.ts
import path from "node:path";
import url from "node:url";
import { defineConfig } from "file:///home/xkcm/Desktop/projects/scrooge/node_modules/.pnpm/vite@4.4.5/node_modules/vite/dist/node/index.js";
import vue from "file:///home/xkcm/Desktop/projects/scrooge/node_modules/.pnpm/@vitejs+plugin-vue@4.2.3_vite@4.4.5_vue@3.3.4/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import viteDts from "file:///home/xkcm/Desktop/projects/scrooge/node_modules/.pnpm/vite-plugin-dts@3.5.2_typescript@5.1.6_vite@4.4.5/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///home/xkcm/Desktop/projects/scrooge/packages/ui-library/vite.config.ts";
var __dirname = path.dirname(url.fileURLToPath(__vite_injected_original_import_meta_url));
var vite_config_default = defineConfig({
  build: {
    lib: {
      entry: "./src/main.ts",
      formats: ["es"],
      name: "UiLibrary",
      fileName: "main"
    },
    rollupOptions: {
      external: ["vue", "@iconify/vue"],
      output: {
        globals: {
          Vue: "vue"
        }
      }
    }
  },
  plugins: [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true
      }
    }),
    viteDts({
      outDir: "./dist",
      entryRoot: "./src",
      compilerOptions: {
        sourceMap: true,
        declarationMap: true
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS94a2NtL0Rlc2t0b3AvcHJvamVjdHMvc2Nyb29nZS9wYWNrYWdlcy91aS1saWJyYXJ5XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS94a2NtL0Rlc2t0b3AvcHJvamVjdHMvc2Nyb29nZS9wYWNrYWdlcy91aS1saWJyYXJ5L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3hrY20vRGVza3RvcC9wcm9qZWN0cy9zY3Jvb2dlL3BhY2thZ2VzL3VpLWxpYnJhcnkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tIFwibm9kZTpwYXRoXCI7XG5pbXBvcnQgdXJsIGZyb20gXCJub2RlOnVybFwiO1xuXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuXG5pbXBvcnQgdnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcbmltcG9ydCB2aXRlRHRzIGZyb20gXCJ2aXRlLXBsdWdpbi1kdHNcIjtcblxuY29uc3QgX19kaXJuYW1lID0gcGF0aC5kaXJuYW1lKHVybC5maWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCkpO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYnVpbGQ6IHtcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiBcIi4vc3JjL21haW4udHNcIixcbiAgICAgIGZvcm1hdHM6IFtcImVzXCJdLFxuICAgICAgbmFtZTogXCJVaUxpYnJhcnlcIixcbiAgICAgIGZpbGVOYW1lOiBcIm1haW5cIixcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGV4dGVybmFsOiBbXCJ2dWVcIiwgXCJAaWNvbmlmeS92dWVcIl0sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgZ2xvYmFsczoge1xuICAgICAgICAgIFZ1ZTogXCJ2dWVcIixcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHZ1ZSh7XG4gICAgICBzY3JpcHQ6IHtcbiAgICAgICAgZGVmaW5lTW9kZWw6IHRydWUsXG4gICAgICAgIHByb3BzRGVzdHJ1Y3R1cmU6IHRydWUsXG4gICAgICB9LFxuICAgIH0pLFxuICAgIHZpdGVEdHMoe1xuICAgICAgb3V0RGlyOiBcIi4vZGlzdFwiLFxuICAgICAgZW50cnlSb290OiBcIi4vc3JjXCIsXG4gICAgICBjb21waWxlck9wdGlvbnM6IHtcbiAgICAgICAgc291cmNlTWFwOiB0cnVlLFxuICAgICAgICBkZWNsYXJhdGlvbk1hcDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSksXG4gIF0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjXCIpLFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVYsT0FBTyxVQUFVO0FBQ3hXLE9BQU8sU0FBUztBQUVoQixTQUFTLG9CQUFvQjtBQUU3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxhQUFhO0FBTmtNLElBQU0sMkNBQTJDO0FBUXZRLElBQU0sWUFBWSxLQUFLLFFBQVEsSUFBSSxjQUFjLHdDQUFlLENBQUM7QUFHakUsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsT0FBTztBQUFBLElBQ0wsS0FBSztBQUFBLE1BQ0gsT0FBTztBQUFBLE1BQ1AsU0FBUyxDQUFDLElBQUk7QUFBQSxNQUNkLE1BQU07QUFBQSxNQUNOLFVBQVU7QUFBQSxJQUNaO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsT0FBTyxjQUFjO0FBQUEsTUFDaEMsUUFBUTtBQUFBLFFBQ04sU0FBUztBQUFBLFVBQ1AsS0FBSztBQUFBLFFBQ1A7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxNQUNGLFFBQVE7QUFBQSxRQUNOLGFBQWE7QUFBQSxRQUNiLGtCQUFrQjtBQUFBLE1BQ3BCO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxRQUFRO0FBQUEsTUFDTixRQUFRO0FBQUEsTUFDUixXQUFXO0FBQUEsTUFDWCxpQkFBaUI7QUFBQSxRQUNmLFdBQVc7QUFBQSxRQUNYLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsV0FBVyxLQUFLO0FBQUEsSUFDcEM7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
