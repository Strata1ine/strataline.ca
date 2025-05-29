import { getImage } from 'astro:assets';

export async function optimizeImages(images: { meta: ImageMetadata; alt: string }[]) {
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
        decoding: opt.attributes.decoding,
        alt: image.alt,
        draggable: false,
      };
    })
  );
}
