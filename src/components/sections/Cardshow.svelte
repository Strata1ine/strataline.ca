<script lang="ts">
  import Slidenav from "@actions/Slidenav.svelte";
  import { spaceStyles } from "./styles";

  import { type SubPropsOf } from "./registry";
  import { actionStyles } from "@actions/styles";
  const { meta }: { meta: SubPropsOf<"Cardshow", "content"> } = $props();
  let idx = $state(0);
</script>

<div class="2xl:max-w-inner bg-accent flex min-h-90 rounded-sm contain-paint">
  {#each meta as card, i}
    <div
      class="flex w-full flex-shrink-0 flex-col items-center justify-center px-6 py-10 transition-opacity duration-800 sm:flex-row sm:p-0
      {spaceStyles({ gap: 'base' })}
      {i == idx ? '' : 'pointer-events-none opacity-0'}"
      inert={i != idx}
      style="transform: translateX(-{i * 100}%)"
    >
      <div
        class="w-full flex-none rounded-sm contain-paint sm:h-full sm:w-1/2 sm:rounded-none"
      >
        {#if card.media.type == "image"}
          <img
            class="h-full max-h-[min(25vh,18rem)] w-full object-cover select-none sm:max-h-[min(40vh,40rem)] sm:min-h-full"
            alt={card.media.alt}
            draggable={false}
            {...card.media.meta}
          />
        {:else if card.media.type == "video"}
          <video
            poster={card.media.poster.src}
            loading="lazy"
            playsinline
            preload="none"
            class="h-full w-full cursor-pointer object-cover"
            controls
          >
            <source src={card.media.url} />
            Your browser does not support the video tag.
          </video>
        {:else if card.media.type == "yt-video"}
          <iframe
            loading="lazy"
            width="720"
            height="480"
            src={card.media.url}
            title="YouTube video player"
            class="h-full w-full"
            frameborder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        {/if}
      </div>

      <div>
        <h3 class="heading-4xl mb-1 font-semibold">{card.title}</h3>
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

<div class="flex justify-center gap-5 2xl:flex-col">
  <Slidenav length={meta.length} bind:idx />
</div>
