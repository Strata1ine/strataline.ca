<script lang="ts">
  import Star from "@icons/ph/star-four-fill.svelte";
  import { onMount } from "svelte";
  import { TextCarousel as Meta } from "@/meta";
  let { meta }: { meta: Meta } = $props();

  // the amount of times it repeats
  let moduloEffect = 3;

  let textCarousel: HTMLElement;
  let visibilityBounds: HTMLElement;

  let moveDirection = -1;
  let dragStartX = 0;
  // modulated drag
  let dragOffset = 0;
  // the offset non modulated
  let totalOffset = 0;
  let lastFrame = 0;

  let isVisible = false;
  let animationId: number | null = null;

  const updateTranslation = () => {
    const w = textCarousel.scrollWidth / moduloEffect;
    textCarousel.style.transform = `translateX(-${totalOffset - w * Math.floor(totalOffset / w)}px)`;
  };

  const tryAnimate = (currentTime: number = 0) => {
    if (!isVisible) return;
    const dt: number = (currentTime - lastFrame) / 16.67;
    lastFrame = currentTime;

    totalOffset += moveDirection * meta.speed * dt;
    updateTranslation();
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

    observer.observe(visibilityBounds);
    return () => observer.disconnect();
  });

  const onpointerdown = (e: PointerEvent) => {
    if (
      e.button !== 0 ||
      !e.isPrimary ||
      visibilityBounds.hasPointerCapture(e.pointerId)
    )
      return;
    visibilityBounds.setPointerCapture(e.pointerId);
    window.getSelection()?.removeAllRanges();
    dragStartX = e.pageX;
    dragOffset = totalOffset;
    tryCancel();
  };

  const onpointermove = (e: PointerEvent) => {
    if (!visibilityBounds.hasPointerCapture(e.pointerId)) return;
    totalOffset = dragOffset - (e.pageX - dragStartX);
    updateTranslation();
    e.preventDefault();
  };

  const onpointerup = (e: PointerEvent) => {
    if (!visibilityBounds.hasPointerCapture(e.pointerId)) return;
    visibilityBounds.releasePointerCapture(e.pointerId);
    lastFrame = performance.now();
    moveDirection = e.pageX - dragStartX > 0 ? -1 : 1;
    tryAnimate();
  };
</script>

<div
  class="border-accent py-inset touch-none border-y-1 contain-paint"
  bind:this={visibilityBounds}
  {onpointerdown}
  {onpointermove}
  {onpointerup}
  onpointercancel={onpointerup}
  role="marquee"
>
  <div
    bind:this={textCarousel}
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
