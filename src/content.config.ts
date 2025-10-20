import {
	defineCollection,
	getEntry as _getEntry,
	getCollection as _getCollection,
	type SchemaContext,
	type CollectionEntry as _CollectionEntry,
	z,
} from 'astro:content';

import { glob } from 'astro/loaders';
import { image, ZPos } from './schemas';
import { parseBlocks } from 'astro-frontmatter-components/integration';

export const collections = {
	index: defineCollection({
		loader: glob({ pattern: '*.yaml', base: './content' }),
		schema: (c: SchemaContext) =>
			z.object({
				title: z.string(),
				desc: z.string(),
				popular: z.array(z.string()),
				sections: parseBlocks(c),
			}),
	}),
	services: defineCollection({
		loader: glob({ pattern: '**/*.yaml', base: './content/services' }),
		schema: (c: SchemaContext) =>
			z.object({
				startPos: ZPos.optional(),
				title: z.string(),
				desc: z.string(),
				seo: z.string(),
				image: z.object(image(c)),
				draft: z.boolean().optional(),
				sections: parseBlocks(c).optional(),
			}),
	}),
};

export type Id = keyof typeof collections;
export type CollectionEntry<T extends Id> = _CollectionEntry<T>;

export const getEntry = async <T extends Id>(collection: T, id: string) => {
	const entry = await _getEntry(collection, id);
	if (!entry)
		throw new Error(
			`Requested entry '${id}' not found in collection: ${collection}. Please create a content/${id}.yaml`,
		);
	return entry;
};

export const getCollection = async <T extends Id>(
	collection: T,
	filter?: (entry: CollectionEntry<T>) => boolean,
) => {
	const entries = await _getCollection(
		collection,
		filter ?? ((entry) => import.meta.env.DEV || !('draft' in entry.data && entry.data.draft)),
	);

	if (!entries.length) console.warn(`No entries found in collection: ${collection}`);
	return entries;
};
