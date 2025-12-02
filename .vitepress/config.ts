import { defineConfig } from "vitepress";
import checker from "vite-plugin-checker";
import footnote from "markdown-it-footnote";
import xtlangGrammar from "./xtlang.tmLanguage.json";
import armasmGrammar from "./armasm.tmLanguage.json";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

function getUnpublishedPosts(): string[] {
  const unpublished: string[] = [];
  const blogDir = path.resolve(__dirname, "../blog");

  function scanDir(dir: string) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory() && item !== "tag") {
        scanDir(fullPath);
      } else if (item.endsWith(".md") && item !== "index.md") {
        const content = fs.readFileSync(fullPath, "utf-8");
        const { data: fm } = matter(content);
        if (fm.published === false) {
          const relativePath = path.relative(
            path.resolve(__dirname, ".."),
            fullPath,
          );
          unpublished.push(relativePath);
        }
      }
    }
  }

  scanDir(blogDir);
  return unpublished;
}

export default defineConfig({
  transformPageData(pageData) {
    // Set defaults for blog posts (but not blog/index.md or tag pages)
    const isBlogPost =
      pageData.relativePath.startsWith("blog/") &&
      pageData.relativePath !== "blog/index.md" &&
      !pageData.relativePath.startsWith("blog/tag/");

    if (isBlogPost) {
      pageData.frontmatter.aside ??= false;
      pageData.frontmatter.isPost = true;

      // Extract date from path: blog/YYYY/MM/DD/slug.md
      const match = pageData.relativePath.match(
        /blog\/(\d{4})\/(\d{2})\/(\d{2})\//,
      );
      if (match) {
        const [, year, month, day] = match;
        pageData.frontmatter.date = `${year}-${month}-${day}`;
      }
    }

    // Set defaults for livecoding gig pages
    const isGigPage =
      pageData.relativePath.startsWith("livecoding/") &&
      pageData.relativePath !== "livecoding/index.md";

    if (isGigPage) {
      pageData.frontmatter.aside ??= false;
      pageData.frontmatter.isGig = true;
    }
  },

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

  // Only ignore asset links (VitePress can't verify non-HTML files)
  ignoreDeadLinks: [/^\/assets\//],

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
    theme: {
      light: "github-light",
      dark: "github-dark",
    },
    lineNumbers: false,
    typographer: true,
    languages: [
      {
        ...xtlangGrammar,
        aliases: ["extempore"],
      },
      {
        ...armasmGrammar,
        aliases: ["armasm"],
      },
    ],
    config: (md) => {
      md.use(footnote);
    },
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

  // Exclude non-content files from processing
  srcExclude: [
    // Data files (used by data loaders, not content)
    "_data/**",
    // Jekyll build output (gitignored but exclude just in case)
    "_site/**",
    // Build/config files
    "Gemfile",
    "Gemfile.lock",
    "_config.yml",
    "Makefile",
    "backlog/**",
    // Old Jekyll files at root (renamed with jekyll- prefix)
    "jekyll-*.md",
    "search.md",
    "404.md",
    // Unpublished blog posts
    ...getUnpublishedPosts(),
  ],

  // Route rewrites for URL preservation
  rewrites: {
    // Talks - preserve /talks/slug/ URLs
    "talks/:slug.md": "talks/:slug/index.md",
    // Livecoding index - keep at /livecoding/ (must come before the :slug rule)
    "livecoding/index.md": "livecoding/index.md",
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
