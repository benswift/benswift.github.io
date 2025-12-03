import { defineConfig, type HeadConfig } from "vitepress";
import checker from "vite-plugin-checker";
import footnote from "markdown-it-footnote";
import xtlangGrammar from "./xtlang.tmLanguage.json";
import armasmGrammar from "./armasm.tmLanguage.json";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

function extractDescription(content: string, maxLength = 160): string {
  // Remove frontmatter
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---\s*/, "");

  // Remove common markdown/vue elements that shouldn't be in descriptions
  const cleaned = withoutFrontmatter
    // Remove HTML/Vue components
    .replace(/<[^>]+>/g, "")
    // Remove markdown images
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    // Remove markdown links but keep text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    // Remove footnote references
    .replace(/\[\^[^\]]+\]/g, "")
    // Remove headers
    .replace(/^#{1,6}\s+.*$/gm, "")
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, "")
    // Remove inline code
    .replace(/`[^`]+`/g, "")
    // Remove blockquotes marker
    .replace(/^>\s*/gm, "")
    // Remove custom containers (info, tip, warning, etc.)
    .replace(/^:::\s*\w+\s*$/gm, "")
    .replace(/^:::\s*$/gm, "")
    // Remove bold/italic markers
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1")
    .replace(/_{1,2}([^_]+)_{1,2}/g, "$1")
    // Normalise whitespace
    .replace(/\s+/g, " ")
    .trim();

  // Get first meaningful chunk of text
  const firstParagraph = cleaned.split(/\n\n/)[0] || cleaned;

  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }

  // Truncate at word boundary
  const truncated = firstParagraph.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "…";
}

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
  transformPageData(pageData, { siteConfig }) {
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

    // Auto-generate description if not provided
    if (
      !pageData.frontmatter.description &&
      pageData.relativePath !== "index.md"
    ) {
      const filePath = path.resolve(siteConfig.srcDir, pageData.relativePath);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        const description = extractDescription(content);
        if (description) {
          pageData.frontmatter.description = description;
        }
      }
    }
  },

  transformHead({ pageData }) {
    const head: HeadConfig[] = [];
    const description = pageData.frontmatter.description;
    const title = pageData.frontmatter.title || pageData.title;

    if (description) {
      head.push(["meta", { name: "description", content: description }]);
      head.push(["meta", { property: "og:description", content: description }]);
    }

    if (title) {
      head.push(["meta", { property: "og:title", content: title }]);
    }

    return head;
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
      options: {
        _render(src, env, md) {
          // Render first to populate env.frontmatter
          const html = md.render(src, env);
          if (env.frontmatter?.search === false) return "";

          // Add frontmatter title as searchable h1 at start of source
          // Only if there's no h1 already in the source
          const hasH1 = /^#\s+/m.test(src);
          if (env.frontmatter?.title && !hasH1) {
            // Prepend title as markdown h1 and re-render
            const modifiedSrc = `# ${env.frontmatter.title}\n\n${src}`;
            return md.render(modifiedSrc, env);
          }
          return html;
        },
      },
    },
  },

  // Source directory - we'll keep content at root level
  srcDir: ".",

  // Exclude non-content files from processing
  srcExclude: [
    // Repo files (not site content)
    "README.md",
    "LICENSE",
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
