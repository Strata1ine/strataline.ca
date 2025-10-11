const media = (c: SchemaContext) => {
	return z.union([
		z.object({
			type: z.literal('image'),
			image: image(c),
		}),
		z.object({
			type: z.literal('video'),
			image: image(c),
			uploadDate: z.coerce.date(),
			url: z.string(),
		}),
		z.object({
			type: z.literal('yt-video'),
			id: z.string(),
		}),
	]);
};
