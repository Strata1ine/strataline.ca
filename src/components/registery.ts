import { register } from "@build/components";
import type { SchemaContext } from "astro:content";
import { z } from "zod";
import * as Components from "@/index";

const textCarousel = {
  speed: z.number().optional(),
  text: z.array(z.string()).optional(),
};

register({
  id: "Hero",
  init: (context: SchemaContext) => ({
    title: z.string(),
    description: z.string(),
    images: z.array(
      z.object({
        meta: context.image(),
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
    speed: z.number().optional(),
    text: z.array(z.string()).optional(),
  }),
  render: Components.LessPopular,
});

register({
  id: "TextCarousel",
  init: (_: SchemaContext) => (textCarousel),
  render: Components.TextCarousel,
});
