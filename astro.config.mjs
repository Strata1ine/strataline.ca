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
  },
  prefetch: true,
  site: 'https://strataline.ca',
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
  integrations: [(await import("astro-compress")).default({
    CSS: true,
    HTML: true,
    Image: false,
    JavaScript: true,
    SVG: true,
  }), AutoImport({
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
  }), mdx({
    rehypePlugins: [rehypeUnwrapImages, [rehypeAddImageProps, config.globalDefaults.imageAttr]],
    // optimizeImages: false
  }), sitemap({
    filter: (page) =>
      page !== 'https://strataline.ca/submissions/contact/'
  }), compressor(), icon({
    include: {
      local: ["*"],
      ph: ["*"],
    },
  }), react(), svelte()],
});