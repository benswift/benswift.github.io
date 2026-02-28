import { defineConfig, type HeadConfig } from "vitepress";
import checker from "vite-plugin-checker";
import footnote from "markdown-it-footnote";
import xtlangGrammar from "./xtlang.tmLanguage.json";
import armasmGrammar from "./armasm.tmLanguage.json";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { extractDescription } from "./utils/excerpt";

interface AtprotoState {
  did: string;
  publicationAtUri: string;
  contentHashes: Record<string, string>;
}

function loadAtprotoState(): AtprotoState | null {
  const statePath = path.resolve(__dirname, "../atproto-state.json");
  if (!fs.existsSync(statePath)) return null;
  return JSON.parse(fs.readFileSync(statePath, "utf8")) as AtprotoState;
}

const atprotoState = loadAtprotoState();

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
        const content = fs.readFileSync(fullPath, "utf8");
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

        if (atprotoState?.did) {
          const slug = pageData.relativePath
            .match(/blog\/\d{4}\/\d{2}\/\d{2}\/(.+)\.md$/)?.[1];
          if (slug) {
            const rkey = `${year}-${month}-${day}-${slug}`;
            pageData.frontmatter.atUri = `at://${atprotoState.did}/site.standard.document/${rkey}`;
          }
        }
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

    // Set title for tag pages from route params
    if (pageData.relativePath.startsWith("blog/tag/")) {
      const tag = pageData.params?.tag;
      if (tag) {
        pageData.title = `Posts tagged with "${tag}"`;
        pageData.frontmatter.title = pageData.title;
      }
    }

    // Auto-generate description if not provided
    if (
      !pageData.frontmatter.description &&
      pageData.relativePath !== "index.md"
    ) {
      const filePath = path.resolve(siteConfig.srcDir, pageData.relativePath);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf8");
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
    const hostname = "https://benswift.me";
    const defaultImage = "/assets/images/pages/theremin-75.webp";

    const pagePath = pageData.relativePath
      .replace(/index\.md$/, "")
      .replace(/\.md$/, "");
    const url = `${hostname}/${pagePath}`;
    const image = pageData.frontmatter.image || defaultImage;
    const imageUrl = image.startsWith("http") ? image : `${hostname}${image}`;

    // Open Graph
    head.push(["meta", { property: "og:url", content: url }]);
    head.push(["meta", { property: "og:type", content: pageData.frontmatter.isPost ? "article" : "website" }]);
    if (title) {
      head.push(["meta", { property: "og:title", content: title }]);
    }
    if (description) {
      head.push(["meta", { name: "description", content: description }]);
      head.push(["meta", { property: "og:description", content: description }]);
    }
    head.push(["meta", { property: "og:image", content: imageUrl }]);

    // Twitter
    head.push(["meta", { name: "twitter:card", content: "summary_large_image" }]);
    if (title) {
      head.push(["meta", { name: "twitter:title", content: title }]);
    }
    if (description) {
      head.push(["meta", { name: "twitter:description", content: description }]);
    }
    head.push(["meta", { name: "twitter:image", content: imageUrl }]);

    // AT Protocol
    const atUri = pageData.frontmatter.atUri;
    if (atUri) {
      head.push(["link", { rel: "site.standard.document", href: atUri }]);
    }

    // Citation metadata for blog posts
    if (pageData.frontmatter.isPost) {
      if (title) {
        head.push(["meta", { name: "citation_title", content: title }]);
      }
      head.push(["meta", { name: "citation_author", content: "Ben Swift" }]);
      if (pageData.frontmatter.date) {
        head.push([
          "meta",
          { name: "citation_date", content: pageData.frontmatter.date },
        ]);
      }
      head.push(["meta", { name: "citation_public_url", content: url }]);
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
  description: "Ben Swift — researcher, educator, artist, developer",

  // Clean URLs (no .html extension)
  cleanUrls: true,

  // Only ignore asset links (VitePress can't verify non-HTML files)
  ignoreDeadLinks: [/^\/assets\//],

  // Head tags
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["meta", { name: "author", content: "Ben Swift" }],
    ["meta", { property: "og:site_name", content: "benswift.me" }],
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
