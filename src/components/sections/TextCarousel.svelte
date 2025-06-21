<script lang="ts">
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";
  import { TextCarousel as Meta } from "@/meta";
  let { meta }: { meta: Meta } = $props();

  // the amount of times it repeats
  let moduloEffect = 2;

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

  const dt = (currentTime: number) => {
    let dt: number = (currentTime - lastFrame) / 16.67;
    lastFrame = currentTime;
    return dt;
  };

  const updateTranslation = () => {
    const w = textCarousel.scrollWidth / moduloEffect;
    textCarousel.style.transform = `translateX(-${totalOffset - w * Math.floor(totalOffset / w)}px)`;
  };

  const tryAnimate = (currentTime: number = 0) => {
    if (!isVisible) return;
    totalOffset += moveDirection * meta.speed * dt(currentTime);
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

  const pointerdown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    window.getSelection().removeAllRanges();
    dragStartX = e.pageX;
    dragOffset = totalOffset;
    tryCancel();
  };

  const pointermove = (e: PointerEvent) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    totalOffset = dragOffset - (e.pageX - dragStartX);
    updateTranslation();
  };

  const pointerend = (e: PointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    lastFrame = performance.now();
    moveDirection = e.pageX - dragStartX > 0 ? -1 : 1;
    tryAnimate();
  };
</script>

<div
  class="border-accent py-inset border-y-1 contain-paint"
  bind:this={visibilityBounds}
  onpointerdown={pointerdown}
  onpointermove={pointermove}
  onpointerup={pointerend}
  onpointercancel={pointerend}
>
  <div
    bind:this={textCarousel}
    class="flex h-18 items-center will-change-transform select-none md:h-20 xl:h-25"
  >
    {#each Array(moduloEffect).fill(meta.text).flat() as item}
      <h4
        class="mx-12 shrink-0 font-serif text-2xl sm:text-3xl md:mx-20 lg:mx-23"
      >
        {item}
      </h4>

      <Icon icon="ph:star-four-fill" class="text-gold size-7 shrink-0 sm:w-9" />
    {/each}
  </div>
</div>
