<script lang="ts">
  import { imageStyles, imageWrapperStyles } from "./styles";
  import Slidenav from "@actions/Slidenav.svelte";
  import FluidTalk from "@decor/FluidTalk.svelte";

  import { type PropsOf } from "./registry";
  const { meta }: { meta: PropsOf<"Hero"> } = $props();
  let idx = $state(0);
</script>

{#snippet imageCarousel()}
  {#each meta.content as image, i}
    <img
      class={imageStyles({ anim: "fade", active: idx == i })}
      fetchpriority={i === idx ? "low" : "high"}
      alt={image.alt}
      {...image.meta}
    />
  {/each}
{/snippet}

<div
  class="hidden w-1/2 flex-none flex-col items-center gap-2 sm:flex 2xl:flex-row-reverse 2xl:gap-4"
>
  <div class="h-[70vh] max-h-165 min-h-100 w-full rounded-sm contain-paint">
    {@render imageCarousel()}
  </div>

  <div class="flex gap-2 2xl:flex-col">
    <Slidenav bind:idx length={meta.content.length}></Slidenav>
  </div>
</div>

<div>
  <h1 class="heading-6xl font-bold">
    {meta.title}
  </h1>

  <div class="my-5 flex items-center gap-2 sm:hidden">
    <div
      class="{imageWrapperStyles({
        pos: 'left',
        size: 'mobile',
      })} flex-1"
    >
      {@render imageCarousel()}
    </div>

    <div class="flex flex-col gap-2">
      <Slidenav bind:idx length={meta.content.length} />
    </div>
  </div>

  <p class="desc-base mt-3">
    {meta.desc}
  </p>

  <FluidTalk></FluidTalk>
</div>
