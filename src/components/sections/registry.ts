import { imageSource } from '~/build/images';
import { type SchemaContext, z } from 'astro:content';
import type { ComponentData } from './components';

export const ZPos = z.union([z.literal('left'), z.literal('right')]);
export const DefaultPos = ZPos.default("left");
export type Pos = z.infer<typeof ZPos>;

const textCarousel = ({
  speed: z.number().optional().default(0.1),
  text: z.array(z.string()),
});

const media = (c: SchemaContext) => z.union([
  z.object({
    type: z.literal('image'),
    ...imageSource(c),
  }),
  z.object({
    type: z.literal('video'),
    poster: c.image(),
    url: z.string(),
  }),
  z.object({
    type: z.literal('yt-video'),
    id: z.string(),
  })
]);

export const registry = {
  Header: {
    schema: (_: SchemaContext) => ({
      id: z.string().optional(),
      content: z.array(z.object({ id: z.string(), name: z.string() })),
    }),
    load: () => import('./Header.astro'),
  },

  Hero: {
    schema: (c: SchemaContext) => ({
      id: z.string().optional(),
      title: z.string(),
      desc: z.string(),
      speed: z.number().default(5.0),
      content: z.array(z.object(imageSource(c))),
    }),
    load: () => import('./Hero.astro'),
  },

  Popular: {
    schema: (_: SchemaContext) => ({
      id: z.string().optional(),
      pos: DefaultPos,
      title: z.string(),
    }),
    load: () => import('./Popular.astro'),
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
    load: () => import('./Services.astro'),
  },

  TextCarousel: {
    schema: (_: SchemaContext) => textCarousel,
    load: () => import('./TextCarousel.astro'),
  },

  ImageCarousel: {
    schema: (c: SchemaContext) => ({
      speed: z.number().optional().default(1.0),
      content: z.array(z.object(imageSource(c))),
    }),
    load: () => import('./ImageCarousel.astro'),
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
    load: () => import('./Cardshow.astro'),
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
          date: z.date().optional(),
          url: z.string().optional(),
          location: z.string(),
          stars: z.number(),
          id: z.string().optional(),
        })
      ),
    }),
    load: () => import('./Reviews.astro'),
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
    load: () => import('./Benefits.astro'),
  },

  ImagePanel: {
    schema: (c: SchemaContext) => ({
      id: z.string().optional(),
      pos: DefaultPos,
      title: z.string(),
      content: z.array(
        z.object({
          title: z.string(),
          ...imageSource(c),
        })
      ),
    }),
    load: () => import('./ImagePanel.astro'),
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
    load: () => import('./Faq.astro'),
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
          image: z.object(imageSource(c)),
        })
      ),
    }),
    load: () => import('./ZigZag.astro'),
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
    load: () => import('./Prices.astro'),
  },
} as const;

export type Id = keyof typeof registry;
type SchemaOf<T extends Id> = ReturnType<(typeof registry)[T]['schema']>;
export type PropsOf<T extends Id> = z.infer<z.ZodObject<SchemaOf<T>>>;

export type SubPropsOf<
  T extends Id,
  K extends keyof PropsOf<T>,
> = PropsOf<T>[K];

export function queryComponents<T extends Id>(
  components: ComponentData[] | undefined | never[],
  componentType: T
): (PropsOf<T> & { type: T; _componentIdx: number })[] {
  if (!components || components.length === 0) {
    return [];
  }
  return components
    .filter((component): component is ComponentData & { type: T } =>
      component.type === componentType
    ) as (PropsOf<T> & { type: T; _componentIdx: number })[];
}
