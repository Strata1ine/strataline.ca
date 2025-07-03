import { defineCollection, type SchemaContext } from 'astro:content';
import { z } from 'zod';

import { buildSchemaRegistery as c } from "~/build/components";
import { ImageSource } from '~/build/meta';
import { register } from "~/build/components";

import * as Meta from "@/meta";
import * as Components from "@/index";

export const collections = {
  index: defineCollection({
    type: "data",
    schema: (context: SchemaContext) => {
      return z.object({
        title: z.string(),
        desc: z.string(),
        popular: z.array(z.string()),
        components: c(context),
      });
    },
  }),
  services: defineCollection({
    type: "data",
    schema: (c: SchemaContext) => z.object({
      title: z.string(),
      desc: z.string(),
      covers: z.array(ImageSource.zod(c)),
      draft: z.boolean().optional(),
    }),
  }),
};

register({
  id: "Hero",
  meta: Meta.Hero.zod,
  render: Components.Hero,
});


register({
  id: "Popular",
  meta: Meta.Popular.zod,
  render: Components.Popular,
});

register({
  id: "LessPopular",
  meta: Meta.LessPopular.zod,
  render: Components.LessPopular,
});
//
// register({
//   id: "TextCarousel",
//   meta: (_: SchemaContext) => (textCarousel),
//   render: Components.TextCarousel,
// });

register({
  id: "Cardshow",
  meta: Meta.Cardshow.zod,
  render: Components.Cardshow,
});


register({
  id: "Review",
  meta: Meta.Review.zod,
  render: Components.Review,
});
