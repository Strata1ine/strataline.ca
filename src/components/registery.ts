import type { SchemaContext } from "astro:content";
import { register } from "@build/components";
import * as Components from "@/index";
import { z } from "zod";

const textCarousel = {
  speed: z.number().optional(),
  text: z.array(z.string()).optional(),
};

register({
  id: "Hero",
  init: (c: SchemaContext) => ({
    title: z.string(),
    description: z.string(),
    images: z.array(
      z.object({
        meta: c.image(),
        alt: z.string(),
      })
    ),
  }),
  render: Components.Hero,
});

register({
  id: "Popular",
  init: (_: SchemaContext) => ({
    title: z.string(),
    id: z.string(),
  }),
  render: Components.Popular,
});

register({
  id: "LessPopular",
  init: (_: SchemaContext) => ({
    id: z.string(),
    ...textCarousel
  }),
  render: Components.LessPopular,
});

register({
  id: "TextCarousel",
  init: (_: SchemaContext) => (textCarousel),
  render: Components.TextCarousel,
});

register({
  id: "Slideshow",
  init: (_: SchemaContext) => ({
    title: z.string(),
    description: z.string(),
  }),
  render: Components.Slideshow,
});
