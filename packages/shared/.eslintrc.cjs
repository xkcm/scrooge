module.exports = {
  extends: [
    "airbnb-base",
    "airbnb-typescript/base"
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  ignorePatterns: [
    ".eslintrc.cjs",
    "dist/**/*",
    "node_modules/**/*"
  ],
  parserOptions: {
    project: "./tsconfig.json"
  },
  rules: {
    "curly": ["error", "all"],
    "no-console": ["error", { allow: ["info", "warn", "error"] }],
    "no-use-before-define": "off",
    "import/prefer-default-export": "off",
    "max-classes-per-file": "off",
    "import/extensions": "off",
    "import/no-extraneous-dependencies": "off",
    "@typescript-eslint/quotes": ["error", "double"],
    "@typescript-eslint/no-use-before-define": ["error", { functions: false, classes: false, typedefs: false }],
    "@typescript-eslint/brace-style": ["error", "1tbs", { allowSingleLine: false }],
    "@typescript-eslint/indent": ["error", 2, {
      ignoredNodes: [
        "TSTypeParameterInstantiation",
        "TSIntersectionType",
        "FunctionExpression[params]:has(Identifier[decorators])"
      ]
    }],
  }
};