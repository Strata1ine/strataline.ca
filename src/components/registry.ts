import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import { type SchemaContext, z } from 'astro:content';

export const ZPos = z.union([z.literal('left'), z.literal('right')]);
export const DefaultPos = ZPos.default("left");
export type Pos = z.infer<typeof ZPos>;

const textCarousel = ({
  speed: z.number().optional().default(0.1),
  text: z.array(z.string()),
});

export type ImageSource = z.infer<ReturnType<typeof image>>;

export const image = (
  c: SchemaContext,
) =>
  z.object({
    src: c.image(),
    alt: z.string(),
    x: z.enum(['left', 'right']).optional(),
    y: z.enum(['top', 'bottom']).optional(),
  })

const media = (c: SchemaContext) => {
  return z.union([
    z.object({
      type: z.literal('image'),
      image: image(c),
    }),
    z.object({
      type: z.literal('video'),
      image: image(c),
      uploadDate: z.coerce.date(),
      url: z.string(),
    }),
    z.object({
      type: z.literal('yt-video'),
      id: z.string(),
    })
  ]);
};

export const registry = {
  Header: {
    schema: (_: SchemaContext) => ({
      id: z.string().optional(),
      content: z.array(z.object({ id: z.string(), name: z.string() })),
    }),
    load: () => import('./sections/Header.astro'),
  },

  Hero: {
    schema: (c: SchemaContext) => ({
      id: z.string().optional(),
      title: z.string(),
      desc: z.string(),
      speed: z.number().default(5.0),
      content: z.array(image(c)),
    }),
    load: () => import('./sections/Hero.astro'),
  },

  Popular: {
    schema: (_: SchemaContext) => ({
      id: z.string().optional(),
      pos: DefaultPos,
      title: z.string(),
    }),
    load: () => import('./sections/Popular.astro'),
  },

  Services: {
    schema: (_: SchemaContext) => ({
      id: z.string().optional(),
      pos: DefaultPos,
      title: z.string().default("There's more to explore"),
      exclude: z.array(z.string()).optional(),
      content: z
        .object(textCarousel)
        .optional(),
    }),
    load: () => import('./sections/Services.astro'),
  },

  TextCarousel: {
    schema: (_: SchemaContext) => textCarousel,
    load: () => import('./sections/TextCarousel.astro'),
  },

  ImageCarousel: {
    schema: (c: SchemaContext) => ({
      speed: z.number().optional().default(1.0),
      content: z.array(image(c)),
    }),
    load: () => import('./sections/ImageCarousel.astro'),
  },

  Cardshow: {
    schema: (c: SchemaContext) => ({
      id: z.string().optional(),
      pos: DefaultPos,
      title: z.string(),
      speed: z.number().default(5.0),
      content: z.array(
        z.object({
          title: z.string(),
          desc: z.string(),
          id: z.string().optional(),
          media: media(c),
          link: z.object({
            name: z.string(),
            url: z.string(),
          }).optional(),
        })
      ),
    }),
    load: () => import('./sections/Cardshow.astro'),
  },

  Reviews: {
    schema: (_: SchemaContext) => ({
      id: z.string().optional(),
      pos: DefaultPos,
      title: z.string(),
      content: z.array(
        z.object({
          title: z.string(),
          desc: z.string(),
          date: z.coerce.date().optional(),
          url: z.string().optional(),
          location: z.string(),
          stars: z.number(),
          id: z.string().optional(),
        })
      ),
    }),
    load: () => import('./sections/Reviews.astro'),
  },

  Benefits: {
    schema: (_: SchemaContext) => ({
      id: z.string().optional(),
      pos: DefaultPos,
      title: z.string(),
      content: z.array(
        z.object({
          title: z.string(),
          desc: z.string(),
        })
      ),
    }),
    load: () => import('./sections/Benefits.astro'),
  },

  ImagePanel: {
    schema: (c: SchemaContext) => ({
      id: z.string().optional(),
      pos: DefaultPos,
      title: z.string(),
      content: z.array(
        z.object({
          title: z.string(),
          image: image(c),
        })
      ),
    }),
    load: () => import('./sections/ImagePanel.astro'),
  },

  Faq: {
    schema: (_: SchemaContext) => ({
      id: z.string().optional(),
      pos: DefaultPos,
      title: z.string(),
      content: z.array(
        z.object({
          title: z.string(),
          desc: z.string(),
        })
      ),
    }),
    load: () => import('./sections/Faq.astro'),
  },

  ZigZag: {
    schema: (c: SchemaContext) => ({
      id: z.string().optional(),
      pos: DefaultPos,
      title: z.string(),
      content: z.array(
        z.object({
          title: z.string(),
          desc: z.string(),
          image: image(c),
        })
      ),
    }),
    load: () => import('./sections/ZigZag.astro'),
  },

  Prices: {
    schema: (_: SchemaContext) => ({
      id: z.string().optional(),
      pos: DefaultPos,
      title: z.string(),
      content: z.array(
        z.object({
          title: z.string(),
          min: z.number().min(0),
          max: z.number().min(0),
          materials: z.array(z.string()),
          desc: z.string(),
        })
      ),
    }),
    load: () => import('./sections/Prices.astro'),
  },
} as const;

export type Id = keyof typeof registry;
type SchemaOf<T extends Id> = ReturnType<(typeof registry)[T]['schema']>;
export type PropsOf<T extends Id> = z.infer<z.ZodObject<SchemaOf<T>>>;

export type SubPropsOf<
  T extends Id,
  K extends keyof PropsOf<T>,
> = PropsOf<T>[K];

export function querySections<T extends Id>(
  sections: SectionMeta[] | undefined | never[],
  sectionType: T
): (PropsOf<T> & SectionMeta)[] {
  if (!sections || sections.length === 0) {
    return [];
  }
  return sections
    .filter((section): section is SectionMeta =>
      section.type === sectionType
    ) as (PropsOf<T> & SectionMeta)[];
}

export const sectionRegistry: Record<string, SchemaComponent> = {};

export type SchemaComponent = {
  id: string,
  schema: (c: SchemaContext) => z.ZodRawShape;
  load: () => Promise<{ default: AstroComponentFactory }>;
};

export type SectionMeta = z.infer<ReturnType<typeof parseRegistry>>[number];
export function parseRegistry(c: SchemaContext) {
  const schemas = Object.values(sectionRegistry).map((item, i) =>
    z.object({
      type: z.literal(item.id),
      _sectionIdx: z.number().default(i),
      ...item.schema(c),
    }),
  );

  if (schemas.length === 0) {
    console.warn("componentRegistry is empty");
    return z.preprocess(() => [], z.array(z.never()));
  }

  const [first, ...rest] = schemas;
  return z.array(z.discriminatedUnion('type', [first, ...rest]));
}

// init's the registry
for (const [id, { schema, load }] of Object.entries(registry)) {
  console.log(`Section '${id}' flushed`);
  sectionRegistry[id] = { id, schema, load };
}
