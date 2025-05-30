// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from "@tailwindcss/vite";
import svelte from "@astrojs/svelte";
import compressor from "astro-compressor";

// https://astro.build/config
export default defineConfig({
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  experimental: {
    clientPrerender: true,
    // responsiveImages: true,
  },
  compressHTML: true,
  vite: { plugins: [tailwindcss()], },
  integrations: [svelte(), compressor(), (await import("@playform/compress")).default({
    CSS: true,
    HTML: false,
    Image: false,
    JavaScript: true,
    JSON: true,
    SVG: true,
  })],
});
