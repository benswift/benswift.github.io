import { parseFrontmatter } from "@astrojs/markdown-remark";
import { getPosts } from "../utils/posts";

// Plain-text digest of the site's main pages plus a post index, fetched by the
// on-device GemmaChat demo as its context.

const PAGES = {
  Home: "./index.mdx",
  Bio: "./bio.mdx",
  CV: "./cv.mdx",
  Research: "./research.mdx",
  Teaching: "./teaching.mdx",
};

const sources = import.meta.glob<string>("./{index,bio,cv,research,teaching}.mdx", {
  query: "?raw",
  import: "default",
  eager: true,
});

function stripMdxSyntax(content: string): string {
  return content
    .replaceAll(/^import\s+.+$/gm, "")
    .replaceAll(/<[A-Z]\w+[^>]*\/>/g, "")
    .replaceAll(/<[A-Z]\w+[^>]*>[\s\S]*?<\/[A-Z]\w+>/g, "")
    .replaceAll(/<(svg|div|span)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replaceAll(/:::(tip|info|warning|danger|details).*\n/g, "")
    .replaceAll(/^:::\s*$/gm, "")
    .replaceAll(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replaceAll(/\n{3,}/g, "\n\n")
    .trim();
}

export async function GET() {
  const pages = Object.entries(PAGES).map(([label, file]) => {
    const { content } = parseFrontmatter(sources[file]!);
    return `## ${label}\n\n${stripMdxSyntax(content)}`;
  });
  const posts = (await getPosts()).map(({ data, date }) => {
    const tags = data.tags.length > 0 ? ` [${data.tags.join(", ")}]` : "";
    return `- ${data.title} (${date})${tags}`;
  });
  const body = [...pages, `\n## Blog posts\n\n${posts.join("\n")}`].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
