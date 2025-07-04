<script lang="ts">
  import { Opinion as Meta } from "@/meta";
  import Stars from "@decor/Stars.svelte";
  import { heading, desc } from "./meta";
  import { onMount } from "svelte";

  const {
    meta,
  }: {
    meta: Meta[];
  } = $props();

  let container: HTMLElement;
  let idx = 0;
  let pageX = 0,
    pageY = 0,
    startPos = 0;
  let pos = $state(0);
  let lastFrame = 0;
  let isDesktop: boolean = true;
  let length = $state(0);

  onMount(() => {
    let mediaQuery = window.matchMedia(`(max-width: 700px)`);

    const resize = () => {
      isDesktop = mediaQuery.matches;
      length = container.children.length - (isDesktop ? 0 : 1);
      setIdx(idx);
    };

    resize();
    mediaQuery.addEventListener("change", resize);
  });

  const setIdx = (idx: number) => {
    idx = Math.max(0, Math.min(idx, length - 1));
    targetPos = -(idx * (100 / container.children.length));

    if (animationId) cancelAnimationFrame(animationId);
    lastFrame = performance.now();
    animationId = requestAnimationFrame(animate);
  };

  const onpointerdown = (e: PointerEvent) => {
    if (
      e.button !== 0 ||
      e.detail > 1 ||
      !e.isPrimary ||
      container.hasPointerCapture(e.pointerId)
    )
      return;
    container.setPointerCapture(e.pointerId);
    window.getSelection()?.removeAllRanges();
    pageX = e.pageX;
    pageY = e.pageY;
    startPos = pos;

    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  };

  const onpointermove = (e: PointerEvent) => {
    if (!container.hasPointerCapture(e.pointerId)) return;
    if (Math.abs(pageX - e.pageX) > Math.abs(pageY - e.pageY)) {
      pos = startPos + ((e.pageX - pageX) / container.offsetWidth) * 100;
    }
  };

  const onpointerup = (e: PointerEvent) => {
    if (!container.hasPointerCapture(e.pointerId)) return;
    container.releasePointerCapture(e.pointerId);

    const diffX = pageX - e.pageX;
    const diffY = pageY - e.pageY;

    const a = diffX / (container.offsetWidth / container.children.length);
    if (Math.abs(diffX) > 3 && Math.abs(diffX) > Math.abs(diffY)) {
      setIdx((idx += Math.abs(a) < 1 ? Math.sign(diffX) : Math.round(a)));
    }
  };

  let animationId: null | number = null;
  let targetPos = $state(0);

  const animate = (currentTime: number) => {
    const dt = currentTime - lastFrame;
    lastFrame = currentTime;

    const diff = targetPos - pos;
    if (Math.abs(diff) < 0.01) {
      pos = targetPos;
      animationId = null;
    } else {
      pos += diff * 0.007 * dt;
      animationId = requestAnimationFrame(animate);
    }
  };
</script>

<div
  class="mt-7 cursor-grab touch-pan-y"
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
      <div class="border-accent relative flex-1 rounded-sm border p-7 md:p-10 sm:mx-2 md:mx-5">
        <div
          class="bg-accent absolute top-0 -translate-y-1/2 rounded-sm px-4 py-2"
        >
          <span class="{desc({ intent: 'sm' })} font-semibold">
            {review.location}
          </span>
        </div>

        <h3 class={heading({ intent: "2xl" })}>{review.title}</h3>

        <div class="mt-3 mb-4 flex gap-1.5" aria-label="{review.stars} out of 5 stars">
          <Stars class="size-6" length={review.stars}></Stars>
        </div>

        <p class={desc({ intent: "base" })}>{@html review.markdown}</p>
      </div>
    {/each}
  </div>
</div>

<div
  class="bg-tone relative m-auto mt-12 flex h-3 max-w-100 rounded-sm contain-paint"
>
  <button
    aria-label="Review scroller"
    class="bg-accent absolute top-0 bottom-0 cursor-grab rounded-sm"
    style="width: {100 / length}%; transform: translateX({-pos * meta.length}%)"
    tabindex="-1"
  ></button>

  {#each Array(length) as _, i}
    <button
      aria-label="View review {i}"
      class="flex-1 cursor-pointer rounded-sm"
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
