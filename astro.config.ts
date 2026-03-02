import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import svelte from "@astrojs/svelte"
import sitemap from "@astrojs/sitemap"
import remarkSmartypants from "remark-smartypants"
import remarkDirective from "remark-directive"
import { remarkContainers } from "./src/plugins/remark-containers"
import xtlangGrammar from "./src/grammars/xtlang.tmLanguage.json"
import armasmGrammar from "./src/grammars/armasm.tmLanguage.json"

export default defineConfig({
  site: "https://benswift.me",
  trailingSlash: "always",
  integrations: [mdx(), svelte(), sitemap()],
  vite: {
    build: {
      // three.js bundle is ~725 kB
      chunkSizeWarningLimit: 800,
    },
  },
  markdown: {
    remarkPlugins: [[remarkSmartypants as never, { dashes: "oldschool" }], remarkDirective, remarkContainers],
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      langs: [
        { ...xtlangGrammar, aliases: ["extempore"] } as never,
        { ...armasmGrammar, aliases: ["armasm"] } as never,
      ],
    },
  },
})
