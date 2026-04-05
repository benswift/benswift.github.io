import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    correctness: "error",
    suspicious: "error",
    perf: "error",
  },
  env: {
    browser: true,
    builtin: true,
    es2024: true,
    node: true,
  },
  ignorePatterns: ["public/assets/js/Winwheel.js", "**/*.astro", "**/*.svelte"],
  jsPlugins: [
    "@e18e/eslint-plugin",
    "eslint-plugin-no-only-tests",
    "eslint-plugin-perfectionist",
    "eslint-plugin-unused-imports",
  ],
  plugins: ["typescript", "import", "unicorn"],
  rules: {
    "no-await-in-loop": "off",
    "no-console": "off",
    "no-warning-comments": ["error", { terms: ["@nocommit"] }],
    "no-only-tests/no-only-tests": "error",
    "unused-imports/no-unused-imports": "error",
    "perfectionist/sort-heritage-clauses": "error",
    "import-x/no-namespace": "error",
    "import-x/no-self-import": "error",
    eqeqeq: ["error", "always", { null: "ignore" }],
  },
});
