import type { APIRoute } from 'astro';
import { getImage } from 'astro:assets';

import favicon from '@/icons/favicon.png';
const sizes = [32, 180, 512];

import business from '#/business.json';

export const pngIcons = Promise.all(
	sizes.map(async (size: number) => {
		const image = await getImage({
			src: favicon,
			width: size,
			height: size,
			format: 'png',
		});

		return {
			src: image.src,
			type: image.options.format,
			sizes: `${image.options.width}x${image.options.height}`,
		};
	}),
);

export const GET: APIRoute = async () => {
	const manifest = {
		name: business.name,
		description: business.description,
		start_url: '/',
		display: 'standalone',
		icons: await pngIcons,
	};

	return new Response(JSON.stringify(manifest));
};
