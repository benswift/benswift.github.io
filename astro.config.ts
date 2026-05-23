import { defineConfig, fontProviders } from "astro/config";
import type { PluggableList } from "unified";
import mdx from "@astrojs/mdx";
import svelte from "@astrojs/svelte";
import sitemap from "@astrojs/sitemap";
import brokenLinksChecker from "astro-broken-links-checker";
import { astromotion, deckRemarkPlugins } from "astromotion";
import remarkSmartypants from "remark-smartypants";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import { remarkContainerDirective } from "./src/plugins/remark-container-directive";
import { remarkContainers } from "./src/plugins/remark-containers";
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

// Walk a hast heading node and concatenate its text descendants. Used by
// rehype-autolink-headings so each anchor's accessible name includes the
// heading text — otherwise every "Link to this section" name collides.
function headingText(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  if (Array.isArray(node.children)) {
    return node.children.map((c) => headingText(c)).join("");
  }
  return "";
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
  remarkContainerDirective,
  remarkContainers,
];

export default defineConfig({
  site: "https://benswift.me",
  trailingSlash: "always",
  redirects: {
    "/talks/p5-hour-of-code": "/decks/p5-hour-of-code/",
    "/talks/designing-the-ccc-studio": "/decks/designing-the-ccc-studio/",
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Atkinson Hyperlegible Next",
      cssVariable: "--font-atkinson-next",
      weights: ["200 800"],
      styles: ["normal", "italic"],
    },
    {
      provider: fontProviders.google(),
      name: "Atkinson Hyperlegible Mono",
      cssVariable: "--font-atkinson-mono",
      weights: ["200 800"],
      styles: ["normal", "italic"],
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
    mdx({
      remarkPlugins: [...siteRemarkPlugins, ...deckRemarkPlugins],
      smartypants: false,
    }),
    svelte(),
    sitemap(),
    brokenLinksChecker({ checkExternalLinks: false }),
    astromotion({
      theme: "./src/decks/theme.css",
      codeTheme: "github-dark",
      fontVariables: ["--font-public-sans"],
    }),
  ],
  vite: {
    build: {
      // three.js bundle is ~725 kB
      chunkSizeWarningLimit: 800,
    },
  },
  markdown: {
    smartypants: false,
    remarkPlugins: siteRemarkPlugins as never,
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "prepend",
          properties: (node: HastNode) => {
            const text = headingText(node).trim() || "section";
            return {
              class: "at-heading-anchor",
              ariaLabel: `Link to section: ${text}`,
            };
          },
          content: {
            type: "text",
            value: "#",
          },
        },
      ],
    ],
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
