import { defineCollection } from 'astro:content';
import { z } from 'zod';

export const collections = {
  index: defineCollection({
    schema: ({ image }) => z.object({
      title: z.string().optional(),
      schema_type: z.string(),
      description: z.string(),
      business: business(image),
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
      header: header().optional(),
      draft: z.boolean().optional(),
    }),
  }),
  privacy: defineCollection({
    schema: ({ image }) => z.object({
      title: z.string(),
      header: header().optional(),
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

const business = function(image: any) {
  return z.object({
    name: z.string(),
    logo: z.union([z.string(), image()]).optional(),
    // photo of location
    photo: image().optional(),
    sameAs: z.array(socialMedia).optional(),
    areaServed: z.array(z.string()).optional(),
  });
};

const icon = z.object({
  icon: z.string(),
  color: z.string().optional(),
  name: z.string(),
});

const socialMedia = z.object({
  social: icon.optional(),
  url: z.string(),
});
