import type { APIRoute } from 'astro';

const getRobotsTxt = (sitemapURL: URL, projectsGuidesSitemapURL: URL) => `
User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
Sitemap: ${projectsGuidesSitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
	const sitemapURL = new URL('sitemap-index.xml', site);
	const projectsGuidesSitemapURL = new URL('projects-guides-sitemap-index.xml', site);
	return new Response(getRobotsTxt(sitemapURL, projectsGuidesSitemapURL));
};
