// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from "@tailwindcss/vite";
import svelte from "@astrojs/svelte";
import compressor from "astro-compressor";
import icon from "astro-icon";
import sitemap from '@astrojs/sitemap';
import yaml from '@rollup/plugin-yaml';
import netlify from '@astrojs/netlify';
import redirects from "./content/redirects.json";
import { visualizer } from "rollup-plugin-visualizer";

// https://astro.build/config
export default defineConfig({
  adapter: netlify({
    edgeMiddleware: true,
    experimentalStaticHeaders: true,
    cacheOnDemandPages: true,
  }),
  trailingSlash: 'never',
  site: 'https://strataline.ca',
  build: {
    inlineStylesheets: 'never',
    assets: '_',
    format: 'file',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  devToolbar: { enabled: false },
  experimental: {
    clientPrerender: true,
    failOnPrerenderConflict: true,
    contentIntellisense: true,
    fonts: [
      {
        name: "Cormorant Garamond",
        cssVariable: "--font-cormorant",
        provider: fontProviders.fontsource(),
        weights: [500, 600, 700],
        styles: ["normal"],
        subsets: ["latin"],
      },
      {
        name: "DM Sans",
        cssVariable: "--font-dm-sans",
        provider: fontProviders.fontsource(),
        weights: [400, 600],
        styles: ["normal", "italic"],
        subsets: ["latin"],
      }
    ],
  },
  compressHTML: true,
  vite: {
    build: {
      sourcemap: true,
    },
    plugins: [
      yaml(),
      tailwindcss(),
      visualizer({
        emitFile: true,
        filename: "stats.html",
      }),
    ],
  },
  integrations: [
    svelte(),
    sitemap({
      filter: (page) => !page.includes('/submissions/')
    }),
    compressor(),
    icon({
      include: {
        local: ["*"],
        ph: ["*"],
      },
    }),
  ],
  redirects: redirects
});
