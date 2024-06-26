module.exports = {
  env: {
    node: true,
  },
  root: true,
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
  ignorePatterns: ["vite.config.ts", "dist/"],
  parser: "vue-eslint-parser",
  plugins: ["vue", "@typescript-eslint", "simple-import-sort"],
  extends: [
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "prettier",
  ],
  rules: {
    "vue/no-setup-props-destructure": "off",
    "import/named": "off",
  },
  globals: {
    defineModel: "readonly",
  },
};
