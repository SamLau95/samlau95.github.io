import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";

const papers = defineCollection({
  loader: file("src/data/papers.yml"),
  schema: z.object({
    id: z.string(),
    order: z.number().int().nonnegative(),
    year: z.number().int(),
    title: z.string(),
    authors: z.string(),
    venue: z.string(),
    blurb: z.string(),
    type: z.string(),
    pdf: z.string(),
    links: z
      .array(
        z.object({
          name: z.string(),
          url: z.string(),
        }),
      )
      .optional(),
  }),
});

export const collections = { papers };
