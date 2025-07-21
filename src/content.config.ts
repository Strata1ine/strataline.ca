import {
  defineCollection, getEntry as _getEntry, getCollection as _getCollection,
  type SchemaContext, type CollectionEntry as _CollectionEntry, z
} from 'astro:content';

import { glob } from 'astro/loaders';

import { registry } from "@sections/registry";
import { updateComponentRegistry, parseRegistry } from "~/build/components";
import { imageSource } from '~/build/images';
updateComponentRegistry(registry);

export const collections = {
  index: defineCollection({
    loader: glob({ pattern: '*.yaml', base: './content' }),
    schema: (c: SchemaContext) => {
      return z.object({
        title: z.string(),
        desc: z.string(),
        popular: z.array(z.string()),
        components: parseRegistry(c),
      });
    },
  }),
  services: defineCollection({
    loader: glob({ pattern: '**/*.yaml', base: './content/services' }),
    schema: (c: SchemaContext) => z.object({
      title: z.string(),
      desc: z.string(),
      covers: z.array(imageSource(c)),
      draft: z.boolean().optional(),
    }),
  }),
};

export type Id = keyof typeof collections;
export type CollectionEntry<T extends Id> = _CollectionEntry<T>['data'];

export const getEntry = async <T extends Id>(
  collection: T,
  id: string
) => {
  const entry = await _getEntry(collection, id);
  if (!entry) throw new Error(`Requested entry '${id}' not found in collection: ${collection}. Please create a content/${id}.yaml`);
  return entry;
};

export const getCollection = async <T extends Id>(
  collection: T,
  filter?: (entry: _CollectionEntry<T>) => boolean
) => {
  const entries = await _getCollection(
    collection,
    filter ?? ((entry) => import.meta.env.DEV || !('draft' in entry.data && entry.data.draft))
  );

  if (!entries.length) console.warn(`No entries found in collection: ${collection}`);
  return entries;
};
