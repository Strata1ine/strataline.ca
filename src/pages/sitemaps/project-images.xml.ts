import type { APIRoute } from 'astro';
import { getImage } from 'astro:assets';
import { getPublishedBlogPosts } from '@/data/blog';
import { getContentType } from '@/data/projectsGuides';
import { xmlEscape, xmlResponse } from '@/lib/sitemap';

export const prerender = true;

export const GET: APIRoute = async () => {
	const posts = (await getPublishedBlogPosts()).filter(
		(post) => getContentType(post) === 'project-story',
	);
	const rows = await Promise.all(
		posts.map(async (post) => {
			const image = await getImage({
				src: post.data.heroImage,
				width: 1600,
				format: 'jpg',
				quality: 88,
			});
			return `  <url>
    <loc>https://strataline.ca/blog/${xmlEscape(post.data.slug)}</loc>
    <image:image>
      <image:loc>https://strataline.ca${xmlEscape(image.src)}</image:loc>
      <image:title>${xmlEscape(post.data.title)}</image:title>
      <image:caption>${xmlEscape(post.data.heroAlt)}</image:caption>
    </image:image>
  </url>`;
		}),
	);
	return xmlResponse(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${rows.join('\n')}
</urlset>`);
};
