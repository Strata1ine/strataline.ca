import { imageSource } from '~/build/images';
import { type SchemaContext, z } from 'astro:content';
import { ZPos } from './styles';

const textCarousel = ({
  speed: z.number().optional().default(1),
  text: z.array(z.string()),
});

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
      content: z.array(z.object(imageSource(c))),
    }),
    load: () => import('./Hero.astro'),
  },

  Popular: {
    schema: (_: SchemaContext) => ({
      id: z.string().optional(),
      pos: ZPos,
      title: z.string(),
    }),
    load: () => import('./Popular.astro'),
  },

  LessPopular: {
    schema: (_: SchemaContext) => ({
      id: z.string().optional(),
      pos: ZPos,
      title: z.string().default("There's more to explore"),
      content: z
        .object(textCarousel)
        .optional(),
    }),
    load: () => import('./LessPopular.astro'),
  },

  TextCarousel: {
    schema: (_: SchemaContext) => textCarousel,
    load: () => import('./TextCarousel.astro'),
  },

  Cardshow: {
    schema: (c: SchemaContext) => ({
      id: z.string().optional(),
      pos: ZPos,
      title: z.string(),
      content: z.array(
        z.object({
          title: z.string(),
          desc: z.string(),
          image: z.object(imageSource(c)).optional(),
          id: z.string().optional(),
        })
      ),
    }),
    load: () => import('./Cardshow.astro'),
  },

  Reviews: {
    schema: (_: SchemaContext) => ({
      id: z.string().optional(),
      pos: ZPos,
      title: z.string(),
      content: z.array(
        z.object({
          title: z.string(),
          markdown: z.string(),
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
      pos: ZPos,
      title: z.string(),
      content: z.array(
        z.object({
          title: z.string(),
          markdown: z.string(),
        })
      ),
    }),
    load: () => import('./Benefits.astro'),
  },

  ImagePanel: {
    schema: (c: SchemaContext) => ({
      id: z.string().optional(),
      pos: ZPos,
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
} as const;

export type Id = keyof typeof registry;
type SchemaOf<T extends Id> = ReturnType<(typeof registry)[T]['schema']>;
export type PropsOf<T extends Id> = z.infer<z.ZodObject<SchemaOf<T>>>;

export type SubPropsOf<
  T extends Id,
  K extends keyof PropsOf<T>,
> = PropsOf<T>[K];
