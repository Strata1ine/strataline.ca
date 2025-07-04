import type { SchemaContext } from "astro:content";
import { z } from "zod";

export type ImageSource = {
  meta: ImageMetadata;
  alt: string;
}

export const ImageSource = {
  zod: (c: SchemaContext) => z.object({
    meta: c.image(),
    alt: z.string(),
  })
}

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
