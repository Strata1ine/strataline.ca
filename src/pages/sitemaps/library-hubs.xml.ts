import type { APIRoute } from 'astro';
import { getPublishedBlogPosts } from '@/data/blog';
import { getEligibleCategories, getEligibleCities } from '@/data/projectsGuides';
import { xmlEscape, xmlResponse } from '@/lib/sitemap';

export const prerender = true;

export const GET: APIRoute = async () => {
	const posts = await getPublishedBlogPosts();
	const urls = [
		'/blog',
		...getEligibleCategories(posts).map((category) => `/blog/${category.slug}`),
		...getEligibleCities(posts).map((city) => `/blog/locations/${city.slug}`),
	];
	return xmlResponse(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>https://strataline.ca${xmlEscape(url)}</loc></url>`).join('\n')}
</urlset>`);
};
