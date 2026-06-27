// Semantic CSS linting for the plain-CSS files under src/ (see the `lint:css`
// script, which scopes to `src/**/*.css`). Stylelint can't see the scoped
// `<style>` blocks in .astro/.svelte components without a customSyntax parser,
// so the bulk of the site's styling is intentionally out of scope here — this
// covers global.css and the deck theme only.
//
// Extends stylelint-config-standard, but turns off the standard rules that
// fight oxfmt (which owns formatting) or this project's deliberate choices, so
// stylelint stays a useful *semantic* linter rather than a second formatter.
export default {
  extends: ["stylelint-config-standard"],
  rules: {
    "no-descending-specificity": null,

    // oxfmt owns formatting — don't let stylelint contest it. value-keyword-case
    // also wrongly lowercases font-family names (Arial, Menlo, Consolas).
    "comment-empty-line-before": null,
    "custom-property-empty-line-before": null,
    "value-keyword-case": null,
    "import-notation": null,

    // deliberate, repo-wide design decisions
    "selector-class-pattern": null, // BEM-style names: wall__cell, pb__first
    "hue-degree-notation": null, // oklch hues are written unitless throughout
    "property-no-vendor-prefix": null, // -webkit-text-size-adjust / line-clamp need the prefix
  },
};
