// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from "@tailwindcss/vite";
import svelte from "@astrojs/svelte";
import compressor from "astro-compressor";
import icon from "astro-icon";

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
        provider: "local",
        name: "Cormorant Garamond",
        cssVariable: "--font-cormorant",
        variants: [
          { weight: "700", style: "normal", src: ["src/fonts/garamond/CormorantGaramond-Bold.woff2"] },
          { weight: "700", style: "italic", src: ["src/fonts/garamond/CormorantGaramond-BoldItalic.woff2"] },
          { weight: "500", style: "normal", src: ["src/fonts/garamond/CormorantGaramond-Medium.woff2"] },
          { weight: "500", style: "italic", src: ["src/fonts/garamond/CormorantGaramond-MediumItalic.woff2"] },
          { weight: "600", style: "normal", src: ["src/fonts/garamond/CormorantGaramond-SemiBold.woff2"] },
          { weight: "600", style: "italic", src: ["src/fonts/garamond/CormorantGaramond-SemiBoldItalic.woff2"] }
        ]
      },
      {
        provider: "local",
        name: "DM Sans",
        cssVariable: "--font-dm-sans",
        variants: [
          { weight: "400", style: "normal", src: ["src/fonts/dm-sans/DMSans-Regular.woff2"] },
          { weight: "400", style: "italic", src: ["src/fonts/dm-sans/DMSans-Italic.woff2"] }
        ]
      }
    ],
  },
  compressHTML: true,
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    experimentalDefaultStyles: false,
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
    icon({
      svgoOptions: {
        multipass: true,
        plugins: [
          {
            name: "preset-default",
            params: {
              overrides: {
                convertPathData: false,
                mergePaths: false,
                convertShapeToPath: false,
              },
            },
          },
        ],
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
