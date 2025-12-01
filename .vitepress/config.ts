import { defineConfig } from "vitepress";
import checker from "vite-plugin-checker";

export default defineConfig({
  // Vite configuration
  vite: {
    plugins: [
      checker({
        typescript: true,
      }),
    ],
  },

  title: "benswift.me",
  description: "livecoder & researcher homepage - code, creativity, culture",

  // Clean URLs (no .html extension)
  cleanUrls: true,

  ignoreDeadLinks: false,

  // Head tags
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["meta", { name: "author", content: "Ben Swift" }],
    ["meta", { property: "og:site_name", content: "benswift.me" }],
    ["meta", { name: "twitter:card", content: "summary" }],
    ["meta", { name: "twitter:site", content: "@benswift" }],
  ],

  // Markdown configuration
  markdown: {
    theme: "github-dark",
    lineNumbers: false,
  },

  // Theme configuration
  themeConfig: {
    // Site title in nav
    siteTitle: "benswift.me",

    // Navigation
    nav: [
      { text: "Blog", link: "/blog/" },
      { text: "Research", link: "/research" },
      { text: "Talks", link: "/talks/" },
      { text: "Livecoding", link: "/livecoding/" },
      { text: "Teaching", link: "/teaching" },
      { text: "Bio", link: "/bio" },
    ],

    // Social links
    socialLinks: [
      { icon: "github", link: "https://github.com/benswift" },
      { icon: "bluesky", link: "https://bsky.app/profile/benswift.me" },
      { icon: "linkedin", link: "https://www.linkedin.com/in/benjswift" },
    ],

    // Search
    search: {
      provider: "local",
    },

    // Footer
    footer: {
      message: "Made with VitePress",
      copyright: "Copyright Ben Swift",
    },
  },

  // Source directory - we'll keep content at root level
  srcDir: ".",

  // Exclude Jekyll files and posts source from processing
  srcExclude: [
    // Posts are processed via dynamic routes, not as direct files
    "posts/**",
    // Jekyll legacy directories
    "_posts/**",
    "_talks/**",
    "_livecoding/**",
    "_layouts/**",
    "_includes/**",
    "_plugins/**",
    "_data/**",
    "_drafts/**",
    "_site/**",
    "_cljs/**",
    "_browserify/**",
    // Build files
    "Gemfile",
    "Gemfile.lock",
    "_config.yml",
    "Makefile",
    "scripts/**",
    "backlog/**",
    // Old Jekyll files at root (renamed with jekyll- prefix)
    "jekyll-*.md",
    "search.md",
    "blurbs.md",
    "404.md",
  ],

  // Route rewrites for URL preservation
  rewrites: {
    // Talks - preserve /talks/slug/ URLs
    "talks/:slug.md": "talks/:slug/index.md",
    // Livecoding items - preserve /livecoding/slug/ URLs
    "livecoding/:slug.md": "livecoding/:slug/index.md",
  },

  // Build output
  outDir: ".vitepress/dist",

  // Sitemap
  sitemap: {
    hostname: "https://benswift.me",
  },
});
