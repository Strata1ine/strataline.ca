// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from "@tailwindcss/vite";
import svelte from "@astrojs/svelte";
import compressor from "astro-compressor";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  experimental: {
    clientPrerender: true,
  },
  compressHTML: true,
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
    svelte(),
    compressor(),
    icon(),
    (await import("@playform/compress")).default({
      CSS: true,
      HTML: {
        "html-minifier-terser": {
          removeEmptyAttributes: false,
          removeComments: false,
          removeAttributeQuotes: false,
          collapseWhitespace: false,
          conservativeCollapse: true,
        }
      },
      Image: true,
      JavaScript: true,
      JSON: true,
      SVG: true,
    })
  ],
});
