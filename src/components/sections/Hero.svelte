<script lang="ts">
  import { modals } from "@lib/stores";
  import Slideshow from "@interact/Slideshow.svelte";
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
  class="hidden w-1/2 flex-col items-center gap-3 md:gap-6 sm:flex 2xl:flex-row-reverse"
>
  <Slideshow
    class="flex h-[80vh] max-h-165 min-h-100 justify-evenly rounded-sm contain-paint"
    bind:idx
    {meta}
  />

  <Slidenav class="flex flex-1 gap-5 2xl:flex-col" bind:idx {length} />
</div>

<div class="relative flex-1">
  <h1
    class="md:text-3xl font-serif text-2xl font-bold text-balance lg:text-4xl xl:text-5xl 2xl:text-6xl"
  >
    {title}
  </h1>

  <div class="my-5 flex items-center gap-3 sm:hidden">
    <Slideshow
      class="-ml-inset flex h-60 flex-1 rounded-tr-sm rounded-br-sm contain-paint"
      bind:idx
      {meta}
    />

    <Slidenav class="flex flex-col gap-3" bind:idx {length} />
  </div>

  <p class="xl:text-md my-3 font-sans text-base">
    {description}
  </p>

  <div class="mt-9">
    <Button class="" onclick={() => modals.open(modals.talk)}>Let's Talk</Button
    >
  </div>
</div>
