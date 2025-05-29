// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from "@tailwindcss/vite";
import solidJs from "@astrojs/solid-js";

import compressor from "astro-compressor";

import playformCompress from "@playform/compress";

// https://astro.build/config
export default defineConfig({
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  experimental: {
    clientPrerender: true,
    responsiveImages: true,
  },
  compressHTML: true,
  vite: { plugins: [tailwindcss()], },
  integrations: [solidJs(), compressor(), playformCompress()],
});