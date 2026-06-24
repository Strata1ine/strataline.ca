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

<<<<<<< HEAD
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

const forcedRedirectPaths = new Set([
	'/services/garage-doors',
	'/services/garage-doors.html',
	'/services/garage-door-openers',
	'/services/garage-door-openers.html',
	'/services/garage-door-spring-repair',
	'/services/garage-door-spring-repair.html',
	'/services/energy-efficient-home-upgrades',
	'/services/energy-efficient-home-upgrades.html',
	'/services/energy-efficient-upgrades',
	'/services/energy-efficient-upgrades.html',
]);

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
						const [from] = line.split(/\s+/, 1);
						if (
							!forcedRedirectPaths.has(from) &&
							!/^\/\S+\.html\s+\S+\s+30[1278]$/.test(line)
						) {
							return line;
						}
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

=======
>>>>>>> max
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
				const pathname = new URL(page).pathname.replace(/\/$/, '');
				if (pathname.includes('/submissions/')) return false;
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
<<<<<<< HEAD
	redirects: {
		...htmlRedirects,
		...redirects,
	},
=======
	redirects: redirects,
>>>>>>> max
});
