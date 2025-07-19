import { z } from 'zod';
import { getImage } from 'astro:assets';
import type { SchemaContext } from 'astro:content';

export const opts = {
  widths: [500, 750, 1300, 2160],
  width: 2160,
  draggable: false,
};

export async function optimizeImage(image: ImageSource): Promise<OptimizedImage> {
  const opt = await getImage({
    src: image.meta,
    ...opts,
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

export const imageSource = (c: SchemaContext) =>
  z.object({
    meta: c.image(),
    alt: z.string(),
  });

export type ImageSource = z.infer<
  ReturnType<typeof imageSource>
>;

export type OptimizedImage = {
  src: string;
  srcset: string;
  width: string;
  height: string;
  sizes: string;
  loading: string;
  alt: string;
  draggable: boolean;
}
