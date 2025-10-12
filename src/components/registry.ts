// export const registry = {
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
// } as const;
