<script lang="ts">
  import { imageStyles, imageWrapperStyles } from "./styles";
  import Slidenav from "@/components/actions/Slidenav.svelte";
  import FluidTalk from "@/components/decor/FluidTalk.svelte";
  import Image from "@/components/Image.svelte";

  import { type PropsOf } from "@/components/registry";
  import { slideshow } from "@/frontend/slideshow.svelte";
  const { meta }: { meta: PropsOf<"Hero"> } = $props();

  let idx: number = $state(0);
</script>

{#snippet imageCarousel()}
  {#each meta.content as image, i}
    <Image {image} widths={[400, 650, 1300]}/>
    <!-- <img -->
    <!--   class={imageStyles({ -->
    <!--     anim: "fade", -->
    <!--     active: idx == i, -->
    <!--     x: image.x, -->
    <!--     y: image.y, -->
    <!--   })} -->
    <!--   fetchpriority={i === idx ? "low" : "high"} -->
    <!-- /> -->
  {/each}
{/snippet}

<div
  class="flex gap-6 py-20 sm:items-center sm:py-30 md:gap-8 xl:gap-11"
  use:slideshow={{
    idx,
    setIdx: (v) => (idx = v),
    length: meta.content.length,
    speed: meta.speed,
  }}
>
  <div class="hidden w-1/2 flex-none flex-col sm:flex 2xl:flex-row-reverse">
    <div class="h-[70vh] max-h-165 min-h-100 w-full rounded-sm contain-paint">
      {@render imageCarousel()}
    </div>

    <div
      class="2xl:w-diff mt-3 flex flex-shrink-0 items-center justify-center gap-2 2xl:mt-0 2xl:flex-col"
    >
      <Slidenav bind:idx length={meta.content.length} />
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
          size: 'sm',
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

    <FluidTalk />
  </div>
</div>
