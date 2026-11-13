import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { ntroSchema, personSchema, relatedWorkSchema } from "./utils/content-schemas";

const blog = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "src/content/blog",
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tags: z.array(z.string()).default([]),
      published: z.boolean().default(true),
      description: z.string(),
      // Optional hero image override. When present, takes precedence over the
      // auto-discovered src/assets/heroes/<date-slug>.avif. Path is resolved
      // relative to the post file via Astro's image() helper.
      image: image().optional(),
      // Opt out of automatic Bluesky cross-posting for this post (default: on).
      crosspost: z.boolean().optional(),
    }),
});

// The live-coding body of work is NTRO #1 (a portfolio, Major): the collection
// DOI and research statement live in src/data/livecoding-collection.ts and
// src/data/livecoding-research-statement.md. NTROs #2--#8 (and Slop University) are the `ntro`
// collection below.
const livecoding = defineCollection({
  loader: glob({ pattern: "*.md", base: "src/content/livecoding" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.string(),
    venue: z.string().optional(),
    venue_url: z.string().optional(),
    type: z.enum(["juried", "invited", "other"]).optional(),
    event: z.string().optional(),
    event_url: z.string().optional(),
    // One entry per recording of the gig; some gigs have several (e.g. crowd
    // vs screencapture, or the AP Sessions visual-study sets).
    videos: z.array(z.object({ url: z.string(), label: z.string().optional() })).optional(),
    curators: z.string().optional(),
    artists: z.array(personSchema.extend({ role: z.string() })).optional(),
    description: z.string(),
    // --- NTRO / DataCite metadata (TASK-23) ---
    // Livecoding environment used for the set (Impromptu <=2011, Extempore 2013+).
    instrument: z.enum(["Impromptu", "Extempore"]).optional(),
    // Reserved or minted DataCite DOI for this gig.
    doi: z.string().optional(),
    // ANZSRC Fields of Research codes (4- or 6-digit), e.g. "360405".
    for_codes: z.array(z.string()).optional(),
    // Links to papers, proceedings, repos, AT-URIs, streaming copies, etc.
    // (DataCite relationType / resourceTypeGeneral vocabularies).
    related_works: z.array(relatedWorkSchema).optional(),
    // Wayback Machine snapshots for dead event/venue pages (TASK-23.07).
    archived_event_url: z.string().optional(),
    archived_venue_url: z.string().optional(),
    // SPDX-style licence id for the deposited record, e.g. "CC-BY-4.0".
    license: z.string().optional(),
  }),
});

const talks = defineCollection({
  loader: glob({ pattern: "*.md", base: "src/content/talks" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.string().optional(),
    event: z.string().optional(),
    // Archived talks (no deck) link out to the original artefacts rather than
    // rendering an individual page. All optional; a talk with a matching
    // src/decks/<slug>/slides.deck.mdx ignores these and links to the deck instead.
    slides: z.string().optional(),
    paper: z.string().optional(),
    video: z.string().optional(),
  }),
});

// Non-traditional research outputs #2--#8 plus Slop University (data only: no pages or routes read
// this collection). NTRO #1 is the `livecoding` collection above. This is the
// canonical NTRO reference; the `ntro:` blocks in cybernetics-website's
// _projects/*.md are copies (compare with `pnpm ntro:check`). The body of each
// file is the research statement (Appendix C form of the ANU NTRO guidelines),
// written to be lifted verbatim into RP+ and promotion cases. The general
// process notes are in backlog/docs (NTRO register).
const ntro = defineCollection({
  loader: glob({ pattern: "*.md", base: "src/content/ntro" }),
  schema: ntroSchema,
});

export const collections = { blog, livecoding, ntro, talks };
