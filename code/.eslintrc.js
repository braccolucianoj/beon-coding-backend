module.exports = {
  root: true,
  env: {
    browser: true,
  },
  extends: ["prettier", "prettier/@typescript-eslint", "eslint:recommended"],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
  env: {
    es6: true,
    node: true,
  },
  rules: {
    "arrow-body-style": ["on"],
    "prefer-arrow-callback": ["on"],
    "prefer-rest-params": ["on"],
    "import/no-unresolved": ["off"],
    "@typescript-eslint/no-use-before-define": ["off"],
    "class-methods-use-this": ["off"],
    "import/prefer-default-export": ["off"],
    "no-underscore-dangle": ["warn"],
    "@typescript-eslint/no-useless-constructor": ["off"],
    "@typescript-eslint/no-unused-expressions": ["off"],
    "@typescript-eslint/no-shadow": ["off"],
    "@typescript-eslint/no-redeclare": ["off"],
    "@typescript-eslint/no-loop-func": ["off"],
    allowNamedFunctions: ["off"],
  },
  ignorePatterns: [
    "node_modules/",
    "output/",
    ".eslintrc.js",
    "babel.config.js",
  ],
  plugins: ["prettier"],
  settings: {},
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: ".",
  },
};
