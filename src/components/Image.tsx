import { getImage } from "astro:assets";
import { type ImageSource } from "@/schemas/image";
import { imageStyles } from "./sections/styles";
import { createResource, Show } from "solid-js";

type Props = {
  image: ImageSource;
  widths?: number[];
};

export default function Image(props: Props) {
  const [imageData] = createResource(async () => {
    return await getImage({
      src: props.image.src,
      widths: props.widths || [],
      format: "webp",
    });
  });

  return (
    <Show when={imageData()} fallback={null}>
      {(data) => (
        <img
          class={imageStyles({
            x: props.image.x,
            y: props.image.y,
          })}
          src={data().src}
          alt={props.image.alt}
          srcset={data().srcSet.attribute}
          draggable={false}
        />
      )}
    </Show>
  );
}
