import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import svelte from "@astrojs/svelte"
import sitemap from "@astrojs/sitemap"
import remarkDirective from "remark-directive"
import { remarkContainers } from "./src/plugins/remark-containers"
import xtlangGrammar from "./src/grammars/xtlang.tmLanguage.json"
import armasmGrammar from "./src/grammars/armasm.tmLanguage.json"

export default defineConfig({
  site: "https://benswift.me",
  trailingSlash: "always",
  integrations: [mdx(), svelte(), sitemap()],
  markdown: {
    remarkPlugins: [remarkDirective, remarkContainers],
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      // eslint-disable-next-line typescript-eslint/no-explicit-any -- Shiki grammar JSON types don't match exactly
      langs: [
        {
          ...xtlangGrammar as Record<string, unknown>,
          aliases: ["extempore"],
        },
        {
          ...armasmGrammar as Record<string, unknown>,
          aliases: ["armasm"],
        },
      ],
    },
  },
})
