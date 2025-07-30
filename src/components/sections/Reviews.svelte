<script lang="ts">
  import { onMount } from "svelte";
  import Stars from "@decor/Stars.svelte";
  import FeatherFill from "~/icons/ph/feather-fill.svelte";
  import { type SubPropsOf } from "./registry";
  import { containerStyles } from "./styles";
  import { modals } from "~/frontend/stores";

  const { meta }: { meta: SubPropsOf<"Reviews", "content"> } = $props();

  let container: HTMLElement;
  let idx = 0;
  let clientX = 0,
    clientY = 0,
    startPos = 0;
  let pos = $state(0);
  let lastFrame = 0;
  let length = $state(0);

  onMount(() => {
    let mediaQuery = window.matchMedia(`(max-width: 700px)`);

    const resize = () => {
      length = container.children.length - (mediaQuery.matches ? 0 : 1);
      setIdx(idx);
    };

    resize();
    mediaQuery.addEventListener("change", resize);
  });

  const setIdx = (newIdx: number) => {
    idx = Math.max(0, Math.min(newIdx, length - 1));
    targetPos = -(idx * (100 / container.children.length));

    if (animationId) cancelAnimationFrame(animationId);
    lastFrame = performance.now();
    animationId = requestAnimationFrame(animate);
  };

  const onpointerdown = (e: PointerEvent) => {
    if (
      e.button !== 0 ||
      !e.isPrimary ||
      container.hasPointerCapture(e.pointerId)
    )
      return;
    container.setPointerCapture(e.pointerId);

    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }

    window.getSelection()?.removeAllRanges();
    clientX = e.clientX;
    clientY = e.clientY;
    startPos = pos;
  };

  const onpointermove = (e: PointerEvent) => {
    if (!container.hasPointerCapture(e.pointerId)) return;
    e.preventDefault();
    if (Math.abs(clientX - e.clientX) > Math.abs(clientY - e.clientY)) {
      pos = startPos + ((e.clientX - clientX) / container.offsetWidth) * 100;
    }
  };

  const onpointerup = (e: PointerEvent) => {
    if (!container.hasPointerCapture(e.pointerId)) return;
    container.releasePointerCapture(e.pointerId);

    const diffX = clientX - e.clientX;
    const diffY = clientY - e.clientY;

    if (Math.abs(diffX) > 30 && Math.abs(diffX) > Math.abs(diffY)) {
      const a = diffX / (container.offsetWidth / meta.length);
      setIdx((idx += Math.abs(a) < 1 ? Math.sign(diffX) : Math.round(a)));
    } else {
      setIdx(idx);
    }
  };

  let animationId: null | number = null;
  let targetPos = $state(0);

  const animate = (currentTime: number) => {
    const dt = currentTime - lastFrame;
    lastFrame = currentTime;

    const diff = targetPos - pos;
    if (Math.abs(diff) < 0.01) {
      animationId = null;
      pos = targetPos;
    } else {
      pos += diff * 0.007777 * dt;
      animationId = requestAnimationFrame(animate);
    }
  };
</script>

<div
  class="relative mt-7 cursor-grab touch-pan-y"
  {onpointerdown}
  {onpointermove}
  {onpointerup}
  onpointercancel={onpointerup}
>
  <div
    class="c flex"
    bind:this={container}
    style="transform: translateX({pos}%); --length: {meta.length}%"
  >
    {#each meta as review}
      <div
        class="border-accent relative flex-1 rounded-sm border p-7 sm:mx-2 md:p-10 lg:mx-5"
      >
        <div
          class="bg-accent absolute top-0 -translate-y-1/2 rounded-sm px-4 py-2"
        >
          <span class="desc-sm font-semibold">
            {review.location}
          </span>
        </div>

        <h3 class="heading-2xl">{review.title}</h3>

        <div
          class="mt-3 mb-4 flex gap-1.5"
          aria-label="{review.stars} out of 5 stars"
        >
          <Stars class="size-6" length={review.stars}></Stars>
        </div>

        <p class="desc-base mb-5">{@html review.desc}</p>
      </div>
    {/each}
  </div>

  <div class="absolute right-4 bottom-0 translate-y-1/2 sm:right-12">
    <button
      class="bg-accent gap-inset ml-auto flex cursor-pointer items-center rounded-lg px-4 py-3"
      onclick={() => modals.open(modals.review)}
      onpointerdown={(e: PointerEvent): void => e.stopPropagation()}
    >
      <FeatherFill class="size-8"></FeatherFill>
      <span class="desc-sm font-serif">Write a review</span>
    </button>
  </div>
</div>

<div
  class="bg-tone relative m-auto mt-12 mb-4 flex h-4 w-[60vw] max-w-100 rounded-sm contain-paint {length <=
  1
    ? 'hidden'
    : ''}"
>
  <button
    aria-label="Review scroller"
    class="bg-accent absolute inset-0 cursor-grab rounded-sm"
    style="width: {100 / length}%; transform: translateX({-pos * meta.length}%)"
    tabindex="-1"
  ></button>

  {#each Array(length) as _, i}
    <button
      aria-label="View review {i}"
      class="flex-1 cursor-pointer rounded-sm"
      tabindex="0"
      onclick={() => {
        setIdx(i);
      }}
    ></button>
  {/each}
</div>

<style>
  .c {
    width: calc(var(--length) * 100);
  }

  @media (min-width: 700px) {
    .c {
      width: calc(var(--length) * 50);
    }
  }
</style>
