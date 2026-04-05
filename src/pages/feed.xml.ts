import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const allPosts = await getCollection("blog", (entry) => {
    return entry.data.published !== false && /^\d{4}\/\d{2}\/\d{2}\//.test(entry.id);
  });

  const posts = allPosts
    .map((post) => {
      const match = post.id.match(/^(\d{4})\/(\d{2})\/(\d{2})\//);
      const dateStr = match ? `${match[1]}-${match[2]}-${match[3]}` : "";
      const slug = post.id.replace(/\.mdx?$/, "");

      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: new Date(dateStr),
        link: `/blog/${slug}/`,
      };
    })
    .toSorted((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: "benswift.me",
    description: "Ben Swift's blog",
    site: context.site!,
    items: posts,
  });
}
