// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import rehypeUnwrapImages from 'rehype-unwrap-images';

import tailwindcss from '@tailwindcss/vite';

import playformCompress from '@playform/compress';

// https://astro.build/config
export default defineConfig({
  experimental: {
    svg: true,
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    mdx({
      rehypePlugins: [rehypeUnwrapImages]
    }), playformCompress()],
});
