import type { APIRoute } from 'astro';
import { getPublishedBlogPosts } from '@/data/blog';
import { getContentType } from '@/data/projectsGuides';
import { xmlEscape, xmlResponse } from '@/lib/sitemap';

export const prerender = true;

export const GET: APIRoute = async () => {
	const posts = (await getPublishedBlogPosts()).filter(
		(post) => getContentType(post) === 'renovation-guide',
	);
	return xmlResponse(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${posts.map((post) => `  <url><loc>https://strataline.ca/blog/${xmlEscape(post.data.slug)}</loc><lastmod>${(post.data.updatedDate ?? post.data.publishedDate).toISOString()}</lastmod></url>`).join('\n')}
</urlset>`);
};
