<script lang="ts">
  import Slidenav from "@actions/Slidenav.svelte";
  import { headingStyles, spaceStyles, descStyles } from "./styles";

  import { type SubPropsOf } from "./registry";
  const { meta }: { meta: SubPropsOf<"Cardshow", "content"> } = $props();
  let idx = $state(0);
</script>

<div class="2xl:max-w-inner bg-accent flex min-h-90 rounded-sm contain-paint">
  {#each meta as card, i}
    <div
      class="flex w-full flex-shrink-0 flex-col items-center justify-center px-6 py-10 transition-opacity duration-800 sm:flex-row sm:p-0
      {spaceStyles({ gap: 'base' })}
      {i == idx ? '' : 'pointer-events-none opacity-0'}"
      style="transform: translateX(-{i * 100}%)"
    >
      {#if card.image}
        <img
          class="max-h-[min(25vh,18rem)] flex-none rounded-sm object-cover select-none sm:max-h-[min(40vh,40rem)] sm:min-h-full sm:w-1/2 sm:rounded-none"
          alt={card.image.alt}
          draggable={false}
          {...card.image.meta}
        />
      {/if}

      <div>
        <h3 class="{headingStyles({ size: '4xl' })} mb-1">{card.title}</h3>
        <p class={descStyles({ size: "base" })}>
          {card.desc}
        </p>
      </div>

      <div class="hidden sm:block"></div>
    </div>
  {/each}
</div>

<div class="flex justify-center gap-5 2xl:flex-col">
  <Slidenav length={meta.length} bind:idx />
</div>
