import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

const blog = defineCollection({
  loader: glob({
    pattern: ["**/*.{md,mdx}", "!index.md", "!tag/**"],
    base: "./blog",
  }),
  schema: z.object({
    title: z.string(),
    tags: z
      .union([z.array(z.string()), z.string(), z.null()])
      .transform((val) => {
        if (val == null) return []
        if (typeof val === "string") return val.split(/\s+/).filter(Boolean)
        return val
      })
      .default([]),
    published: z.boolean().default(true),
    description: z.string().optional(),
    image: z.string().optional(),
    layout: z.string().optional(),
    search: z.boolean().optional(),
  }),
})

const livecoding = defineCollection({
  loader: glob({ pattern: ["*.md", "!index.md"], base: "./livecoding" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.string().optional(),
    venue: z.string().optional(),
    venue_url: z.string().optional(),
    type: z.string().optional(),
    event_url: z.string().optional(),
    video_url: z.string().optional(),
    curators: z.string().optional(),
    artists: z.string().optional(),
    layout: z.string().optional(),
  }),
})

const talks = defineCollection({
  loader: glob({ pattern: ["*.md", "!README.md", "!index.md"], base: "./talks" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.string().optional(),
    event: z.string().optional(),
    author: z.string().optional(),
    layout: z.string().optional(),
  }),
})

export const collections = { blog, livecoding, talks }
