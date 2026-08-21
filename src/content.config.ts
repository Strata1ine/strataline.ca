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
	blog: defineCollection({
		loader: glob({ pattern: '**/*.{md,mdx}', base: './content/blog' }),
		schema: ({ image: contentImage }: SchemaContext) => {
			const mediaSize = z.enum(['hero', 'wide', 'pair', 'portrait', 'detail', 'gallery', 'slider']);
			const linkedParagraph = z.union([
				z.string(),
				z.object({
					before: z.string(),
					label: z.string(),
					href: z.string().startsWith('/'),
					after: z.string().default(''),
				}),
			]);
			const inlineMedia = z.object({
				image: contentImage(),
				alt: z.string(),
				caption: z.string().optional(),
			});
			const sectionMedia = z.discriminatedUnion('type', [
				z.object({
					type: z.literal('image'),
					size: mediaSize.default('wide'),
					image: contentImage(),
					alt: z.string(),
					caption: z.string(),
					presentation: z.enum(['standard', 'document']).default('standard'),
				}),
				z.object({
					type: z.literal('image-pair'),
					size: mediaSize.default('pair'),
					pairContext: z.string().optional(),
					pairNumber: z.coerce.number().int().positive().optional(),
					items: z.array(inlineMedia).length(2),
				}),
				z.object({
					type: z.literal('before-after'),
					size: mediaSize.default('slider'),
					beforeImage: contentImage(),
					afterImage: contentImage(),
					beforeAlt: z.string(),
					afterAlt: z.string(),
					caption: z.string(),
					pairContext: z.string().optional(),
					pairNumber: z.coerce.number().int().positive().optional(),
				}),
				z.object({
					type: z.literal('gallery'),
					size: mediaSize.default('gallery'),
					items: z.array(inlineMedia).min(2),
					layout: z.enum(['editorial', 'project']).default('editorial'),
				}),
			]);
			const contentBlock = z.discriminatedUnion('type', [
				z.object({
					type: z.literal('text'),
					eyebrow: z.string().optional(),
					heading: z.string(),
					paragraphs: z.array(linkedParagraph),
					listHeading: z.string().optional(),
					listItems: z.array(z.string()).default([]),
				}),
				z.object({
					type: z.literal('text-media'),
					eyebrow: z.string().optional(),
					heading: z.string(),
					paragraphs: z.array(linkedParagraph).min(1).max(2),
					listHeading: z.string().optional(),
					listItems: z.array(z.string()).default([]),
					media: sectionMedia,
				}),
				z.object({
					type: z.literal('image'),
					size: mediaSize.optional(),
					image: contentImage(),
					alt: z.string(),
					caption: z.string().optional(),
					layout: z.enum(['wide', 'detail']).default('wide'),
					presentation: z.enum(['standard', 'document']).default('standard'),
					actionLabel: z.string().optional(),
				}),
				z.object({
					type: z.literal('image-pair'),
					size: mediaSize.optional(),
					heading: z.string().optional(),
					caption: z.string().optional(),
					items: z.array(inlineMedia).length(2),
				}),
				z.object({
					type: z.literal('gallery'),
					eyebrow: z.string().optional(),
					size: mediaSize.optional(),
					purpose: z.enum(['editorial', 'finished-project']).default('editorial'),
					heading: z.string().optional(),
					items: z.array(inlineMedia).min(1),
				}),
				z.object({
					type: z.literal('video'),
					heading: z.string().optional(),
					source: z.string().startsWith('/'),
					poster: z.string().startsWith('/'),
					caption: z.string().optional(),
					preload: z.enum(['none', 'metadata']).default('none'),
				}),
				z.object({
					type: z.literal('related-story'),
					image: contentImage(),
					alt: z.string(),
					imageFit: z.enum(['cover', 'contain']).default('cover'),
					eyebrow: z.string(),
					title: z.string(),
					context: z.string(),
					href: z.string().startsWith('/'),
					linkLabel: z.string(),
				}),
				z.object({
					type: z.literal('related-stories'),
					eyebrow: z.string().default('RELATED PROJECTS'),
					heading: z.string().default('Related project stories'),
					items: z
						.array(
							z.object({
								image: contentImage(),
								alt: z.string(),
								location: z.string(),
								title: z.string(),
								context: z.string(),
								href: z.string().startsWith('/'),
								linkLabel: z.string().default('View project →'),
							}),
						)
						.min(2)
						.max(3),
				}),
				z.object({
					type: z.literal('before-after'),
					size: mediaSize.optional(),
					heading: z.string().optional(),
					beforeImage: contentImage(),
					afterImage: contentImage(),
					beforeAlt: z.string(),
					afterAlt: z.string(),
					caption: z.string(),
				}),
			]);

			return z.object({
				type: z.enum(['guide', 'case-study']).default('guide'),
				title: z.string(),
				seoTitle: z.string().optional(),
				heroHeading: z.string().optional(),
				heroIntro: z.string().optional(),
				heroEyebrow: z.string().optional(),
				socialImage: z.string().startsWith('/').optional(),
				schemaType: z.enum(['Article', 'BlogPosting']).default('Article'),
				description: z.string(),
				slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
				publishedDate: z.coerce.date(),
				updatedDate: z.coerce.date().optional(),
				category: z.enum([
					'Stairs',
					'Ceilings',
					'Interior Renovations',
					'Painting',
					'Kitchens & Bathrooms',
					'Doors & Windows',
					'Planning & Costs',
				]),
				featured: z.boolean(),
				hubProminence: z.enum(['lead']).optional(),
				heroImage: contentImage(),
				heroAlt: z.string(),
				heroPresentation: z.enum(['cover', 'document']).default('cover'),
				heroActionLabel: z.string().optional(),
				mediaBadge: z
					.object({
						image: contentImage(),
						alt: z.string(),
						label: z.string(),
						archiveLabel: z.string().optional(),
						sectionHeading: z.string().optional(),
					})
					.optional(),
				author: z.string(),
				location: z.string().optional(),
				service: z.string().optional(),
				challenge: z.string().optional(),
				scope: z.array(z.string()).default([]),
				solution: z.string().optional(),
				result: z.string().optional(),
				mediaRich: z.boolean().default(false),
				visualValidationOverride: z.string().min(20).optional(),
				mediaAudit: z
					.object({
						discovered: z.coerce.number().int().nonnegative(),
						used: z.array(
							z.object({
								source: z.string(),
								asset: z.string(),
							}),
						),
						excluded: z.array(
							z.object({
								source: z.string(),
								reason: z.string().min(8),
							}),
						),
					})
					.optional(),
				manualPairs: z
					.array(
						z.object({
							context: z.string(),
							number: z.coerce.number().int().positive(),
							before: z.string(),
							after: z.string(),
							presentation: z.enum(['pair', 'slider', 'before-after']),
						}),
					)
					.default([]),
				contentBlocks: z.array(contentBlock).default([]),
				beforeAfter: z
					.object({
						beforeImage: contentImage(),
						afterImage: contentImage(),
						beforeAlt: z.string(),
						afterAlt: z.string(),
						caption: z.string(),
					})
					.optional(),
				comparisons: z
					.array(
						z.object({
							id: z.string().regex(/^[a-z0-9-]+$/),
							heading: z.string().optional(),
							beforeImage: contentImage(),
							beforeAlt: z.string(),
							afterImage: contentImage(),
							afterAlt: z.string(),
							caption: z.string(),
						}),
					)
					.default([]),
				storySections: z
					.array(
						z.object({
							eyebrow: z.string().optional(),
							heading: z.string(),
							paragraphs: z.array(
								z.union([
									z.string(),
									z.object({
										before: z.string(),
										label: z.string(),
										href: z.string().startsWith('/'),
										after: z.string().default(''),
									}),
								]),
							),
							comparisonId: z.string().optional(),
							image: contentImage().optional(),
							imageAlt: z.string().optional(),
							imageCaption: z.string().optional(),
							listHeading: z.string().optional(),
							listItems: z.array(z.string()).default([]),
							gallery: z
								.array(
									z.object({
										image: contentImage(),
										alt: z.string(),
										caption: z.string().optional(),
									}),
								)
								.default([]),
						}),
					)
					.default([]),
				projectFacts: z
					.array(
						z.object({
							label: z.string(),
							value: z.string(),
						}),
					)
					.default([]),
				projectFactsCta: z
					.object({
						eyebrow: z.string(),
						label: z.string(),
						formProjectType: z.string(),
					})
					.optional(),
				homeownerQuestions: z
					.array(
						z.object({
							question: z.string(),
							answer: z.string(),
						}),
					)
					.default([]),
				homeownerInsights: z.array(z.string()).default([]),
				cta: z
					.object({
						heading: z.string(),
						text: z.string(),
						primaryLabel: z.string(),
						formProjectType: z.string().optional(),
					})
					.optional(),
				gallery: z
					.array(
						z.object({
							image: contentImage(),
							alt: z.string(),
							caption: z.string().optional(),
						}),
					)
					.default([]),
				video: z
					.object({
						enabled: z.boolean().default(true),
						source: z.string().startsWith('/'),
						poster: z.string().startsWith('/'),
						caption: z.string().optional(),
					})
					.optional(),
				review: z
					.object({
						enabled: z.boolean().default(true),
						reviewer: z.string().optional(),
						quote: z.string().optional(),
						service: z.string().optional(),
						image: contentImage().optional(),
						imageAlt: z.string().optional(),
					})
					.optional(),
				relatedServices: z
					.array(
						z.object({
							label: z.string(),
							href: z.string().startsWith('/'),
						}),
					)
					.min(1),
				draft: z.boolean(),
				takeaways: z.array(z.string()).min(1),
				tableOfContents: z.boolean().default(true),
			});
		},
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
