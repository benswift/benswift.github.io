import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({
    pattern: ["**/*.{md,mdx}", "!index.md", "!tag/**"],
    base: "src/content/blog",
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tags: z
        .union([z.array(z.string()), z.string(), z.null()])
        .transform((val) => {
          if (val == null) return [];
          if (typeof val === "string") return val.split(/\s+/).filter(Boolean);
          return val;
        })
        .default([]),
      published: z.boolean().default(true),
      description: z.string(),
      layout: z.string().optional(),
      search: z.boolean().optional(),
      // Optional hero image override. When present, takes precedence over the
      // auto-discovered src/assets/heroes/<date-slug>.avif. Path is resolved
      // relative to the post file via Astro's image() helper.
      image: image().optional(),
      // Opt out of automatic Bluesky cross-posting for this post (default: on).
      crosspost: z.boolean().optional(),
    }),
});

const livecoding = defineCollection({
  loader: glob({ pattern: ["*.md", "!index.md"], base: "src/content/livecoding" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.string().optional(),
    venue: z.string().optional(),
    venue_url: z.string().optional(),
    type: z.enum(["juried", "invited", "other"]).optional(),
    event: z.string().optional(),
    event_url: z.string().optional(),
    // One entry per recording of the gig; some gigs have several (e.g. crowd
    // vs screencapture, or the AP Sessions visual-study sets).
    videos: z.array(z.object({ url: z.string(), label: z.string().optional() })).optional(),
    curators: z.string().optional(),
    artists: z
      .array(
        z.object({
          name: z.string(),
          role: z.string(),
          orcid: z.string().optional(),
        }),
      )
      .optional(),
    description: z.string().optional(),
    layout: z.string().optional(),
    // --- NTRO / DataCite metadata (TASK-23) ---
    // Livecoding environment used for the set (Impromptu <=2011, Extempore 2013+).
    instrument: z.enum(["Impromptu", "Extempore"]).optional(),
    // Reserved or minted DataCite DOI for this gig.
    doi: z.string().optional(),
    // ANZSRC Fields of Research codes (4- or 6-digit), e.g. "360405".
    for_codes: z.array(z.string()).optional(),
    // Links to papers, proceedings, repos, AT-URIs, streaming copies, etc.
    // relation/type follow the DataCite relationType / resourceTypeGeneral
    // vocabularies (e.g. relation "isDocumentedBy", "isVariantFormOf").
    related_works: z
      .array(
        z.object({
          relation: z.string(),
          identifier: z.string().optional(),
          url: z.string().optional(),
          type: z.string().optional(),
        }),
      )
      .optional(),
    // Wayback Machine snapshots for dead event/venue pages (TASK-23.07).
    archived_event_url: z.string().optional(),
    archived_venue_url: z.string().optional(),
    // SPDX-style licence id for the deposited record, e.g. "CC-BY-4.0".
    license: z.string().optional(),
  }),
});

const talks = defineCollection({
  loader: glob({ pattern: ["*.md", "!README.md", "!index.md"], base: "src/content/talks" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.string().optional(),
    event: z.string().optional(),
    author: z.string().optional(),
    // Archived talks (no deck) link out to the original artefacts rather than
    // rendering an individual page. All optional; a talk with a matching
    // src/decks/<slug>.deck.mdx ignores these and links to the deck instead.
    slides: z.string().optional(),
    paper: z.string().optional(),
    video: z.string().optional(),
  }),
});

export const collections = { blog, livecoding, talks };
