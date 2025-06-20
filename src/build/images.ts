import { getImage } from 'astro:assets';
import type { ImageSource, OptimizedImage } from './meta';

export async function optimizeImage(image: ImageSource): Promise<OptimizedImage> {
  const opt = await getImage({
    src: image.meta,
    widths: [500, 750, 1300, 2160],
    sizes: "60vw",
    width: 2160,
  });
  return {
    src: opt.src,
    srcset: opt.srcSet.attribute,
    width: opt.attributes.width,
    height: opt.attributes.height,
    sizes: opt.attributes.sizes,
    loading: opt.attributes.loading || "lazy",
    alt: image.alt,
    draggable: false,
  };
}

export async function optimizeImages(images: ImageSource[]): Promise<OptimizedImage[]> {
  return await Promise.all(images.map(optimizeImage));
}

export function imageCover(count: number): string {
  return `object-cover h-full select-none${count > 1 ? ' min-w-0 hover:flex-5 flex-1 duration-800' : ''}`;
}
