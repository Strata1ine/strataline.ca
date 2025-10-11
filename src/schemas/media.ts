import { type SchemaContext, z } from 'astro:content';
import { image } from './image';

export const media = (c: SchemaContext) => {
	return z.union([
		z.object({
			type: z.literal('image'),
			image: z.object(image(c)),
		}),
		z.object({
			type: z.literal('video'),
			image: z.object(image(c)),
			uploadDate: z.coerce.date(),
			url: z.string(),
		}),
		z.object({
			type: z.literal('yt-video'),
			id: z.string(),
		}),
	]);
};
