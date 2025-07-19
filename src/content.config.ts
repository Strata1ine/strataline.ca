import { defineCollection, getEntry, getCollection, type SchemaContext } from 'astro:content';
import { z } from 'zod';

import { parseRegistry } from "~/build/components";
import { imageSource } from '~/build/images';
import { glob } from 'astro/loaders';

import { registry } from "@sections/registry";
import { appendToRegistry } from "~/build/components";
appendToRegistry(registry);

export const collections = {
  index: defineCollection({
    loader: glob({ pattern: '*.yaml', base: './content/index' }),
    schema: (context: SchemaContext) =>
      z.object({
        title: z.string(),
        desc: z.string(),
        popular: z.array(z.string()),
        components: parseRegistry(context),
      }),
  }),
  services: defineCollection({
    loader: glob({ pattern: '**/*.yaml', base: './content/services' }),
    schema: (context: SchemaContext) => z.object({
      title: z.string(),
      desc: z.string(),
      covers: z.array(imageSource(context)),
      draft: z.boolean().optional(),
    }),
  }),
};


export const getIndex = async () => {
  const entry = await getEntry("index", "index");
  if (!entry) {
    throw new Error("Failed to fetch index data? Does `index` exist.");
  }
  return entry;
};

export const getServices = async () => {
  const services = await getCollection("services", ({ data }) => import.meta.env.DEV || !data?.draft);
  if (!services.length) {
    throw new Error("Failed to fetch services data? Have any services been defined.");
  }
  return services;
};
