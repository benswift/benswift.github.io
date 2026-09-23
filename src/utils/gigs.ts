import { type CollectionEntry, getCollection } from "astro:content";

export type Gig = CollectionEntry<"livecoding"> & { url: string };

/** Livecoding gigs, newest first. */
export async function getGigs(): Promise<Gig[]> {
  const entries = await getCollection("livecoding");
  return entries
    .map((entry) => ({ ...entry, url: `/livecoding/${entry.id}/` }))
    .toSorted((a, b) => b.data.date.localeCompare(a.data.date));
}
