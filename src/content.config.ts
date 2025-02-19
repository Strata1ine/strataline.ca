import { defineCollection } from 'astro:content';
import { z } from 'zod';

export const collections = {
  index: defineCollection({
    schema: ({ image }) => z.object({
      title: z.string(),
      description: z.string(),
      images: z.array(z.object({
        path: image(),
        alt: z.string(),
      })),
    }),
  }),
  services: defineCollection({
    schema: ({ image }) => z.object({
      title: z.string(),
      alt: z.string(),
      cover: image(),
      description: z.string(),
    }),
  }),
};
