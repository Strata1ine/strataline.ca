// @ts-check
import { defineConfig } from 'astro/config';
import { config } from './src/config';
import mdx from '@astrojs/mdx';

import rehypeUnwrapImages from 'rehype-unwrap-images';
import AutoImport from 'astro-auto-import';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import compressor from 'astro-compressor';

import icon from 'astro-icon';
import react from '@astrojs/react';

import { visit } from "unist-util-visit";

import svelte from '@astrojs/svelte';

function rehypeAddImageProps(props) {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "img") {
        node.properties = {
          ...node.properties,
          ...props,
        };
      }
    });
  };
}

// https://astro.build/config
export default defineConfig({
  redirects: {
    '/services': '/',
    '/stairs': '/services/stairs/',
    '/kitchens': '/services/kitchens/',
    '/bathrooms': '/services/bathrooms/',
    '/popcorn-removal': '/services/popcorn-removal/',

    // old meta
    '/kitchen': '/services/kitchens/',
    '/bathroom-remodeling': '/services/bathrooms/',
    '/home-renovation/ceiling/smooth-ceiling': '/services/popcorn-removal/',
    '/stair-refinishing-in-toronto-ontario': '/services/stairs/',
    '/stair-refinishing-in-vaughan-ontario': '/services/stairs/',
    '/stair-refinishing-in-barrie-ontario': '/services/stairs/',
    '/stair-refinishing-in-oakville-ontario': '/services/stairs/',
    '/stair-refinishing-in-burlington-ontario': '/services/stairs/',
    '/stair-refinishing-in-bowmanville-ontario': '/services/stairs/',
    '/stair-refinishing-in-hamilton-ontario/': '/services/stairs/',
    '/hardwood-floor-refinishing': '/',
  },
  prefetch: true,
  site: config.site,
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        quality: 20,
      },
    },
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
          './src/components/div/': 'Div',
          './src/components/e/': 'E',
          './src/components/inputs/': 'Input',
          './src/components/sections/': 'Section',
          './src/components/cards/': 'Card',
          './src/components/variants.ts': 'Variant',
        },
      ],
    }),
    mdx({
      rehypePlugins: [rehypeUnwrapImages, [rehypeAddImageProps, { ...config.globalDefaults.imageAttr, slot: "image" }]],
    }),
    sitemap({
      filter: (page) =>
        page !== `${config.site}/submissions/contact/` &&
        page !== `${config.site}/submissions/review/`
    }),
    compressor(),
    icon({
      include: {
        local: ["*"],
        ph: ["*"],
      },
    }),
    react(),
    svelte(),
  ],
});
