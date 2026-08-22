import type { APIRoute } from 'astro';
import { xmlResponse } from '@/lib/sitemap';

export const prerender = true;

export const GET: APIRoute = () => {
	const generated = new Date().toISOString();
	const files = [
		'project-stories.xml',
		'renovation-guides.xml',
		'library-hubs.xml',
		'project-images.xml',
	];
	return xmlResponse(`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${files.map((file) => `  <sitemap><loc>https://strataline.ca/sitemaps/${file}</loc><lastmod>${generated}</lastmod></sitemap>`).join('\n')}
</sitemapindex>`);
};
