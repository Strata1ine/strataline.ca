import { defineCollection, type SchemaContext } from 'astro:content';
import { z } from 'zod';

import { buildSchemaRegistery as c } from "@build/components";
import { ImageSource } from '@build/meta';
import "@/registery";

export const collections = {
  index: defineCollection({
    type: "data",
    schema: (context: SchemaContext) => z.object({
      title: z.string(),
      desc: z.string(),
      popular: z.array(z.string()),
      components: c(context),
    }),
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
