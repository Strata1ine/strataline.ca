import { getImage } from 'astro:assets';

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

export async function optimizeImages(images: { meta: ImageMetadata; alt: string }[]): Promise<OptimizedImage[]> {
  return await Promise.all(
    images.map(async (image) => {
      const opt = await getImage({
        src: image.meta,
        widths: [750, 1300, 2160],
        sizes: "60vw",
        width: 2160,
      });

      return {
        src: opt.src,
        srcset: opt.srcSet.attribute,
        width: opt.attributes.width,
        height: opt.attributes.height,
        sizes: opt.attributes.sizes,
        loading: opt.attributes.loading,
        alt: image.alt,
        draggable: false,
      };
    })
  );
}

export function imageCover(count: number): string {
  return `object-cover h-full select-none${count > 1 ? ' min-w-0 hover:flex-5 flex-1 duration-800' : ''}`;
}
