<script lang="ts">
  import { onMount } from "svelte";
  import { videoPlaying } from "~/frontend/stores.svelte";

  let node: HTMLVideoElement;
  const { poster, url }: { poster: string; url: string } = $props();

  onMount(() => {
    const unsub = videoPlaying.subscribe((playing) => {
      if (playing && node.paused) {
        node.play();
      } else if (!playing && !node.paused) {
        node.pause();
      }
    });

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting == false) {
        videoPlaying.set(false);
      }
    });

    observer.observe(node);

    return () => {
      unsub();
      observer.disconnect();
    };
  });
</script>

<video
  bind:this={node}
  {poster}
  loading="lazy"
  preload="none"
  class="absolute h-full w-full cursor-pointer object-cover"
  controls
  onplay={() => videoPlaying.set(true)}
  onpause={() => videoPlaying.set(false)}
  onended={() => videoPlaying.set(false)}
>
  <source src={url} />
  Your browser does not support the video tag.
</video>
