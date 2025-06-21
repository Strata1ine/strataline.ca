import type { SchemaContext } from "astro:content";
import { ImageSource, type OptimizedImage } from "@build/meta";
import { z } from "zod";

// COMPONENT: @TextCarousel

export type TextCarousel = {
  speed: number;
  text: string[];
};

export const TextCarousel = {
  zod: (_: SchemaContext) => z.object({
    speed: z.number().optional().default(1.0),
    text: z.array(z.string()),
  }),
};

// COMPONENT: @Hero

export type Hero = {
  title: string;
  desc: string;
  images: ImageSource[] | OptimizedImage[];
  id: string;
};

export const Hero = {
  zod: (c: SchemaContext) => ({
    title: z.string(),
    desc: z.string(),
    images: z.array(ImageSource.zod(c)),
  }),
};

// COMPONENT: @Cardshow

export type Cardshow = {
  title: string;
  id: string;
  cards: Card[];
};

export const Cardshow = {
  zod: (c: SchemaContext) => ({
    title: z.string(),
    cards: z.array(Card.zod(c)),
  }),
};

export type Card = {
  title: string;
  desc: string;
  image?: ImageSource | OptimizedImage;
  id: string;
};

export const Card = {
  zod: (c: SchemaContext) =>
    z.object({
      title: z.string(),
      desc: z.string(),
      image: ImageSource.zod(c).optional(),
    }),
};

// COMPONENT: @LessPopular

export type LessPopular = {
  title: string;
  carousel?: TextCarousel;
  id: string;
}

export const LessPopular = {
  zod: (c: SchemaContext) => ({
    title: z.string().default("There's more to explore"),
    carousel: TextCarousel.zod(c).optional(),
  }),
};

// COMPONENT: @Popular

export type Popular = {
  title: string;
  id: string;
}

export const Popular = {
  zod: (c: SchemaContext) => ({
    title: z.string(),
  }),
};
