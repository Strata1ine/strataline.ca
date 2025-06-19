<script lang="ts">
  import Slidenav from "@interact/Slidenav.svelte";
  import { CardMeta } from "./Slideshow.astro";
  import { heading, desc } from "@sections/meta";

  const {
    meta,
  }: {
    meta: CardMeta[];
  } = $props();

  let idx = $state(0);
</script>

<div
  class="2xl:max-w-middle gap-inset flex flex-col 2xl:ml-auto 2xl:flex-row 2xl:gap-0"
>
  <div class="xl:max-w-inner w-full">
    <div class="xl:mx-inset bg-accent flex min-h-90 rounded-sm contain-paint">
      {#each meta as card, i}
        <div class="flex w-full flex-shrink-0 items-center">
          {#if card.image}
            <img class="object-cover" src={card.image} />
          {/if}

          <div>
            <h3 class="{heading({ intent: '4xl' })} mb-1">{card.title}</h3>
            <p class={desc({ intent: "base" })}>
              {card.desc}
            </p>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <Slidenav
    class="gap-inset flex justify-center sm:gap-4 2xl:flex-col"
    length={meta.length}
    bind:idx
  />
</div>
