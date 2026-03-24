import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import svelte from "@astrojs/svelte"
import sitemap from "@astrojs/sitemap"
import brokenLinksChecker from "astro-broken-links-checker"
import remarkSmartypants from "remark-smartypants"
import remarkDirective from "remark-directive"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeSlug from "rehype-slug"
import { remarkContainers } from "./src/plugins/remark-containers"
import xtlangGrammar from "./src/grammars/xtlang.tmLanguage.json"
import armasmGrammar from "./src/grammars/armasm.tmLanguage.json"

export default defineConfig({
  site: "https://benswift.me",
  trailingSlash: "always",
  // TODO remove these redirects once the talk slide decks are added back in
  redirects: {
    "/talks/p5-hour-of-code": "/talks/",
    "/talks/designing-the-ccc-studio": "/talks/",
  },
  integrations: [mdx(), svelte(), sitemap(), brokenLinksChecker({ checkExternalLinks: false })],
  vite: {
    build: {
      // three.js bundle is ~725 kB
      chunkSizeWarningLimit: 800,
    },
  },
  markdown: {
    remarkPlugins: [[remarkSmartypants as never, { dashes: "oldschool" }], remarkDirective, remarkContainers],
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
})
