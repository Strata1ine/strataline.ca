// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from "@tailwindcss/vite";

import compressor from "astro-compressor";

import playformCompress from "@playform/compress";

import svelte from "@astrojs/svelte";

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
  integrations: [compressor(), playformCompress(), svelte()],
});
