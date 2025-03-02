// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import AutoImport from 'astro-auto-import';

import tailwindcss from '@tailwindcss/vite';
import playformCompress from '@playform/compress';
import sitemap from '@astrojs/sitemap';
import compressor from 'astro-compressor';

// https://astro.build/config
export default defineConfig({
  redirects: {
    '/services': '/',
  },
  site: 'https://strataline.ca',
  experimental: {
    svg: true,
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [AutoImport({
    imports: [
      {
        './src/components/buttons/': 'Btn',
        './src/components/sections/': 'Section',
        './src/components/cards/': 'Card',
        './src/components/nav/': 'Nav',
        './src/components/variants.ts': 'Variant',
      },
    ],
  }), mdx({
    rehypePlugins: [rehypeUnwrapImages]
  }), playformCompress(), sitemap(), compressor()],
});
