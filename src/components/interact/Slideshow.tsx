import { For, createSignal } from "solid-js";

export type SlideshowMeta = {
  active: string,
  hidden: string,
  base: string,
  images: {
    alt: string,
    path: ImageMetadata,
  }[],
}

export default function Slideshow(props: { class: string; meta: SlideshowMeta }) {
  const [activeIndex, setActiveIndex] = createSignal(0);

  return (
    <div class={props.class}>
      <For each={props.meta.images}>
        {(image, i) => (
          <img
            class={
              `object-cover ${props.meta.base} ${activeIndex() === i() ? props.meta.active : props.meta.hidden
              }`}
            alt={image.alt}
            src={image.path.src}
            width={image.path.width}
            height={image.path.height}
            data-index={i()}
          />
        )}
      </For>
    </div>
  );
}
