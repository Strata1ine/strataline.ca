import { defineCollection } from 'astro:content';
import { z } from 'zod';

const indexCollection = defineCollection({
  schema: z.object({
  }),
});

const servicesCollection = defineCollection({
  schema: z.object({
  }),
});

export const collections = {
  index: indexCollection,
  services: servicesCollection,
};
