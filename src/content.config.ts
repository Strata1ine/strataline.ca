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

const business = function(image: any) {
  return z.object({
    // photo of location
    photo: image().optional(),
    name: z.string(),
    email: z.string(),
    telephone: z.string(),
    address: postalAddressSchema,
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

const postalAddressSchema = z.object({
  streetAddress: z.string().optional(),
  addressLocality: z.string().optional(),
  addressRegion: z.string().optional(),
  postalCode: z.string().optional(),
  addressCountry: z.string().optional(),
});
