import nkzw from "@nkzw/oxlint-config";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [nkzw],
  env: { browser: true },
  globals: {
    defineProps: "readonly",
    defineEmits: "readonly",
    defineSlots: "readonly",
    withDefaults: "readonly",
  },
  rules: {
    "@nkzw/no-instanceof": "off",
    "@typescript-eslint/array-type": "off",
    curly: "off",
    "no-console": "off",
    "perfectionist/sort-enums": "off",
    "perfectionist/sort-interfaces": "off",
    "perfectionist/sort-jsx-props": "off",
    "perfectionist/sort-object-types": "off",
    "perfectionist/sort-objects": "off",
    "unicorn/numeric-separators-style": "off",
    "unicorn/prefer-top-level-await": "off",
  },
});
