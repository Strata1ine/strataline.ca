<script lang="ts">
  import { Slideshow, Slidenav } from "@/index";
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
</script>

<div
  class="hidden w-1/2 flex-col items-center gap-6 sm:flex 2xl:flex-row-reverse"
>
  <Slideshow
    class="flex h-[65vh] max-h-175 min-h-130 justify-evenly rounded-sm contain-paint"
    bind:idx
    meta={{
      active: "w-full",
      hidden: "w-0",
      base: "duration-700 select-none",
      images,
    }}
  />

  <Slidenav class="flex flex-1 gap-5 2xl:flex-col" bind:idx {length} />
</div>

<div class="relative flex-1">
  <h1
    class="xs:text-2xl mb-2 font-serif text-xl font-bold text-balance lg:text-3xl xl:text-4xl 2xl:text-5xl"
  >
    {title}
  </h1>

  <div class="my-5 flex items-center gap-3 sm:hidden">
    <Slideshow
      class="-ml-inset flex h-60 flex-1 rounded-tr-sm rounded-br-sm contain-paint"
      bind:idx
      meta={{
        active: "w-full",
        hidden: "w-0",
        base: "duration-500 select-none",
        images,
      }}
    />

    <Slidenav class="flex flex-col gap-3" bind:idx {length} />
  </div>

  <p class="xl:text-bg my-3 font-sans text-base">
    {description}
  </p>

  <div class="relative mt-9 pb-17">
    <Button class="absolute">Let's Talk</Button>
  </div>
</div>
