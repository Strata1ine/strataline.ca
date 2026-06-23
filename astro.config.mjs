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

const extensionlessRoutes = [
	'/',
	'/privacy',
	'/reviews',
	'/tos',
	'/submissions/review',
	'/submissions/talk',
];

function walkFiles(dir) {
	if (!fs.existsSync(dir)) return [];
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = path.join(dir, entry.name);
		return entry.isDirectory() ? walkFiles(full) : [full];
	});
}

function stripHtmlExtension(pathname) {
	if (pathname === '/index.html') return '/';
	return pathname.replace(/\.html$/, '');
}

function normalizePathname(pathname) {
	const extensionless = stripHtmlExtension(pathname);
	return extensionless === '/' ? '/' : extensionless.replace(/\/$/, '');
}

function normalizeUrl(url) {
	const normalized = new URL(url);
	normalized.pathname = normalizePathname(normalized.pathname);
	return normalized.href;
}

const servicePaths = walkFiles(servicesRoot)
	.filter((file) => path.basename(file) === 'index.yaml')
	.map((file) => {
		const relative = path.relative(servicesRoot, path.dirname(file)).replaceAll(path.sep, '/');
		return `/services/${relative}`.replace(/\/index$/, '');
	});

const indexableServicePaths = new Set(
	servicePaths
		.filter((file) => {
			const serviceFile = path.join(servicesRoot, file.replace(/^\/services\//, ''), 'index.yaml');
			const text = fs.readFileSync(serviceFile, 'utf8');
			if (/^\s*hidden:\s*true\s*$/m.test(text)) return false;
			if (/^\s*noindex:\s*true\s*$/m.test(text)) return false;
			if (/^\s*indexableQuality:\s*weak\s*$/m.test(text)) return false;
			return true;
		}),
);

const htmlRedirects = Object.fromEntries(
	[
		'/index',
		...extensionlessRoutes,
		...servicePaths,
		...Object.keys(redirects).map((pathname) => normalizePathname(pathname)),
	]
		.map((pathname) => normalizePathname(pathname))
		.filter((pathname, index, paths) => paths.indexOf(pathname) === index)
		.map((pathname) => [
			pathname === '/' ? '/index.html' : `${pathname}.html`,
			{
				status: 301,
				destination: pathname,
			},
		]),
);

function forceHtmlRedirects() {
	return {
		name: 'force-html-redirects',
		hooks: {
			'astro:build:done': ({ dir }) => {
				const redirectsFile = fileURLToPath(new URL('_redirects', dir));
				if (!fs.existsSync(redirectsFile)) return;

				const redirectsText = fs.readFileSync(redirectsFile, 'utf8');
				const updatedText = redirectsText
					.split(/\r?\n/)
					.map((line) => {
						if (!/^\/\S+\.html\s+\S+\s+30[1278]$/.test(line)) return line;
						return line.replace(/\s+(30[1278])$/, ' $1!');
					})
					.join('\n');

				if (updatedText !== redirectsText) {
					fs.writeFileSync(redirectsFile, updatedText);
				}
			},
		},
	};
}

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
		format: 'directory',
		redirects: false,
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
				name: 'Cormorant Garamond',
				cssVariable: '--font-cormorant-garamond',
				provider: fontProviders.fontsource(),
				weights: [500, 700],
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
				if (page.includes('.html')) return false;
				const pathname = normalizePathname(new URL(page).pathname);
				if (pathname.includes('/submissions/')) return false;
				if (pathname.startsWith('/services/')) return indexableServicePaths.has(pathname);
				return true;
			},
			serialize: (item) => ({
				...item,
				url: normalizeUrl(item.url),
			}),
		}),
		forceHtmlRedirects(),
		icon({
			include: {
				local: ['*'],
				ph: ['*'],
			},
		}),
		solidJs(),
		compressor(),
	],
	redirects: {
		...redirects,
		...htmlRedirects,
	},
});
