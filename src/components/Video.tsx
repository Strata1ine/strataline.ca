import { onMount, onCleanup, createEffect } from "solid-js";
import { videoPlaying, setVideoPlaying } from "@/frontend/stores";

type Props = {
  poster: string;
  url: string;
};

export default function Video(props: Props) {
  let node: HTMLVideoElement | undefined;

  onMount(() => {
    if (!node) return;

    createEffect(() => {
      if (!videoPlaying() && node && !node.paused) {
        node.pause();
      }
    });

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting === false) {
        setVideoPlaying(false);
      }
    });

    observer.observe(node);

    onCleanup(() => {
      observer.disconnect();
    });
  });

  return (
    <video
      ref={node}
      poster={props.poster}
      preload="none"
      class="absolute h-full w-full cursor-pointer object-cover"
      controls
      onplay={() => setVideoPlaying(true)}
      onpause={() => setVideoPlaying(false)}
      onended={() => setVideoPlaying(false)}
    >
      <source src={props.url} />
      Your browser does not support the video tag.
    </video>
  );
}
