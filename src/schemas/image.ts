import { type SchemaContext, z } from 'astro:content';

export const image = (c: SchemaContext) =>
	z.object({
		src: c.image(),
		alt: z.string(),
		x: z.enum(['left', 'right']).optional(),
		y: z.enum(['top', 'bottom']).optional(),
	});

export type ImageSource = z.infer<ReturnType<typeof image>>;
