<script lang="ts">
  import Slidenav from "@actions/Slidenav.svelte";
  import YoutubeVideo from "@interact/YoutubeVideo.svelte";
  import Video from "@interact/Video.svelte";

  import { type SubPropsOf } from "./registry";
  import { actionStyles } from "@actions/styles";
  import { slideshow } from "~/frontend/slideshow.svelte";

  const {
    meta,
    speed,
  }: { meta: SubPropsOf<"Cardshow", "content">; speed: number } = $props();
  let idx = $state(0);
</script>

<div
  class="2xl:max-w-inner bg-accent flex rounded-md contain-paint"
  use:slideshow={{
    idx,
    setIdx: (v) => (idx = v),
    length: meta.length,
    speed,
  }}
>
  {#each meta as card, i}
    <div
      class="sm:px-auto flex w-full flex-none flex-col items-center justify-center gap-6 px-5 py-8 transition-opacity duration-800 sm:flex-row sm:gap-8 sm:px-0 sm:py-0
      {i == idx ? '' : 'pointer-events-none opacity-0'}"
      inert={i != idx}
      style="transform: translateX(-{i * 100}%)"
    >
      <div
        class="relative aspect-video w-full flex-none rounded-sm contain-paint sm:h-full sm:w-1/2 sm:rounded-none"
      >
        {#if card.media.type == "image"}
          <img
            class="absolute h-full w-full object-cover select-none"
            alt={card.media.alt}
            {...card.media.meta}
          />
        {:else if card.media.type == "video"}
          <Video poster={card.media.poster.src} url={card.media.url}></Video>
        {:else if card.media.type == "yt-video"}
          <YoutubeVideo id={card.media.id}></YoutubeVideo>
        {/if}
      </div>

      <div class="w-full sm:my-10">
        <h3 class="heading-4xl mb-1">{card.title}</h3>
        <p class="desc-base">
          {card.desc}
        </p>

        {#if card.link}
          <div class="mt-7">
            <a
              rel="noopener noreferrer"
              class={actionStyles()}
              target="_blank"
              href={card.link.url}>{card.link.name}</a
            >
          </div>
        {/if}
      </div>

      <div class="hidden sm:block"></div>
    </div>
  {/each}
</div>

<div class="flex justify-center gap-2 2xl:flex-col">
  <Slidenav length={meta.length} bind:idx />
</div>
