import { getImage } from 'astro:assets';
import type { ImageSource, OptimizedImage } from './meta';

export const optimizeOpts = {
  widths: [500, 750, 1300, 2160],
  width: 2160,
  draggable: false,
};

export async function optimizeImage(image: ImageSource): Promise<OptimizedImage> {
  const opt = await getImage({
    src: image.meta,
    ...optimizeOpts,
  });
  return {
    src: opt.src,
    srcset: opt.srcSet.attribute,
    width: opt.attributes.width,
    height: opt.attributes.height,
    sizes: opt.attributes.sizes,
    loading: opt.attributes.loading || "lazy",
    alt: image.alt,
    decoding: opt.attributes.loading || "async",
    draggable: false,
  };
}

export async function optimizeImages(images: ImageSource[]): Promise<OptimizedImage[]> {
  return await Promise.all(images.map(optimizeImage));
}

export function imageCover(count: number): string {
  return `object-cover h-full select-none${count > 1 ? ' min-w-0 hover:flex-5 flex-1 duration-800' : ''}`;
}
