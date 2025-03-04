// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import AutoImport from 'astro-auto-import';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import compressor from 'astro-compressor';

import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  redirects: {
    '/services': '/',
  },
  site: 'https://strataline.ca',
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    AutoImport({
      imports: [
        {
          './src/components/buttons/': 'Btn',
          './src/components/sections/': 'Section',
          './src/components/cards/': 'Card',
          './src/components/variants.ts': 'Variant',
        },
      ],
    }),
    mdx({
      rehypePlugins: [rehypeUnwrapImages]
    }),
    sitemap(),
    compressor({
      fileExtensions: [".css", ".js", ".html", ".xml", ".cjs", ".mjs", ".svg", ".txt", ".json"]
    }),
    icon({
      include: {
        local: ["*"],
        ph: ["*"],
      },
    }),
  ],
});
