// @ts-check
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

import { frontmatterComponents, glob } from 'astro-frontmatter-components';

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
				name: 'Cormorant',
				cssVariable: '--font-cormorant',
				provider: fontProviders.fontsource(),
				weights: [500, 600, 700],
				styles: ['normal'],
				subsets: ['latin'],
			},
			{
				name: 'DM Sans',
				cssVariable: '--font-dm-sans',
				provider: fontProviders.fontsource(),
				weights: [400],
				styles: ['normal', 'italic'],
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
				emitFile: true,
				filename: 'stats.html',
			}),
		],
	},
	integrations: [
		sitemap({
			filter: (page) => !page.includes('/submissions/'),
		}),
		icon({
			include: {
				local: ['*'],
				ph: ['*'],
			},
		}),
		solidJs(),
		frontmatterComponents({
			components: glob('./src/sections/**/*.astro'),
		}),
	],
	redirects: redirects,
});
