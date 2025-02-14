// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';
import rehypeUnwrapImages from 'rehype-unwrap-images';

import purgecss from 'astro-purgecss';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [mdx({
    rehypePlugins: [rehypeUnwrapImages]
  }), purgecss()],
});