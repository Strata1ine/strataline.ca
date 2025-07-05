<script lang="ts">
  import Star from "~/icons/ph/star-four-fill.svelte";
  import { onMount } from "svelte";
  import { TextCarousel as Meta } from "@/meta";
  let { meta }: { meta: Meta } = $props();

  // the amount of times it repeats
  let moduloEffect = 3;

  let textCarousel: HTMLElement;
  let container: HTMLElement;

  let clientX = 0,
    clientY = 0,
    dragOffset = 0,
    totalOffset = 0,
    moveDirection = -1,
    lastFrame = 0;

  let pos = $state(0);
  let isVisible = false;
  let animationId: number | null = null;

  const updateTranslation = (offset: number) => {
    const w = textCarousel.scrollWidth / moduloEffect;
    totalOffset = offset;
    pos = ((totalOffset % w) + w) % w;
  };

  const tryAnimate = (currentTime: number = 0) => {
    if (!isVisible) return;
    updateTranslation(
      totalOffset -
        (moveDirection * meta.speed * (currentTime - lastFrame)) / 16.67,
    );
    lastFrame = currentTime;
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
        tryCancel();
        tryAnimate();
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  });

  const onpointerdown = (e: PointerEvent) => {
    if (
      e.button !== 0 ||
      !e.isPrimary ||
      e.detail > 1 ||
      container.hasPointerCapture(e.pointerId)
    )
      return;
    container.setPointerCapture(e.pointerId);
    window.getSelection()?.removeAllRanges();
    clientX = e.clientX;
    clientY = e.clientY;
    dragOffset = pos;
    tryCancel();
  };

  const onpointermove = (e: PointerEvent) => {
    if (!container.hasPointerCapture(e.pointerId)) return;
    updateTranslation(dragOffset - (e.clientX - clientX));
  };

  const onpointerup = (e: PointerEvent) => {
    if (!container.hasPointerCapture(e.pointerId)) return;
    container.releasePointerCapture(e.pointerId);
    lastFrame = performance.now();
    moveDirection = e.clientX - clientX > 0 ? 1 : -1;
    tryAnimate();
  };
</script>

<div
  class="border-accent py-inset touch-pan-y border-y-1 contain-paint"
  bind:this={container}
  {onpointerdown}
  {onpointermove}
  {onpointerup}
  onpointercancel={onpointerup}
  role="marquee"
>
  <div
    bind:this={textCarousel}
    style="transform: translateX(-{pos}px)"
    class="flex h-20 items-center will-change-transform select-none md:h-25"
  >
    {#each Array(moduloEffect).fill(meta.text).flat() as item}
      <h3
        class="mx-12 shrink-0 font-serif text-2xl md:mx-20 md:text-3xl lg:mx-23"
      >
        {item}
      </h3>

      <Star class="text-gold size-7 shrink-0 sm:size-9" />
    {/each}
  </div>
</div>
