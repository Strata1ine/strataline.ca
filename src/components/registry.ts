// export const registry = {
// 	Header: {
// 		schema: (_: SchemaContext) => ({
// 			id: z.string().optional(),
// 			content: z.array(z.object({ id: z.string(), name: z.string() })),
// 		}),
// 		load: () => import('./sections/Header.astro'),
// 	},
//
// 	Hero: {
// 		schema: (c: SchemaContext) => ({
// 			id: z.string().optional(),
// 			title: z.string(),
// 			desc: z.string(),
// 			speed: z.number().default(5.0),
// 			content: z.array(image(c)),
// 		}),
// 		load: () => import('./sections/Hero.astro'),
// 	},
//
// 	Popular: {
// 		schema: (_: SchemaContext) => ({
// 			id: z.string().optional(),
// 			pos: DefaultPos,
// 			title: z.string(),
// 		}),
// 		load: () => import('./sections/Popular.astro'),
// 	},
//
// 	Services: {
// 		schema: (_: SchemaContext) => ({
// 			id: z.string().optional(),
// 			pos: DefaultPos,
// 			title: z.string().default("There's more to explore"),
// 			exclude: z.array(z.string()).optional(),
// 			content: z.object(textCarousel).optional(),
// 		}),
// 		load: () => import('./sections/Services.astro'),
// 	},
//
// 	TextCarousel: {
// 		schema: (_: SchemaContext) => textCarousel,
// 		load: () => import('./sections/TextCarousel.astro'),
// 	},
//
// 	ImageCarousel: {
// 		schema: (c: SchemaContext) => ({
// 			speed: z.number().optional().default(1.0),
// 			content: z.array(image(c)),
// 		}),
// 		load: () => import('./sections/ImageCarousel.astro'),
// 	},
//
// 	Cardshow: {
// 		schema: (c: SchemaContext) => ({
// 			id: z.string().optional(),
// 			pos: DefaultPos,
// 			title: z.string(),
// 			speed: z.number().default(5.0),
// 			content: z.array(
// 				z.object({
// 					title: z.string(),
// 					desc: z.string(),
// 					id: z.string().optional(),
// 					media: media(c),
// 					link: z
// 						.object({
// 							name: z.string(),
// 							url: z.string(),
// 						})
// 						.optional(),
// 				}),
// 			),
// 		}),
// 		load: () => import('./sections/Cardshow.astro'),
// 	},
//
// 	Reviews: {
// 		schema: (_: SchemaContext) => ({
// 			id: z.string().optional(),
// 			pos: DefaultPos,
// 			title: z.string(),
// 			content: z.array(
// 				z.object({
// 					title: z.string(),
// 					desc: z.string(),
// 					date: z.coerce.date().optional(),
// 					url: z.string().optional(),
// 					location: z.string(),
// 					stars: z.number(),
// 					id: z.string().optional(),
// 				}),
// 			),
// 		}),
// 		load: () => import('./sections/Reviews.astro'),
// 	},
//
// 	Benefits: {
// 		schema: (_: SchemaContext) => ({
// 			id: z.string().optional(),
// 			pos: DefaultPos,
// 			title: z.string(),
// 			content: z.array(
// 				z.object({
// 					title: z.string(),
// 					desc: z.string(),
// 				}),
// 			),
// 		}),
// 		load: () => import('./sections/Benefits.astro'),
// 	},
//
// 	ImagePanel: {
// 		schema: (c: SchemaContext) => ({
// 			id: z.string().optional(),
// 			pos: DefaultPos,
// 			title: z.string(),
// 			content: z.array(
// 				z.object({
// 					title: z.string(),
// 					image: image(c),
// 				}),
// 			),
// 		}),
// 		load: () => import('./sections/ImagePanel.astro'),
// 	},
//
// 	Faq: {
// 		schema: (_: SchemaContext) => ({
// 			id: z.string().optional(),
// 			pos: DefaultPos,
// 			title: z.string(),
// 			content: z.array(
// 				z.object({
// 					title: z.string(),
// 					desc: z.string(),
// 				}),
// 			),
// 		}),
// 		load: () => import('./sections/Faq.astro'),
// 	},
//
// 	ZigZag: {
// 		schema: (c: SchemaContext) => ({
// 			id: z.string().optional(),
// 			pos: DefaultPos,
// 			title: z.string(),
// 			content: z.array(
// 				z.object({
// 					title: z.string(),
// 					desc: z.string(),
// 					image: image(c),
// 				}),
// 			),
// 		}),
// 		load: () => import('./sections/ZigZag.astro'),
// 	},
//
// 	Prices: {
// 		schema: (_: SchemaContext) => ({
// 			id: z.string().optional(),
// 			pos: DefaultPos,
// 			title: z.string(),
// 			content: z.array(
// 				z.object({
// 					title: z.string(),
// 					min: z.number().min(0),
// 					max: z.number().min(0),
// 					materials: z.array(z.string()),
// 					desc: z.string(),
// 				}),
// 			),
// 		}),
// 		load: () => import('./sections/Prices.astro'),
// 	},
// } as const;
