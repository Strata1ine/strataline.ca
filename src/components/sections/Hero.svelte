<script lang="ts">
  import { modals } from "~/lib/stores";
  import { heading, desc } from "./meta";
  import { Hero as Meta } from "@/meta";
  import Slideshow, { type AnimMeta } from "@interact/ImageSlideshow.svelte";
  import Slidenav from "@interact/Slidenav.svelte";
  import Button from "@actions/Button.svelte";

  const { meta }: { meta: Meta } = $props();

  let idx = $state(0);
  let animMeta: AnimMeta = {
    active: "w-full",
    hidden: "w-0",
    base: "duration-700 transition-[width] select-none h-full",
  };
</script>

<div
  class="hidden w-1/2 flex-none flex-col items-center gap-3 sm:flex md:gap-6 2xl:flex-row-reverse"
>
  <Slideshow
    class="flex h-[80vh] max-h-165 min-h-100 justify-evenly rounded-sm contain-paint"
    images={meta.images}
    {animMeta}
    bind:idx
  />

  <Slidenav
    class="gap-inset flex 2xl:flex-col"
    bind:idx
    length={meta.images.length}
  />
</div>

<div class="relative">
  <h1 class={heading({ intent: "6xl" })}>
    {meta.title}
  </h1>

  <div class="my-5 flex items-center gap-4 sm:hidden">
    <Slideshow
      class="-ml-inset flex h-60 flex-1 justify-evenly rounded-tr-sm rounded-br-sm contain-paint"
      images={meta.images}
      {animMeta}
      bind:idx
    />

    <Slidenav
      class="gap-inset flex flex-col"
      bind:idx
      length={meta.images.length}
    />
  </div>

  <p class="{desc({ intent: 'base' })} mt-3">
    {meta.desc}
  </p>

  <div class="mt-9">
    <Button class="" onclick={() => modals.open(modals.talk)}>Let's Talk</Button
    >
  </div>
</div>
