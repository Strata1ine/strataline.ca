import { defineCollection } from 'astro:content';
import { z } from 'zod';

export const collections = {
  index: defineCollection({
    schema: ({ image }) => z.object({
      title: z.string().optional(),
      description: z.string(),
      popular: z.array(z.string()),
      header: header(),
    }),
  }),
  services: defineCollection({
    schema: ({ image }) => z.object({
      title: z.string(),
      covers: z.array(z.object({
        src: image(),
        alt: z.string(),
      })),
      description: z.string(),
      draft: z.boolean().optional(),
    }),
  }),
};

const header = function() {
  return z.object({
    enable: z.boolean().optional(),
    ref: z.array(z.object({
      id: z.string(),
      name: z.string(),
    })).optional()
  })
}
