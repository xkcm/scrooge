module.exports = {
  env: {
    node: true,
  },
  root: true,
  parser: "vue-eslint-parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "@vue/typescript/recommended",
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "prettier",
  ],
  rules: {
    "vue/no-setup-props-destructure": "off",
  },
  globals: {
    defineModel: "readonly",
  },
};
