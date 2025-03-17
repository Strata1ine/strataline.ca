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
    build: {
      assetsInlineLimit: 0,
    },
  },
  image: {
    experimentalLayout: 'responsive',
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        quality: 20,
        format: 'webp'
      },
    },
  },
  experimental: {
    responsiveImages: true,
  },
  integrations: [
    (await import("astro-compress")).default({
      CSS: true,
      HTML: true,
      Image: false,
      JavaScript: true,
      SVG: true,
    }),
    AutoImport({
      imports: [
        {
          './src/components/em/': 'E',
          './src/components/inputs/': 'Input',
          './src/components/sections/': 'Section',
          './src/components/cards/': 'Card',
          './src/components/variants.ts': 'Variant',
          'astro:assets': ['Image']
        },
      ],
    }),
    mdx({
      rehypePlugins: [rehypeUnwrapImages]
    }),
    sitemap(),
    compressor(),
    icon({
      include: {
        local: ["*"],
        ph: ["*"],
      },
    }),
  ],
});
