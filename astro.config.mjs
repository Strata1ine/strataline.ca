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
    '/kitchen/18-2-2': '/services/kitchens/',
    '/bathroom-remodeling': '/services/bathrooms/',
    '/home-renovation/ceiling/smooth-ceiling': '/services/popcorn-removal/',
    '/before-and-after-dust-free-popcorn-removal-stair-refinishing-railing-renovation-maple-vaughan-york-region': '/services/popcorn-removal/',
    '/ceiling-renovation-led-potlight-installation-and-dustless-popcorn-removal-toronto-smooth-ceilings': '/services/popcorn-removal/',
    '/dustless-sanding': '/services/popcorn-removal/',
    '/ceiling-renovation-led-potlight-installation-and-dustless-popcorn-removal-maple-toronto-king-aurora-smooth-ceilings': '/services/popcorn-removal/',
    '/dustless-ceiling-stucco-popcorn-texture-removal-by-strataline-ca': '/services/popcorn-removal/',

    '/accesssible-universal-home/': '/',
    '/railing-systems': '/services/stairs/',
    '/stair-refinishing-in-toronto-ontario': '/services/stairs/',
    '/stair-refinishing-in-richmond-hill-ontario': '/services/stairs/',
    '/stair-refinishing-in-etobicoke-ontario': '/services/stairs/',
    '/stair-refinishing-in-newmarket-ontario': '/services/stairs/',
    '/stair-refinishing-in-guelph-ontario': '/services/stairs/',
    '/stair-refinishing-in-mississauga-ontario': '/services/stairs/',
    '/stair-refinishing-in-ajax-ontario': '/services/stairs/',
    '/stair-refinishing-in-vaughan-ontario': '/services/stairs/',
    '/stair-refinishing-in-barrie-ontario': '/services/stairs/',
    '/stair-refinishing-in-oakville-ontario': '/services/stairs/',
    '/stair-refinishing-in-burlington-ontario': '/services/stairs/',
    '/stair-refinishing-in-bowmanville-ontario': '/services/stairs/',
    '/stair-refinishing-in-hamilton-ontario': '/services/stairs/',
    '/stair-refinishing-in-brampton-ontario': '/services/stairs/',
    '/stair-refinishing-in-oshawa-ontario': '/services/stairs/',
    '/stair-refinishing-in-bradford-ontario': '/services/stairs/',
    '/stair-refinishing-in-milton-ontario': '/services/stairs/',
    '/stair-refinishing-in-caledon-ontario': '/services/stairs/',
    '/stair-refinishing-in-whitby-ontario': '/services/stairs/',
    '/stair-refinishing-in-scarborough-ontario': '/services/stairs/',
    '/stair-refinishing-in-markham-ontario': '/services/stairs/',
    '/stair-refinishing-in-halton-hills-ontario': '/services/stairs/',
    '/stair-refinishing-in-durham-region-ontario': '/services/stairs/',
    '/stair-refinishing-in-halton-region-ontario': '/services/stairs/',
    '/stair-refinishing-in-east-gwillimbury-ontario': '/services/stairs/',
    '/stair-refinishing-in-peel-region-ontario': '/services/stairs/',
    '/stair-refinishing-in-thornhill-ontario': '/services/stairs/',
    '/stair-refinishing-in-bolton-ontario': '/services/stairs/',
    '/stair-refinishing-in-stouffville-ontario': '/services/stairs/',
    '/stair-refinishing-in-king-city-ontario': '/services/stairs/',
    '/stair-refinishing-in-pickering-ontario': '/services/stairs/',
    '/stair-refinishing-in-york-region-ontario': '/services/stairs/',
    '/stair-refinishing-in-port-perry-ontario': '/services/stairs/',
    '/stair-refinishing-in-georgina-ontario': '/services/stairs/',
    '/stair-refinishing-in-woodbridge-ontario': '/services/stairs/',
    '/stair-refinishing-in-clarington-ontario': '/services/stairs/',

    '/led-potlight-installation-led-pot-light-electrical-services-by-strataline-ca-toronto-vaughan-aurora-king-nemwarket-markham-woodbridge-mississauga-048': '/',
    '/basement-window-enlargement-vinyl-trim-installation-and-replacement-pvc-windows-woodbridge-maple-vaughan-king-aurora-nemwarket-caledon-nobleton-kleinburg': '/',
    '/modern-fiberglass-and-steel-door-installation-and-replacement-pvc-windows-woodbridge-maple-vaughan-king-aurora-nemwarket-caledon-nobleton-kleinburg-mississauga': '/',
    '/laminate-flooring-installation-service': '/',
    '/hardwood-floor-refinishing': '/',
    '/residential-painting': '/',
    '/fiberglass-door-and-vinyl-window-installation-replacement': '/',
    '/flooring-installation-services': '/',
    '/home-renovation/door-window-cutout/': '/',
    '/flooring-installation-services/hardwood-floor-inlay-medallions-toronto/': '/',
    '/hard-wood-floor-refinishing-toronto-vaughan-maple-aurora-newmarket-mississauga-woodbridge-downtow-commercial-restaurant-floor-renovation/': '/',
    '/led-potlight-installation-led-pot-light-electrical-services-by-strataline-ca-toronto-vaughan-aurora-king-nemwarket-markham-woodbridge-mississauga-00001': '/',
    '/fiberglass-and-steel-door-installation-and-replacement-vinyl-windows-woodbridge-maple-vaughan-king-aurora-nemwarket-caledon-nobleton-kleinburg-before': '/',
    '/shoe-moulding': '/',
    '/baseboards': '/',
    '/contact/': '/',
    '/home-renovation/closets-storage/': '/',
    '/fiberglass-and-steel-door-installation-and-replacement-vinyl-windows-exterior-trim-woodbridge-maple-vaughan-king-aurora-nemwarket-caledon-nobleton-kleinburg/': '/',
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
