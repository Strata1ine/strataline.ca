<script lang="ts">
  import { modals } from "@lib/stores";
  import { heading, desc } from "@sections/meta";
  import Slideshow from "@interact/ImageSlideshow.svelte";
  import Slidenav from "@interact/Slidenav.svelte";
  import Button from "@actions/Button.svelte";

  const {
    title,
    description,
    images,
  }: {
    title: string;
    description: string;
    images: any[];
  } = $props();

  let idx = $state(0);
  let length = images.length;
  let meta = {
    active: "w-full",
    hidden: "w-0",
    base: "duration-700 transition-[width] select-none h-full",
    images,
  };
</script>

<div
  class="hidden w-1/2 flex-col items-center gap-3 sm:flex md:gap-6 2xl:flex-row-reverse"
>
  <Slideshow
    class="flex h-[80vh] max-h-165 min-h-100 justify-evenly rounded-sm contain-paint"
    bind:idx
    {meta}
  />

  <Slidenav class="flex gap-4 2xl:flex-col" bind:idx {length} />
</div>

<div class="relative flex-1">
  <h1 class={heading({ intent: "6xl" })}>
    {title}
  </h1>

  <div class="my-5 flex items-center gap-4 sm:hidden">
    <Slideshow
      class="-ml-inset flex h-60 flex-1 justify-evenly rounded-tr-sm rounded-br-sm contain-paint"
      bind:idx
      {meta}
    />

    <Slidenav class="gap-inset flex flex-col" bind:idx {length} />
  </div>

  <p class="{desc({ intent: 'base' })} mt-3">
    {description}
  </p>

  <div class="mt-9">
    <Button class="" onclick={() => modals.open(modals.talk)}>Let's Talk</Button
    >
  </div>
</div>
