<script lang="ts">
  import Slidenav from "@interact/Slidenav.svelte";
  import { Card as Meta } from "@/meta";
  import { heading, desc } from "@sections/meta";

  const {
    meta,
  }: {
    meta: Meta[];
  } = $props();

  let idx = $state(0);
</script>

<div class="2xl:max-w-inner">
  <div class="2xl:mx-inset bg-accent flex min-h-90 rounded-sm contain-paint">
    {#each meta as card, i}
      <div
        class="flex w-full flex-shrink-0 flex-col items-center justify-center gap-8 px-6 py-10 transition-opacity duration-800 sm:flex-row sm:p-0 {i ==
        idx
          ? ''
          : 'pointer-events-none opacity-0'}"
        style="transform: translateX(-{i * 100}%)"
      >
        {#if card.image}
          <img
            class="h-full max-h-[min(30svh,18rem)] flex-none rounded-sm object-cover sm:max-h-[min(50svh,25rem)] sm:w-1/2 sm:rounded-none"
            {...card.image}
          />
        {/if}

        <div>
          <h3 class="{heading({ intent: '4xl' })} mb-1">{card.title}</h3>
          <p class={desc({ intent: "base" })}>
            {card.desc}
          </p>
        </div>

        <div class="hidden sm:block"></div>
      </div>
    {/each}
  </div>
</div>

<Slidenav
  class="gap-inset flex justify-center sm:gap-4 2xl:flex-col"
  length={meta.length}
  bind:idx
/>
