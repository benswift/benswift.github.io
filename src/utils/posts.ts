import { type CollectionEntry, getCollection } from "astro:content";

const POST_ID = /^(\d{4})\/(\d{2})\/(\d{2})\/(.+)$/;

/** Date and URL parts derived from a blog entry id (`YYYY/MM/DD/slug`). */
export function postPath(id: string) {
  const match = POST_ID.exec(id);
  if (!match) throw new Error(`blog entry id "${id}" isn't YYYY/MM/DD/slug`);
  const [, year, month, day, slug] = match;
  return { date: `${year}-${month}-${day}`, slug, url: `/blog/${id}/` };
}

export type Post = CollectionEntry<"blog"> & ReturnType<typeof postPath>;

/** Published blog posts, newest first. */
export async function getPosts(): Promise<Post[]> {
  const entries = await getCollection("blog", ({ data }) => data.published);
  return entries
    .map((entry) => ({ ...entry, ...postPath(entry.id) }))
    .toSorted((a, b) => b.date.localeCompare(a.date));
}
