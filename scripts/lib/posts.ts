import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { parseFrontmatter } from "./frontmatter";

export interface PostData {
  title: string;
  path: string;
  date: string;
  description: string;
  tags: string[];
  textContent: string;
  contentHash: string;
  filePath: string;
  /** Whether this post may be cross-posted to Bluesky (frontmatter `crosspost: false` opts out). */
  crosspost: boolean;
}

export function pathToRkey(postPath: string): string {
  const match = postPath.match(/\/blog\/(\d{4})\/(\d{2})\/(\d{2})\/(.+)/);
  if (!match) throw new Error(`Invalid post path: ${postPath}`);
  const [, year, month, day, slug] = match;
  return `${year}-${month}-${day}-${slug}`;
}

export function extractPostPath(relativePath: string): string {
  const withoutExt = relativePath.replace(/\.mdx?$/, "");
  return `/${withoutExt}`;
}

export function computeHash(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

/**
 * Reduce markdown/MDX body text to plain text for the Standard.site
 * `textContent` field, which the lexicon defines as a plaintext representation
 * of the document with no markdown or other formatting. Drops fenced code,
 * JSX/HTML, MDX imports and container directives; unwraps links, images and
 * inline code; and strips heading, list and blockquote markers and emphasis.
 */
export function toPlainText(markdown: string): string {
  return markdown
    .replaceAll(/```[\s\S]*?```/g, " ")
    .replaceAll(/^(?:import|export)\s.+$/gm, " ")
    .replaceAll(/<([A-Za-z][\w-]*)\b[^>]*>[\s\S]*?<\/\1>/g, " ")
    .replaceAll(/<[A-Za-z][^>]*\/?>/g, " ")
    .replaceAll(/^:::.*$/gm, " ")
    .replaceAll(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replaceAll(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replaceAll(/`([^`]+)`/g, "$1")
    .replaceAll(/^\s{0,3}#{1,6}\s+/gm, "")
    .replaceAll(/^\s{0,3}>\s?/gm, "")
    .replaceAll(/^\s{0,3}(?:[-*+]|\d+\.)\s+/gm, "")
    .replaceAll(/(\*\*|__|\*|_|~~)/g, "")
    .replaceAll(/\s+/g, " ")
    .trim();
}

interface PostFrontmatter {
  title?: string;
  description?: string;
  tags?: string[] | string;
  published?: boolean;
  crosspost?: boolean;
}

export function discoverPosts(blogDir: string): PostData[] {
  const posts: PostData[] = [];

  function scanDir(dir: string) {
    if (!fs.existsSync(dir)) return;
    for (const item of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory() && item !== "tag") {
        scanDir(fullPath);
      } else if ((item.endsWith(".md") || item.endsWith(".mdx")) && item !== "index.md") {
        const raw = fs.readFileSync(fullPath, "utf8");
        const { data: fm, content: body } = parseFrontmatter<PostFrontmatter>(raw);

        if (fm.published === false) continue;

        const relativePath = path.relative(path.resolve(blogDir, ".."), fullPath);
        const postPath = extractPostPath(relativePath);

        const dateMatch = postPath.match(/\/blog\/(\d{4})\/(\d{2})\/(\d{2})\//);
        if (!dateMatch) continue;
        const [, year, month, day] = dateMatch;
        const date = `${year}-${month}-${day}`;

        let tags: string[] = [];
        if (Array.isArray(fm.tags)) {
          tags = fm.tags.map(String);
        } else if (typeof fm.tags === "string") {
          tags = fm.tags.split(/\s+/).filter(Boolean);
        }

        const description = fm.description || "";
        const textContent = toPlainText(body);

        posts.push({
          title: fm.title || item.replace(/\.mdx?$/, ""),
          path: postPath,
          date,
          description,
          tags,
          textContent,
          contentHash: computeHash(raw),
          filePath: fullPath,
          crosspost: fm.crosspost !== false,
        });
      }
    }
  }

  scanDir(blogDir);
  return posts.toSorted((a, b) => b.date.localeCompare(a.date));
}
