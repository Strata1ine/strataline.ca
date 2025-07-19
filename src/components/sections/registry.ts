import type { SchemaContext } from 'astro:content';
import { z } from 'zod';

export const registry = {
  Header: {
    schema: (_: SchemaContext) => ({
      id: z.string().optional(),
      nav: z.array(z.object({ id: z.string(), name: z.string() })),
    }),
    load: () => import('./Header.astro'),
  },

  Hero: {
    schema: (c: SchemaContext) => ({
      id: z.string().optional(),
      title: z.string(),
      desc: z.string(),
      images: z.array(z.object({ meta: c.image(), alt: z.string() })),
    }),
    load: () => import('./Hero.astro'),
  },

  Popular: {
    schema: (_: SchemaContext) => ({
      id: z.string().optional(),
      title: z.string(),
    }),
    load: () => import('./Popular.astro'),
  },

  LessPopular: {
    schema: (_: SchemaContext) => ({
      id: z.string().optional(),
      title: z.string().default("There's more to explore"),
      carousel: z
        .object({
          speed: z.number().optional().default(1),
          text: z.array(z.string()),
        })
        .optional(),
    }),
    load: () => import('./LessPopular.astro'),
  },

  TextCarousel: {
    schema: (_: SchemaContext) => ({
      speed: z.number().optional().default(1),
      text: z.array(z.string()),
    }),
    load: () => import('./TextCarousel.astro'),
  },

  Cardshow: {
    schema: (c: SchemaContext) => ({
      id: z.string().optional(),
      title: z.string(),
      cards: z.array(
        z.object({
          title: z.string(),
          desc: z.string(),
          image: z.object({ meta: c.image(), alt: z.string() }).optional(),
          id: z.string().optional(),
        })
      ),
    }),
    load: () => import('./Cardshow.astro'),
  },

  Review: {
    schema: (_: SchemaContext) => ({
      id: z.string().optional(),
      title: z.string(),
      reviews: z.array(
        z.object({
          title: z.string(),
          markdown: z.string(),
          location: z.string(),
          stars: z.number(),
          id: z.string().optional(),
        })
      ),
    }),
    load: () => import('./Review.astro'),
  },
} as const;

export type Id = keyof typeof registry;
type SchemaOf<T extends Id> = ReturnType<(typeof registry)[T]['schema']>;
export type PropsOf<T extends Id> = z.infer<z.ZodObject<SchemaOf<T>>>;

export type SubPropsOf<
  T extends Id,
  K extends keyof PropsOf<T>,
> = PropsOf<T>[K];
