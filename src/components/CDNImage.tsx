import type { VariantProps } from "class-variance-authority";
import { imageStyles } from "./sections/styles";
import type { ImageSource } from "@/schemas";

const IMAGE_CDN = import.meta.env.PUBLIC_IMAGE_CDN as string;

export type Props = {
  image: ImageSource;
  widths?: number[];
  quality?: number;
  active?: boolean;
  anim?: VariantProps<typeof imageStyles>["anim"];
};

export default function CDNImage(props: Props) {
  const quality = () => props.quality ?? 70;
  const widths = () => props.widths ?? [];

  const src = () =>
    `${IMAGE_CDN}?url=${props.image.src.src}&fm=webp&q=${quality()}`;

  const srcSet = () =>
    widths()
      .map(
        (w) =>
          `${IMAGE_CDN}?url=${props.image.src.src}&w=${w}&fm=webp&q=${quality()} ${w}w`,
      )
      .join(", ");

  const className = () =>
    imageStyles({
      anim: props.anim,
      active: props.active,
      x: props.image.x,
      y: props.image.y,
    });

  return (
    <img
      class={className()}
      src={src()}
      alt={props.image.alt}
      srcset={srcSet()}
      draggable={false}
    />
  );
}
