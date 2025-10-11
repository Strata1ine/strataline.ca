<script lang="ts">
  import { getImage } from "astro:assets";

  type ImageSource = {
    src: {
      format: "png" | "jpg" | "jpeg" | "tiff" | "webp" | "gif" | "svg" | "avif";
      src: string;
      width: number;
      height: number;
    };
    alt: string;
    x?: "left" | "right" | undefined;
    y?: "top" | "bottom" | undefined;
  };

  // import { type ImageSource } from "@/components/registry";
  import { imageStyles } from "./sections/styles";

  const { image: i, widths = [] }: { image: ImageSource; widths?: number[] } =
    $props();

  const image = await getImage({
    src: i.src,
    widths,
    format: "webp",
  });
</script>

<!-- <img -->
<!--   class={imageStyles({ -->
<!--     x: i.x, -->
<!--     y: i.y, -->
<!--   })} -->
<!--   src={image.src} -->
<!--   alt={i.alt} -->
<!--   srcset={image.srcSet.attribute} -->
<!--   draggable={false} -->
<!-- /> -->
