<script lang="ts">
  import { modals } from "~/frontend/stores";
  import { headingStyles, descStyles } from "./styles";
  import Slidenav from "@actions/Slidenav.svelte";

  import { type PropsOf } from "./registry";
  import { actionStyles } from "@actions/styles";
  let { meta }: { meta: PropsOf<"Hero"> } = $props();

  let idx = $state(0);
</script>

{#snippet imageCarousel()}
  {#each meta.images as image, i}
    <img
      class="h-full object-cover transition-[width] duration-700 select-none {idx ===
      i
        ? 'w-full'
        : 'w-0'}"
      fetchpriority={i === idx ? "high" : "low"}
      alt={image.alt}
      {...image.meta}
    />
  {/each}
{/snippet}

<div
  class="hidden w-1/2 flex-none flex-col items-center gap-6 sm:flex 2xl:flex-row-reverse"
>
  <div
    class="flex h-[70vh] max-h-165 min-h-100 justify-evenly rounded-sm contain-paint"
  >
    {@render imageCarousel()}
  </div>

  <Slidenav
    class="gap-inset flex 2xl:flex-col"
    bind:idx
    length={meta.images.length}
  />
</div>

<div class="relative">
  <h1 class={headingStyles({ size: "6xl" })}>
    {meta.title}
  </h1>

  <div class="my-5 flex items-center gap-4 sm:hidden">
    <div
      class="-ml-inset flex h-60 flex-1 justify-evenly rounded-tr-sm rounded-br-sm contain-paint"
    >
      {@render imageCarousel()}
    </div>

    <Slidenav
      class="gap-inset flex flex-col"
      bind:idx
      length={meta.images.length}
    />
  </div>

  <p class="{descStyles({ size: 'base' })} mt-3">
    {meta.desc}
  </p>

  <div class="mt-9">
    <button class={actionStyles()} onclick={() => modals.open(modals.talk)}
      >Let's Talk</button
    >
  </div>
</div>
