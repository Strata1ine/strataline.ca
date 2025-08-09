<script lang="ts">
  import { actionStyles } from "@actions/styles";
  import { containerStyles, imageStyles, imageWrapperStyles } from "./styles";
  import CaretCircleLeftFill from "~/icons/ph/caret-circle-left-fill.svelte";

  import { type PropsOf } from "./registry";

  const { meta }: { meta: PropsOf<"ImageCarousel"> } = $props();

  let container: HTMLElement;
  let imageCarousel: HTMLElement;
  let pos = $state(0);
  let pointerId: null | number = null;
  let animationId: null | number = null;

  let lastFrame = 0;
  let currentVelocity = 0;
  let prevX = 0;

  const scrollMultiplier = (e: HTMLElement) => {
    return window.innerWidth / e.getBoundingClientRect().width;
  };

  const animate = (currentTime: number = 0) => {
    const friction = 0.9;
    const dt = currentTime - lastFrame;
    lastFrame = currentTime;

    if (Math.abs(currentVelocity) > 0.1) {
      const movement = currentVelocity * (dt / 16);
      pos += movement;
      updateTranslation(pos);
      currentVelocity *= Math.pow(friction, dt / 16);
      animationId = requestAnimationFrame(animate);
    } else {
      animationId = null;
    }
  };

  function reset() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  let clientX = 0,
    clientY = 0,
    startPos = 0,
    rawPos = 0;

  const updateTranslation = (o: number) => {
    const w = imageCarousel.children[0].scrollWidth;
    pos = o - Math.floor(o / w) * w;
  };
</script>

<div
  bind:this={container}
  class="{imageWrapperStyles({
    size: 'lg',
  })} cursor-grab touch-pan-y"
  onpointerdown={(e) => {
    if (e.button !== 0) return;
    reset();

    pointerId = e.pointerId;
    e.currentTarget.setPointerCapture(pointerId);
    currentVelocity = 0;

    window.getSelection()?.removeAllRanges();
    clientX = e.clientX;
    clientY = e.clientY;
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
    e.currentTarget.releasePointerCapture(pointerId);
    pointerId = null;

    const diffX = clientX - e.clientX;
    const diffY = clientY - e.clientY;

    if (Math.abs(diffX) > 20 && Math.abs(diffX) > Math.abs(diffY)) {
      currentVelocity *= scrollMultiplier(container) * 30;
      lastFrame = performance.now();
      requestAnimationFrame(animate);
    }
  }}
  role="region"
  aria-label="Image carousel"
>
  <div
    bind:this={imageCarousel}
    class="flex h-full will-change-transform"
    style="translate: {-pos}px 0 0;"
  >
    {#each Array(2) as _, i}
      <div
        class="flex h-full flex-none"
        aria-hidden={i > 0 ? "true" : undefined}
      >
        {#each meta.content as image}
          <div class="h-full flex-none">
            <img
              class="{imageStyles()} mx-2 block max-w-screen rounded-sm md:mx-4"
              {...image.meta}
              alt={image.alt}
            />
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>

<div class="{containerStyles({ width: 'inner' })} mt-9 flex justify-end gap-1">
  <button
    class="{actionStyles({
      background: null,
      variant: null,
    })} relative"
    onclick={() => {
      reset();
      lastFrame = performance.now();
      currentVelocity = -(scrollMultiplier(container) * 40);
      requestAnimationFrame(animate);
    }}
    aria-label="Scroll carousel left"
    tabindex="0"
  >
    <span class="absolute inset-4 z-[-1] rounded-[50%] bg-black"></span>
    <CaretCircleLeftFill class="text-tone size-20" />
  </button>

  <button
    class="{actionStyles({
      background: null,
      variant: null,
    })} relative"
    onclick={() => {
      reset();
      lastFrame = performance.now();
      currentVelocity = scrollMultiplier(container) * 40;
      requestAnimationFrame(animate);
    }}
    aria-label="Scroll carousel right"
    tabindex="0"
  >
    <span class="absolute inset-4 z-[-1] rounded-[50%] bg-black"></span>
    <CaretCircleLeftFill class="text-tone size-20 rotate-180" />
  </button>
</div>
