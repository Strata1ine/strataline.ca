import type { SchemaContext } from "astro:content";
import { register } from "@build/components";
import { ImageSource } from "@build/meta";
import * as Components from "@/index";
import { z } from "zod";

const textCarousel = {
  speed: z.number().optional(),
  text: z.array(z.string()).optional(),
};

// register({
//   id: "Hero",
//   meta: (c: SchemaContext) => ({
//     title: z.string(),
//     description: z.string(),
//     images: z.array(
//       ImageSource.zod(c)
//     ),
//   }),
//   render: Components.Hero,
// });
//
// register({
//   id: "Popular",
//   meta: (_: SchemaContext) => ({
//     title: z.string(),
//     id: z.string(),
//   }),
//   render: Components.Popular,
// });
//
// register({
//   id: "LessPopular",
//   meta: (_: SchemaContext) => ({
//     id: z.string(),
//     ...textCarousel
//   }),
//   render: Components.LessPopular,
// });
//
// register({
//   id: "TextCarousel",
//   meta: (_: SchemaContext) => (textCarousel),
//   render: Components.TextCarousel,
// });

register({
  id: "Slideshow",
  meta: Components.Slideshow.Meta.zod,
  render: Components.Slideshow,
});
