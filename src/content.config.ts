import { z, defineCollection } from 'astro:content';

const imageCollection = defineCollection({
  schema: ({ image }) =>
    z.object({
      cover: image(),
      alt: z.string(),
    }),
});

export const collections = { slides: imageCollection };
