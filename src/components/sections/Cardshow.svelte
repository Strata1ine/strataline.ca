<script lang="ts">
  import Slidenav from "@actions/Slidenav.svelte";

  import { type SubPropsOf } from "./registry";
  import { actionStyles } from "@actions/styles";
  const { meta }: { meta: SubPropsOf<"Cardshow", "content"> } = $props();
  let idx = $state(0);
</script>

<div class="2xl:max-w-inner bg-accent flex rounded-sm contain-paint">
  {#each meta as card, i}
    <div
      class="sm:px-auto flex w-full flex-shrink-0 flex-col items-center justify-center px-5 py-8 transition-opacity duration-800 sm:flex-row sm:gap-8 sm:px-0 sm:py-0
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
            draggable={false}
            {...card.media.meta}
          />
        {:else if card.media.type == "video"}
          <video
            poster={card.media.poster.src}
            loading="lazy"
            preload="none"
            class="absolute h-full w-full cursor-pointer object-cover"
            controls
          >
            <source src={card.media.url} />
            Your browser does not support the video tag.
          </video>
        {:else if card.media.type == "yt-video"}
          <iframe
            loading="lazy"
            src={card.media.url}
            title="YouTube video player"
            class="absolute h-full w-full select-none"
            frameborder="0"
            allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        {/if}
      </div>

      <div class="mt-6 sm:my-16 w-full">
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
