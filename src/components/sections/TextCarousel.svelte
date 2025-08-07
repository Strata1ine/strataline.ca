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
    rawPos = 0,
    moveDirection = -1,
    lastFrame = 0;

  let pos = $state(0);
  let isVisible = false;
  let animationId: number | null = null;
  let pointerId: null | number = null;

  let currentVelocity = 0;
  let prevX = 0;

  const updateTranslation = (o: number) => {
    const w = textCarousel.children[0].scrollWidth;
    pos = o - Math.floor(o / w) * w;
  };

  const scrollMultiplier = (e: HTMLElement) => {
    return window.innerWidth / e.getBoundingClientRect().width;
  };

  const animate = (currentTime: number = 0) => {
    if (!isVisible) return;
    const friction = 0.9;
    const dt = currentTime - lastFrame;
    lastFrame = currentTime;

    const movement = currentVelocity * (dt / 16);
    rawPos += moveDirection * meta.speed * dt + movement;
    currentVelocity *= Math.pow(friction, dt / 16);

    updateTranslation(rawPos);
    animationId = requestAnimationFrame(animate);
  };

  onMount(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting != isVisible) {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          requestAnimationFrame(animate);
        } else if (animationId != null) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
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

    if (animationId != null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }

    window.getSelection()?.removeAllRanges();
    clientX = e.clientX;
    clientY = e.clientY;

    currentVelocity = 0;
    startPos = pos;
  }}
  onpointermove={(e) => {
    if (e.pointerId != pointerId) return;

    rawPos = startPos - (e.clientX - clientX);
    updateTranslation(rawPos);

    const now = performance.now();
    const dt = now - lastFrame;
    if (dt > 0) {
      currentVelocity = (prevX - e.clientX) / dt;
    }

    lastFrame = now;
    prevX = e.clientX;
  }}
  onpointerup={(e) => {
    if (e.pointerId != pointerId) return;
    if (pointerId) e.currentTarget.releasePointerCapture(pointerId);
    pointerId = null;

    const diffX = clientX - e.clientX;
    const diffY = clientY - e.clientY;
    moveDirection = diffX < 0 ? -1 : 1;

    if (Math.abs(diffX) > 20 && Math.abs(diffX) > Math.abs(diffY)) {
      currentVelocity *= scrollMultiplier(container) * 25;
      lastFrame = performance.now();
      requestAnimationFrame(animate);
    }
  }}
  role="marquee"
>
  <div
    bind:this={textCarousel}
    style="translate: {-pos}px 0 0"
    class="flex h-20 will-change-transform select-none md:h-25 "
  >
    {#each Array(3) as _}
      <div class="flex flex-none items-center">
        {#each meta.text as item}
          <h3
            class="mx-12 flex-none font-serif text-2xl md:mx-20 md:text-3xl lg:mx-23"
          >
            {item}
          </h3>

          <Star class="text-gold size-7 flex-none sm:size-9" />
        {/each}
      </div>
    {/each}
  </div>
</div>
