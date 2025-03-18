import { defineCollection } from 'astro:content';
import { z } from 'zod';

export const collections = {
  index: defineCollection({
    schema: ({ image }) => z.object({
      title: z.string(),
      description: z.string(),
      business: business(image),
      popular: z.array(z.string()),
      header: header(),
    }),
  }),
  privacy: defineCollection({
    schema: ({ image }) => z.object({
      header: header().optional(),
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
    schema_type: z.string(),
    name: z.string(),
    alternateName: z.string().optional(),
    description: z.string().optional(),
    url: z.string().optional(),
    logo: z.union([z.string(), image()]).optional(),
    slogan: z.string().optional(),
    // photo of location
    photo: image().optional(),
    sameAs: z.array(socialMedia).optional(),

    legalName: z.string().optional(),
    foundingDate: z.string().optional(),
    foundingLocation: z.string().optional(),
    founder: z.string().optional(),
    address: z.union([z.string(), postalAddressSchema]).optional(),
    email: z.string().optional(),
    telephone: z.string().optional(),
    faxNumber: z.string().optional(),
    taxID: z.string().optional(),
    vatID: z.string().optional(),
    globalLocationNumber: z.string().optional(),
    isicV4: z.string().optional(),
    duns: z.string().optional(),
    leiCode: z.string().optional(),
    naics: z.string().optional(),
    numberOfEmployees: z.union([z.number(), z.string()]).optional(),
    contactPoint: z.union([contactPointSchema, z.array(contactPointSchema)]).optional(),

    currenciesAccepted: z.string().optional(),
    openingHours: z.string().optional(),
    paymentAccepted: z.string().optional(),
    priceRange: z.string().optional(),

    areaServed: z.array(z.string()).optional(),
    geo: geoCoordinatesSchema.optional(),
    latitude: z.union([z.number(), z.string()]).optional(),
    longitude: z.union([z.number(), z.string()]).optional(),
    hasMap: z.string().optional(),

    openingHoursSpecification: z.union([
      openingHoursSpecificationSchema,
      z.array(openingHoursSpecificationSchema)
    ]).optional(),

    aggregateRating: aggregateRatingSchema.optional(),

    acceptedPaymentMethod: z.union([z.string(), z.array(z.string())]).optional(),
    award: z.union([z.string(), z.array(z.string())]).optional(),
    department: z.array(z.string()).optional(),
    hasDriveThroughService: z.boolean().optional(),
    keywords: z.union([z.string(), z.array(z.string())]).optional(),
    maximumAttendeeCapacity: z.number().optional(),
    publicAccess: z.boolean().optional(),
    smokingAllowed: z.boolean().optional(),

    // Social and branding
    brand: z.string().optional(),
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

const contactPointSchema = z.object({
  telephone: z.string().optional(),
  email: z.string().optional(),
  contactType: z.string().optional(),
});

const openingHoursSpecificationSchema = z.object({
  dayOfWeek: z.array(z.string()).optional(),
  opens: z.string().optional(),
  closes: z.string().optional(),
  validFrom: z.string().optional(),
  validThrough: z.string().optional(),
});

const geoCoordinatesSchema = z.object({
  latitude: z.union([z.number(), z.string()]).optional(),
  longitude: z.union([z.number(), z.string()]).optional(),
});

const aggregateRatingSchema = z.object({
  ratingValue: z.union([z.number(), z.string()]).optional(),
  ratingCount: z.union([z.number(), z.string()]).optional(),
  bestRating: z.union([z.number(), z.string()]).optional(),
  worstRating: z.union([z.number(), z.string()]).optional(),
})
