import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { type SchemaContext, z } from 'astro:content';

export const imageOpts = {
  format: "webp",
  draggable: false,
  widths: [500, 750, 1300, 2160],
  quality: 70,
}

export type OptimizedImage = {
  src: string;
  srcset?: string;
  width?: string;
  height?: string;
  sizes?: string;
  loading?: string;
  draggable: boolean;
}

export async function optimizeImage(image: ImageMetadata): Promise<OptimizedImage> {
  if (import.meta.env.DEV) {
    return {
      src: image.src,
      draggable: false,
    }
  }

  const opt = await getImage({
    src: image,
    inferSize: true,
    ...imageOpts,
  });

  return {
    src: opt.src,
    srcset: opt.srcSet.attribute,
    sizes: opt.attributes.sizes,
    loading: (opt.attributes.loading) ? opt.attributes.loading : "lazy",
    draggable: false,
  };
}

export async function optimizeImages(images: ImageMetadata[]): Promise<OptimizedImage[]> {
  return await Promise.all(images.map(optimizeImage));
}

export const imageSource = (c: SchemaContext) => ({
  meta: c.image(),
  alt: z.string(),
  x: z.enum(['left', 'right']).optional(),
  y: z.enum(['top', 'bottom']).optional(),
});

export type ImageSource = z.infer<
  z.ZodObject<ReturnType<typeof imageSource>>
>;
