import { defineCollection } from 'astro:content';
import { z } from 'zod';

export const collections = {
  index: defineCollection({
    schema: z.object({
    }),
  })
  ,
  services: defineCollection({
    schema: ({ image }) => z.object({
      title: z.string(),
      alt: z.string(),
      cover: image(),
      description: z.string(),
    }),
  }),
};
