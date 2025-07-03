import type { SchemaContext } from "astro:content";
import { ImageSource, type OptimizedImage } from "~/build/meta";
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
    id: z.string().optional(),
  }),
};

// COMPONENT: @Cardshow

export type Cardshow = {
  title: string;
  cards: Card[];
  id: string;
};

export const Cardshow = {
  zod: (c: SchemaContext) => ({
    title: z.string(),
    cards: z.array(Card.zod(c)),
    id: z.string().optional(),
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
      id: z.string().optional(),
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
    id: z.string().optional(),
  }),
};

// COMPONENT: @Popular

export type Popular = {
  title: string;
  id: string;
}

export const Popular = {
  zod: (_: SchemaContext) => ({
    title: z.string(),
    id: z.string().optional(),
  }),
};


// COMPONENT: @Reviews

export type Review = {
  title: string;
  reviews: Opinion[];
  id: string;
}


export const Review = {
  zod: (c: SchemaContext) => ({
    title: z.string(),
    reviews: z.array(Opinion.zod(c)),
    id: z.string().optional(),
  }),
};


export type Opinion = {
  title: string;
  markdown: string;
  location: string;
  stars: number;
  id: string;
}

export const Opinion = {
  zod: (_: SchemaContext) => z.object({
    title: z.string(),
    markdown: z.string(),
    location: z.string(),
    stars: z.number(),
    id: z.string().optional(),
  }),
}
