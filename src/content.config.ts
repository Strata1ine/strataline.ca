import { defineCollection } from 'astro:content';
import { z } from 'zod';

export const collections = {
  index: defineCollection({
    schema: ({ image }) => z.object({
      title: z.string(),
      description: z.string(),
      slideshow_speed: z.number(),
      slideshow_images: z.array(z.object({
        path: image(),
        alt: z.string(),
      })),
      highlight: z.array(z.string()),
    }),
  }),
  services: defineCollection({
    schema: ({ image }) => z.object({
      title: z.string(),
      covers: z.array(z.object({
        path: image(),
        alt: z.string(),
      })),
      description: z.string(),
    }),
  }),
};
