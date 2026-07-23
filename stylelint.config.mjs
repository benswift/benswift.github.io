// Semantic CSS linting — oxfmt owns formatting, so the standard rules that
// contest it (comment/custom-property spacing, keyword case, import notation)
// are off, along with the naming patterns the theme's --at-* tokens and
// BEM-ish class names don't follow. Scoped <style> blocks in .astro/.svelte
// components are out of scope (no customSyntax parser). Shared baseline
// across the theme-family repos — repo-specific deltas below the marked line.
export default {
  extends: ["stylelint-config-standard"],
  ignoreFiles: ["dist/**", ".astro/**", "node_modules/**"],
  rules: {
    "no-descending-specificity": null,
    "comment-empty-line-before": null,
    "custom-property-empty-line-before": null,
    "value-keyword-case": null,
    "import-notation": null,
    "selector-class-pattern": null,
    "custom-property-pattern": null,
    // --- repo-specific deltas below ---
    "hue-degree-notation": null, // oklch hues are written unitless throughout
    "property-no-vendor-prefix": null, // -webkit-text-size-adjust / line-clamp need the prefix
  },
};
