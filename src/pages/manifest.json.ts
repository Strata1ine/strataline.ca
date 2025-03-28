import type { APIRoute } from "astro";
import { getImage } from "astro:assets";

import favicon from "/public/favicon.png";
const faviconPngSizes = [32, 192, 512];

import { config } from "~/config";

export const GET: APIRoute = async () => {
  const icons = await Promise.all(
    faviconPngSizes.map(async (size: number) => {
      const image = await getImage({
        src: favicon,
        width: size,
        height: size,
        format: "png",
      });

      return {
        src: `${config.site}${image.src}`,
        type: `${image.options.format}`,
        sizes: `${image.options.width}x${image.options.height}`,
      };
    }),
  );

  const manifest = {
    name: config.name,
    start_url: "/",
    display: "standalone",
    icons,
  };

  return new Response(JSON.stringify(manifest));
};
