// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import yaml from '@rollup/plugin-yaml';
import netlify from '@astrojs/netlify';
import redirects from './content/redirects.json';
import { visualizer } from 'rollup-plugin-visualizer';

import solidJs from '@astrojs/solid-js';

import { frontmatterComponents, glob } from 'astro-frontmatter-cms/integration';

import compressor from 'astro-compressor';

const root = path.dirname(fileURLToPath(import.meta.url));
const servicesRoot = path.join(root, 'content', 'services');
const blogRoot = path.join(root, 'content', 'blog');

/**
 * @param {string} dir
 * @returns {string[]}
 */
function walkFiles(dir) {
	if (!fs.existsSync(dir)) return [];
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = path.join(dir, entry.name);
		return entry.isDirectory() ? walkFiles(full) : [full];
	});
}

const indexableServicePaths = new Set(
	walkFiles(servicesRoot)
		.filter((file) => path.basename(file) === 'index.yaml')
		.filter((file) => {
			const text = fs.readFileSync(file, 'utf8');
			if (/^\s*hidden:\s*true\s*$/m.test(text)) return false;
			if (/^\s*noindex:\s*true\s*$/m.test(text)) return false;
			if (/^\s*indexableQuality:\s*weak\s*$/m.test(text)) return false;
			return true;
		})
		.map((file) => {
			const relative = path.relative(servicesRoot, path.dirname(file)).replaceAll(path.sep, '/');
			return `/services/${relative}`.replace(/\/index$/, '');
		}),
);

const indexableBlogPaths = new Set(
	walkFiles(blogRoot)
		.filter((file) => /\.mdx?$/.test(file))
		.flatMap((file) => {
			const text = fs.readFileSync(file, 'utf8');
			const frontmatter = text.match(/^---\s*([\s\S]*?)\s*---/)?.[1] ?? '';
			if (/^\s*draft:\s*true\s*$/m.test(frontmatter)) return [];
			if (/^\s*indexable:\s*false\s*$/m.test(frontmatter)) return [];
			if (/^\s*qualityTier:\s*C\s*$/m.test(frontmatter)) return [];
			if (/^\s*contentType:\s*archive-project\s*$/m.test(frontmatter)) return [];
			const slug = frontmatter.match(/^\s*slug:\s*([a-z0-9-]+)\s*$/m)?.[1];
			return slug ? [`/blog/${slug}`] : [];
		}),
);

const indexableBlogHubPaths = new Set([
	'/blog',
	'/blog/stairs',
	'/blog/ceilings',
	'/blog/bathrooms',
	'/blog/condos',
	'/blog/interior-renovations',
	'/blog/doors-windows',
	'/blog/flooring',
	'/blog/painting',
	'/blog/basements',
	'/blog/planning-costs',
	'/blog/locations/toronto',
]);

const isIndexableBlogHubPath = (pathname) =>
	indexableBlogHubPaths.has(pathname) ||
	/^\/blog\/page\/\d+$/.test(pathname) ||
	/^\/blog\/[a-z0-9-]+\/page\/\d+$/.test(pathname) ||
	/^\/blog\/locations\/[a-z0-9-]+\/page\/\d+$/.test(pathname);

const indexableStaticPaths = new Set([
	'/',
	'/interior-renovations',
	...indexableBlogHubPaths,
	'/privacy',
	'/reviews',
	'/services/popcorn-removal',
	'/services/stairs',
	'/tos',
]);

const htmlRedirects = Object.fromEntries([
	['/index.html', '/'],
	...[...indexableStaticPaths, ...indexableServicePaths, ...indexableBlogPaths]
		.filter((pathname) => pathname !== '/')
		.map((pathname) => [`${pathname}.html`, pathname]),
]);

// https://astro.build/config
export default defineConfig({
	adapter: netlify({
		edgeMiddleware: true,
		experimentalStaticHeaders: true,
		cacheOnDemandPages: true,
	}),
	trailingSlash: 'never',
	site: 'https://strataline.ca',
	build: {
		inlineStylesheets: 'never',
		assets: '_',
		format: 'file',
	},
	prefetch: {
		prefetchAll: true,
		defaultStrategy: 'hover',
	},
	devToolbar: { enabled: true },
	experimental: {
		clientPrerender: true,
		failOnPrerenderConflict: true,
		contentIntellisense: true,
		fonts: [
			{
				name: 'Source Serif 4',
				cssVariable: '--font-source-serif-4',
				provider: fontProviders.fontsource(),
				weights: [400, 500, 600],
				styles: ['normal'],
				subsets: ['latin'],
			},
			{
				name: 'Inter',
				cssVariable: '--font-inter',
				provider: fontProviders.fontsource(),
				weights: [400, 600],
				styles: ['normal'],
				subsets: ['latin'],
			},
		],
	},
	compressHTML: true,
	vite: {
		build: {
			sourcemap: true,
		},
		plugins: [
			yaml(),
			tailwindcss(),
			Icons({
				compiler: 'solid',
				autoInstall: true,
			}),
			visualizer({
				sourcemap: true,
				emitFile: true,
				filename: 'stats.html',
			}),
		],
	},
	integrations: [
		frontmatterComponents(),
		sitemap({
			filter: (page) => {
				const pathname = new URL(page).pathname.replace(/\/$/, '');
				if (pathname.includes('/submissions/')) return false;
				if (pathname.startsWith('/blog/'))
					return indexableBlogPaths.has(pathname) || isIndexableBlogHubPath(pathname);
				if (pathname.startsWith('/services/')) return indexableServicePaths.has(pathname);
				return true;
			},
		}),
		icon({
			include: {
				local: ['*'],
				ph: ['*'],
			},
		}),
		solidJs(),
		compressor(),
	],
	redirects: { ...htmlRedirects, ...redirects },
});
