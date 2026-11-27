import type { AstroIntegration } from "astro";

/**
 * Plausible pageviews and file downloads on every page, decks and the 404
 * included, via the official tracker package. `domain` is the site's ID in the
 * Plausible dashboard.
 *
 * The tracker starts only on the hostname of `site`, in a top-level window, so
 * dev servers, `astro preview` and the preview iframes of a deck's speaker
 * view send nothing. Once started it sets `window.plausible(name, { props })`
 * for custom events; it has no queue, so call it from a module script, which
 * runs after this one.
 */
export default function plausible(domain: string): AstroIntegration {
  return {
    name: "plausible",
    hooks: {
      "astro:config:setup": ({ config, injectScript }) => {
        if (!config.site) return;
        const host = new URL(config.site).hostname;
        // Astro joins every "page" script into one module, whose other imports
        // (prefetch's `init`, for one) share this scope: hence the alias.
        injectScript(
          "page",
          `import { init as initPlausible } from "@plausible-analytics/tracker";
if (location.hostname === ${JSON.stringify(host)} && window.top === window.self) {
  initPlausible({ domain: ${JSON.stringify(domain)}, fileDownloads: true });
}`,
        );
      },
    },
  };
}
