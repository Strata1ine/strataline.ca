<script lang="ts">
  import { actionStyles } from "@actions/styles";
  import { containerStyles, imageStyles } from "./styles";
  import CaretCircleLeftFill from "~/icons/ph/caret-circle-left-fill.svelte";

  import { type PropsOf } from "./registry";

  const { meta }: { meta: PropsOf<"ImageCarousel"> } = $props();

  let container: HTMLElement;
  let imageCarousel: HTMLElement;
  let pos = $state(0);
  let pointerId: null | number = null;
  let animationId: number | null = null;

  let lastFrame = 0;
  let currentVelocity = 0;
  const friction = 0.92;

  const scrollMultiplier = () => {
    return window.innerWidth / container.getBoundingClientRect().width;
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

  const onpointerup = (e: PointerEvent) => {
    if (e.pointerId != pointerId) return;
    if (pointerId) imageCarousel.releasePointerCapture(pointerId);
    imageCarousel.releasePointerCapture(e.pointerId);
    pointerId = null;

    const diffX = clientX - e.clientX;
    const diffY = clientY - e.clientY;

    const deltaX = e.clientX - clientX;
    const now = performance.now();
    const dt = now - lastFrame;

    if (dt > 0) {
      currentVelocity = (deltaX / dt) * (scrollMultiplier() * 40);
      lastFrame = now;
    }

    if (Math.abs(diffX) > 20 && Math.abs(diffX) > Math.abs(diffY)) {
      lastFrame = performance.now();
      requestAnimationFrame(animate);
    }
  };
</script>

<div
  bind:this={container}
  class="h-100 cursor-grab touch-pan-y contain-paint sm:h-140"
  onpointerdown={(e: PointerEvent) => {
    if (e.button !== 0) return;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }

    pointerId = e.pointerId;
    imageCarousel.setPointerCapture(pointerId);
    currentVelocity = 0;

    window.getSelection()?.removeAllRanges();
    clientX = e.clientX;
    clientY = e.clientY;
    startPos = pos;
  }}
  onpointermove={(e: PointerEvent) => {
    if (e.pointerId != pointerId) return;

    const deltaX = e.clientX - clientX;
    totalOffset = startPos - deltaX;
    updateTranslation(totalOffset);
  }}
  {onpointerup}
  onpointercancel={onpointerup}
>
  <div
    bind:this={imageCarousel}
    class="flex h-full will-change-transform sm:justify-center"
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
      currentVelocity = scrollMultiplier() * 40;
      requestAnimationFrame(animate);
    }}
  >
    <div class="absolute inset-4 z-[-1] rounded-[50%] bg-black"></div>
    <CaretCircleLeftFill class="text-tone size-17 sm:size-20"
    ></CaretCircleLeftFill>
  </button>

  <button
    class="{actionStyles({
      background: null,
      variant: null,
    })} relative"
    onclick={() => {
      currentVelocity = -(scrollMultiplier() * 40);
      requestAnimationFrame(animate);
    }}
  >
    <div class="absolute inset-4 z-[-1] rounded-[50%] bg-black"></div>
    <CaretCircleLeftFill class="text-tone size-17 rotate-180 sm:size-20"
    ></CaretCircleLeftFill>
  </button>
</div>
