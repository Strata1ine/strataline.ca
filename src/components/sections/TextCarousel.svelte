<script lang="ts">
  import Star from "~/icons/ph/star-four-fill.svelte";
  import { onMount } from "svelte";

  import { type PropsOf } from "./registry";
  let { meta }: { meta: PropsOf<"TextCarousel"> } = $props();

  let textCarousel: HTMLElement;
  let container: HTMLElement;

  let clientX = 0,
    clientY = 0,
    startPos = 0,
    totalOffset = 0,
    moveDirection = -1,
    lastFrame = 0;

  let pos = $state(0);
  let isVisible = false;
  let animationId: number | null = null;
  let pointerId: null | number = null;

  const updateTranslation = (o: number) => {
    const w = textCarousel.children[0].scrollWidth;
    pos = o - Math.floor(o / w) * w;
  };

  const tryAnimate = (currentTime: number = 0) => {
    if (!isVisible) return;
    totalOffset +=
      (moveDirection * meta.speed * (currentTime - lastFrame)) / 16.67;
    lastFrame = currentTime;

    updateTranslation(totalOffset);
    animationId = requestAnimationFrame(tryAnimate);
  };

  const tryCancel = () => {
    if (animationId == null) return;
    cancelAnimationFrame(animationId);
    animationId = null;
  };

  onMount(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting != isVisible) {
        isVisible = entry.isIntersecting;
        tryAnimate();
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  });
</script>

<div
  class="border-accent py-inset touch-pan-y border-y-1 contain-paint"
  bind:this={container}
  onpointerdown={(e) => {
    if (e.button !== 0) return;

    pointerId = e.pointerId;
    e.currentTarget.setPointerCapture(pointerId);

    window.getSelection()?.removeAllRanges();
    clientX = e.clientX;
    clientY = e.clientY;
    startPos = pos;
    tryCancel();
  }}
  onpointermove={(e) => {
    if (e.pointerId != pointerId) return;

    totalOffset = startPos - (e.clientX - clientX);
    updateTranslation(totalOffset);
  }}
  onpointerup={(e) => {
    if (e.pointerId != pointerId) return;
    if (pointerId) e.currentTarget.releasePointerCapture(pointerId);
    pointerId = null;

    lastFrame = performance.now();
    moveDirection = e.clientX - clientX > 0 ? -1 : 1;
    tryCancel();
    tryAnimate();
  }}
  role="marquee"
>
  <div
    bind:this={textCarousel}
    style="translate: {-pos}px 0 0"
    class="flex h-20 will-change-transform select-none md:h-25"
  >
    {#each Array(3) as _}
      <div class="flex flex-none items-center">
        {#each meta.text as item}
          <h3
            class="mx-12 flex-none font-serif text-2xl md:mx-20 md:text-3xl lg:mx-23"
          >
            {item}
          </h3>

          <Star class="text-gold size-7 shrink-0 sm:size-9" />
        {/each}
      </div>
    {/each}
  </div>
</div>
