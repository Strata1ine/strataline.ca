import type { APIRoute } from "astro";
import { getImage } from "astro:assets";

import favicon from "/public/favicon.png";
const sizes = [32, 180, 512];

import { config, getPropertyValue } from "~/config";

export const pngIcons = await Promise.all(
  sizes.map(async (size: number) => {
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

export const GET: APIRoute = async () => {
  const manifest = {
    name: config.business.name,
    description: config.business.description,
    start_url: "/",
    display: "standalone",
    theme_color: getPropertyValue("theme_color"),
    background_color: getPropertyValue("background_color"),
    icons: pngIcons,
  };

  return new Response(JSON.stringify(manifest));
};
