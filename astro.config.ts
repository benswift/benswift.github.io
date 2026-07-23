import { defineConfig, fontProviders } from "astro/config";
import type { PluggableList } from "unified";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import svelte from "@astrojs/svelte";
import sitemap from "@astrojs/sitemap";
import brokenLinksChecker from "astro-broken-links-checker";
import { astromotion, deckRemarkPlugins } from "astromotion";
import remarkSmartypants from "remark-smartypants";
import remarkDirective from "remark-directive";
import { remarkCallout, headingAnchorPlugins } from "astro-theme-university/markdown";
import xtlangGrammar from "./src/grammars/xtlang.tmLanguage.json";
import armasmGrammar from "./src/grammars/armasm.tmLanguage.json";

// Minimal hast node shape so we don't need @types/hast just for two
// build-time helpers.
interface HastNode {
  type: string;
  value?: string;
  children?: HastNode[];
  properties?: Record<string, unknown>;
}

// Shiki transformer: make scrollable code blocks keyboard-reachable. Chrome
// auto-focuses scrollable containers now, but Firefox and Safari don't, so
// the explicit tabindex/role is still load-bearing for keyboard users.
const a11yCodeBlock = {
  name: "a11y-code-block",
  pre(node: HastNode) {
    node.properties ||= {};
    node.properties.tabindex = "0";
    node.properties.role = "region";
    node.properties["aria-label"] = "Code sample";
  },
};

// Site remark plugins shared between .md (markdown.remarkPlugins) and .mdx
// (via the mdx() integration). Astro's MDX integration replaces rather than
// extends markdown.remarkPlugins, so .mdx files only get plugins listed here
// if we explicitly include them in mdx({ remarkPlugins }). Smartypants is
// included with `dashes: "oldschool"` so `---` becomes em-dash; we disable
// Astro's built-in smartypants on both pipelines to avoid double-processing
// (and because @astrojs/mdx ignores the smartypants config object anyway —
// it always calls the plugin with defaults).
const siteRemarkPlugins: PluggableList = [
  [remarkSmartypants, { dashes: "oldschool" }],
  remarkDirective,
  remarkCallout,
];

export default defineConfig({
  site: "https://benswift.me",
  trailingSlash: "always",
  image: {
    layout: "constrained",
  },
  // ClientRouter already hover-prefetches; viewport strategy also covers touch
  // devices (no hover) and respects data-saver.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  redirects: {
    "/talks/p5-hour-of-code": "/decks/p5-hour-of-code/",
    "/talks/designing-the-ccc-studio": "/decks/designing-the-ccc-studio/",
  },
  fonts: [
    {
      // Self-hosted full-featured build (Google's served subsets strip the
      // case/ss01 features and pin the WONK axis); see src/assets/fonts/.
      provider: fontProviders.local(),
      name: "Fraunces",
      cssVariable: "--font-fraunces",
      fallbacks: ["Georgia", "Times New Roman", "serif"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/fraunces-latin.woff2"],
            weight: "100 900",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/fraunces-italic-latin.woff2"],
            weight: "100 900",
            style: "italic",
          },
        ],
      },
    },
    {
      // Recursive with MONO/CASL pinned to 1 (Mono Casual), CRSV/slnt pinned,
      // wght kept variable; subset includes box-drawing chars for tree output.
      provider: fontProviders.local(),
      name: "Recursive",
      cssVariable: "--font-recursive",
      fallbacks: ["ui-monospace", "SF Mono", "Consolas", "monospace"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/recursive-mono-casual-latin.woff2"],
            weight: "300 1000",
            style: "normal",
          },
        ],
      },
    },
    {
      // Jost caps at wght=900, used only by the Scotoma generator canvas.
      // Near-circular letterforms; matches the typeface the experiment measured.
      provider: fontProviders.local(),
      name: "Jost",
      cssVariable: "--font-jost",
      fallbacks: ["Futura", "Century Gothic", "sans-serif"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/jost-caps-900.woff2"],
            weight: "900",
            style: "normal",
          },
        ],
      },
    },
    {
      provider: fontProviders.google(),
      name: "Public Sans",
      cssVariable: "--font-public-sans",
      weights: ["100 900"],
      styles: ["normal", "italic"],
    },
  ],
  integrations: [
    // Plain mdx() inherits the markdown.processor below (site + deck plugins),
    // so .md and .mdx share one chain. Deck plugins self-gate on .deck.mdx.
    mdx({ smartypants: false }),
    svelte(),
    sitemap(),
    brokenLinksChecker({ checkExternalLinks: false }),
    astromotion({
      theme: "./src/decks/theme.css",
      shikiConfig: { theme: "github-dark" },
      fontVariables: ["--font-public-sans"],
      favicon: "/favicon.svg",
    }),
  ],
  vite: {
    build: {
      // three.js bundle is ~725 kB
      chunkSizeWarningLimit: 800,
    },
  },
  markdown: {
    processor: unified({
      smartypants: false,
      remarkPlugins: [...siteRemarkPlugins, ...deckRemarkPlugins] as never,
      rehypePlugins: [...headingAnchorPlugins],
    }),
    shikiConfig: {
      theme: "github-dark",
      langs: [
        { ...xtlangGrammar, aliases: ["extempore"] } as never,
        { ...armasmGrammar, aliases: ["armasm"] } as never,
      ],
      transformers: [a11yCodeBlock],
    },
  },
});
