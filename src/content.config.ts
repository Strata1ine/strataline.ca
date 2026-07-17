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
import { parseBlocks } from 'astro-frontmatter-cms/integration';

export const collections = {
	index: defineCollection({
		loader: glob({ pattern: 'index.yaml', base: './content' }),
		schema: (c: SchemaContext) =>
			z.object({
				title: z.string(),
				desc: z.string(),
				popular: z.array(z.string()),
				sections: parseBlocks(c),
			}),
	}),
	services: defineCollection({
		loader: glob({ pattern: '**/index.yaml', base: './content/services' }),
		schema: (c: SchemaContext) => {
			const seo = z.union([
				z.string(),
				z.object({
					description: z.string(),
					noindex: z.boolean().optional(),
					indexableQuality: z.enum(['strong', 'medium', 'weak']).optional(),
				}),
			]);

			return z.object({
				startPos: ZPos.optional(),
				title: z.string(),
				desc: z.string(),
				seo,
				image: image(c),
				position: z.coerce.number().optional(),
				draft: z.boolean().optional(),
				generated: z.boolean().optional(),
				generator: z.string().optional(),
				qualityScore: z.coerce.number().optional(),
				hidden: z.boolean().optional(),
				sections: parseBlocks(c).optional(),
			});
		},
	}),
	projects: defineCollection({
		loader: glob({ pattern: '**/index.yaml', base: './content/projects' }),
		schema: (c: SchemaContext) =>
			z.object({
				title: z.string(),
				slug: z.string(),
				location: z.string(),
				summary: z.string(),
				services: z.array(z.string()),
				cover: image(c),
				gallery: z.array(image(c)).default([]),
				before: z.array(image(c)).default([]),
				after: z.array(image(c)).default([]),
				challenges: z.array(z.string()).default([]),
				scope: z.array(z.string()).default([]),
				materials: z.array(z.string()).default([]),
				testimonialReference: z.string().optional(),
				completionYear: z.coerce.number().optional(),
				featured: z.boolean().default(false),
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
