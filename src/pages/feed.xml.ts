import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts } from "../utils/posts";

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: "benswift.me",
    description: "Ben Swift's blog",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: new Date(post.date),
      link: post.url,
    })),
  });
}
