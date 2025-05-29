import { For, createSignal } from "solid-js";

export type SlideshowMeta = {
  active: string,
  hidden: string,
  base: string,
  images: any[],
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
            {...image}
            data-index={i()}
          />
        )}
      </For>
    </div>
  );
}
