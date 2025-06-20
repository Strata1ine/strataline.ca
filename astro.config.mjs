// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from "@tailwindcss/vite";
import svelte from "@astrojs/svelte";
import compressor from "astro-compressor";
import icon from "astro-icon";
import { exec } from 'child_process';

// https://astro.build/config
export default defineConfig({
  build: {
    assets: '_strataline'
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  devToolbar: { enabled: false },
  experimental: {
    // csp: true,
    clientPrerender: true,
    contentIntellisense: true,
    preserveScriptOrder: true,
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
        weights: [400],
        styles: ["normal", "italic"],
        subsets: ["latin"],
      }
    ],
  },
  compressHTML: true,
  vite: {
    plugins: [
      tailwindcss(),
      {
        // HACK: the red one invented cache
        name: 'clear-content-cache',
        handleHotUpdate({ file, server }) {
          if (file.endsWith('src/components/meta.ts') || file.endsWith('src/content.config.ts')) {
            exec('rm -rf .astro/', (error) => {
              if (error) console.error('Error clearing content cache:', error);
              else console.log('Cleared content content cache. Restarting server!');
            });
            server.restart();
            return [];
          }
        },
      },
    ],
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        quality: 20,
        experimentalDefaultStyles: false,
      },
    },
  },
  integrations: [
    svelte(),
    compressor(),
    icon({
      svgoOptions: {
        multipass: true,
      },
    }),
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
