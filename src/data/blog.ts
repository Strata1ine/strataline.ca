import type { CollectionEntry } from '@/content.config';
import { getCollection } from '@/content.config';

export const blogCategories = [
	'All',
	'Project Stories',
	'Renovation Guides',
	'Stairs',
	'Ceilings',
	'Painting',
	'Interior Renovations',
	'Kitchens & Bathrooms',
	'Doors & Windows',
	'Planning & Costs',
] as const;

export type BlogPost = CollectionEntry<'blog'>;

export const getPublishedBlogPosts = async () => {
	const posts = await getCollection('blog', (entry) => !entry.data.draft);
	return posts.sort((a, b) => b.data.publishedDate.getTime() - a.data.publishedDate.getTime());
};

export const getReadingTime = (body = '') => {
	const words = body
		.replace(/---[\s\S]*?---/, '')
		.replace(/[`#>*_\[\]()|-]/g, ' ')
		.trim()
		.split(/\s+/)
		.filter(Boolean).length;
	return Math.max(1, Math.ceil(words / 220));
};

export const formatBlogDate = (date: Date) =>
	new Intl.DateTimeFormat('en-CA', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC',
	}).format(date);
