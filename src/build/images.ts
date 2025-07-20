import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import type { SchemaContext } from 'astro:content';
import z from "zod";

export async function optimizeImage(image: ImageMetadata): Promise<OptimizedImage> {
  const opt = await getImage({
    src: image,
  });

  return {
    src: opt.src,
    format: "webp",
  };
}

export async function optimizeImages(images: ImageMetadata[]): Promise<OptimizedImage[]> {
  return await Promise.all(images.map(optimizeImage));
}

export type OptimizedImage = {
  src: string;
  format: string;
}

export const imageSource = (c: SchemaContext) =>
  z.object({
    meta: c.image(),
    alt: z.string(),
  });

export type ImageSource = z.infer<
  ReturnType<typeof imageSource>
>;
