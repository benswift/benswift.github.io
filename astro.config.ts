import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import svelte from "@astrojs/svelte";
import sitemap from "@astrojs/sitemap";
import brokenLinksChecker from "astro-broken-links-checker";
import { astromotion } from "astromotion";
import remarkSmartypants from "remark-smartypants";
import remarkDirective from "remark-directive";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import { remarkContainers } from "./src/plugins/remark-containers";
import xtlangGrammar from "./src/grammars/xtlang.tmLanguage.json";
import armasmGrammar from "./src/grammars/armasm.tmLanguage.json";

export default defineConfig({
  site: "https://benswift.me",
  trailingSlash: "always",
  redirects: {
    "/talks/p5-hour-of-code": "/decks/p5-hour-of-code/",
    "/talks/designing-the-ccc-studio": "/decks/designing-the-ccc-studio/",
  },
  integrations: [
    mdx(),
    svelte(),
    sitemap(),
    brokenLinksChecker({ checkExternalLinks: false }),
    astromotion({
      theme: "./src/decks/theme.css",
      codeTheme: "github-dark",
    }),
  ],
  vite: {
    build: {
      // three.js bundle is ~725 kB
      chunkSizeWarningLimit: 800,
    },
  },
  markdown: {
    remarkPlugins: [
      [remarkSmartypants as never, { dashes: "oldschool" }],
      remarkDirective,
      remarkContainers,
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "prepend",
          properties: { class: "heading-anchor", ariaLabel: "Link to this section" },
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
    },
  },
});
