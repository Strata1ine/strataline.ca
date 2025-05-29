import { defineCollection, type SchemaContext } from 'astro:content';
import { z } from 'zod';

import { buildSchemaRegistery as c } from "@build/components";

import "@/registery";

export const collections = {
  index: defineCollection({
    type: "data",
    schema: (context: SchemaContext) => z.object({
      title: z.string(),
      description: z.string(),
      components: c(context),
    }),
  }),
};
