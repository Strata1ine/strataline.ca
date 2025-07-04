import { defineCollection, getCollection, getEntry, type SchemaContext } from 'astro:content';
import { z } from 'zod';

import { buildSchemaRegistery as c } from "~/build/components";
import { ImageSource } from '~/build/meta';
import { register, clearRegistry } from "~/build/components";

import * as Meta from "@/meta";
import * as Components from "@/index";

export const collections = {
  index: defineCollection({
    type: "data",
    schema: (context: SchemaContext) =>
      z.object({
        title: z.string(),
        desc: z.string(),
        popular: z.array(z.string()),
        components: c(context),
      }),
  }),
  services: defineCollection({
    type: "data",
    schema: (context: SchemaContext) => z.object({
      title: z.string(),
      desc: z.string(),
      covers: z.array(ImageSource.zod(context)),
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

clearRegistry();
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
