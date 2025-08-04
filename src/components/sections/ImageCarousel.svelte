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
  const friction = 0.905;

  const scrollMultiplier = (e: HTMLElement) => {
    return window.innerWidth / e.getBoundingClientRect().width;
  };

  const animate = (currentTime: number = 0) => {
    const dt = currentTime - lastFrame;
    lastFrame = currentTime;

    if (Math.abs(currentVelocity) > 0.1) {
      const movement =
        Math.sign(currentVelocity) *
        Math.min(Math.abs(currentVelocity), 90) *
        (dt / 16);
      pos -= movement;
      updateTranslation(pos);
      currentVelocity *= Math.pow(friction, dt / 16);
      animationId = requestAnimationFrame(animate);
    } else {
      animationId = null;
    }
  };

  let clientX = 0,
    clientY = 0,
    startPos = 0,
    totalOffset = 0;

  const updateTranslation = (o: number) => {
    const w = imageCarousel.children[0].scrollWidth;
    pos = o - Math.floor(o / w) * w;
  };
</script>

<div
  bind:this={container}
  class="{imageWrapperStyles({
    size: 'md',
  })} cursor-grab touch-pan-y"
  onpointerdown={(e) => {
    if (e.button !== 0) return;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }

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

    totalOffset = startPos - (e.clientX - clientX);
    updateTranslation(totalOffset);
  }}
  onpointerup={(e) => {
    if (e.pointerId != pointerId) return;
    e.currentTarget.releasePointerCapture(pointerId);
    pointerId = null;

    const diffX = clientX - e.clientX;
    const diffY = clientY - e.clientY;

    if (Math.abs(diffX) > 20 && Math.abs(diffX) > Math.abs(diffY)) {
      const deltaX = e.clientX - clientX;
      const now = performance.now();
      const dt = now - lastFrame;

      if (dt > 0) {
        currentVelocity = (deltaX / dt) * (scrollMultiplier(container) * 40);
        lastFrame = now;
      }

      lastFrame = performance.now();
      requestAnimationFrame(animate);
    }
  }}
>
  <div
    bind:this={imageCarousel}
    class="flex h-full will-change-transform"
    style="translate: {-pos}px 0 0;"
  >
    {#each Array(3) as _}
      <div class="flex h-full flex-none">
        {#each meta.content as image}
          <div class="h-full flex-none">
            <img
              class="{imageStyles()} mx-2 block max-w-screen rounded-sm sm:mx-4 md:mx-6"
              {...image.meta}
              alt={image.alt}
            />
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>

<div class="{containerStyles({ width: 'inner' })} mt-8 flex justify-end gap-1">
  <button
    class="{actionStyles({
      background: null,
      variant: null,
    })} relative"
    onclick={() => {
      currentVelocity = scrollMultiplier(container) * 40;
      requestAnimationFrame(animate);
    }}
  >
    <span class="absolute inset-4 z-[-1] rounded-[50%] bg-black"></span>
    <CaretCircleLeftFill class="text-tone size-17 sm:size-20" />
  </button>

  <button
    class="{actionStyles({
      background: null,
      variant: null,
    })} relative"
    onclick={() => {
      currentVelocity = -(scrollMultiplier(container) * 40);
      requestAnimationFrame(animate);
    }}
  >
    <span class="absolute inset-4 z-[-1] rounded-[50%] bg-black"></span>
    <CaretCircleLeftFill class="text-tone size-17 rotate-180 sm:size-20" />
  </button>
</div>
