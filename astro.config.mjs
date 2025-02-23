// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import rehypeUnwrapImages from 'rehype-unwrap-images';

import tailwindcss from '@tailwindcss/vite';

import playformCompress from '@playform/compress';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://strataline.ca',
  experimental: {
    svg: true,
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [mdx({
    rehypePlugins: [rehypeUnwrapImages]
  }), playformCompress(), sitemap()],
});
