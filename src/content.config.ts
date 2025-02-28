import { defineCollection } from 'astro:content';
import { z } from 'zod';

export const collections = {
  index: defineCollection({
    schema: ({ image }) => z.object({
      name: z.string(),
      popular: z.array(z.string()),
      contact: z.object({
        phone: z.string(),
        email: z.string(),
        messege: z.string(),
      }),
      socials: z.array(z.object({
        name: z.string(),
        url: z.string(),
        icon: image(),
      })),
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
