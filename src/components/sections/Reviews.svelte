<script lang="ts">
  import Stars from "@decor/Stars.svelte";
  import Feather from "~/icons/ph/feather-fill.svelte";
  import { type SubPropsOf } from "./registry";
  import { modals } from "~/frontend/stores.svelte";
  import { useQueryDevice } from "~/frontend/mobile.svelte";

  const { meta }: { meta: SubPropsOf<"Reviews", "content"> } = $props();

  let idx = 0;
  let clientX = 0,
    clientY = 0,
    startPos = 0;
  let pos = $state(0);
  let lastFrame = 0;
  let pointerId: null | number = null;

  const phone = useQueryDevice();
  const power = $derived(phone.isMobile ? 0 : 1);

  $effect(() => {
    phone.isMobile;
    setIdx(idx);
  });

  const setIdx = (newIdx: number) => {
    idx = Math.max(0, Math.min(newIdx, meta.length - power - 1));
    if (animationId) cancelAnimationFrame(animationId);

    lastFrame = performance.now();
    animationId = requestAnimationFrame(animate);
  };

  let animationId: null | number = null;

  const animate = (currentTime: number) => {
    const dt = currentTime - lastFrame;
    lastFrame = currentTime;

    const diff = idx - pos;
    if (Math.abs(diff) < 0.001) {
      animationId = null;
    } else {
      pos += diff * 0.007777 * dt;
      animationId = requestAnimationFrame(animate);
    }
  };

  function onpointerdown(
    e: PointerEvent & {
      currentTarget: EventTarget & (HTMLButtonElement | HTMLDivElement);
    },
  ) {
    if (e.button !== 0) return;
    pointerId = e.pointerId;
    e.currentTarget.setPointerCapture(pointerId);
    if (animationId) cancelAnimationFrame(animationId);
    animationId = null;
    window.getSelection()?.removeAllRanges();
    clientX = e.clientX;
    clientY = e.clientY;
    startPos = pos;
  }
</script>

<div
  class="relative my-7 cursor-grab touch-pan-y"
  {onpointerdown}
  onpointermove={(e) => {
    if (e.pointerId != pointerId) return;

    pos =
      startPos -
      ((e.clientX - clientX) / e.currentTarget.offsetWidth) * (power + 1);
  }}
  onpointerup={(e) => {
    if (e.pointerId != pointerId) return;
    if (pointerId) e.currentTarget.releasePointerCapture(pointerId);
    pointerId = null;

    const diffX = clientX - e.clientX;
    const diffY = clientY - e.clientY;

    if (Math.abs(diffX) > 20 && Math.abs(diffX) > Math.abs(diffY)) {
      setIdx(Math.sign(diffX) < 0 ? Math.floor(pos) : Math.ceil(pos));
    } else {
      setIdx(idx);
    }
  }}
>
  <div
    class="flex will-change-transform"
    style="translate: {(-pos * 100) / (power + 1)}% 0 0"
  >
    {#each meta as review}
      <div class="content-box w-full flex-none px-2 sm:w-1/2 sm:px-4">
        <div class="border-accent mb-7 h-full rounded-md border p-7 md:p-10">
          <div
            class="bg-accent absolute top-0 -translate-y-1/2 rounded-md px-4 py-2"
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
            <Stars class="size-6" length={review.stars} />
          </div>

          <p class="desc-base">{@html review.desc}</p>
        </div>
      </div>
    {/each}
  </div>

  <button
    class="bg-accent gap-inset absolute bottom-0 left-8 flex translate-y-1/2 cursor-pointer items-center rounded-lg px-4 py-3 sm:right-12 sm:left-auto"
    onclick={() => modals.open(modals.review)}
    onpointerdown={(e: PointerEvent): void => e.stopPropagation()}
  >
    <Feather class="size-8"></Feather>
    <span class="desc-sm font-serif">Write a review</span>
  </button>
</div>

{#if meta.length - power > 1}
  <div
    class="bg-tone relative m-auto mt-20 flex h-4 w-[60vw] max-w-100 rounded-md contain-paint touch-pan-y"
  >
    <button
      aria-label="Review scroller"
      class="bg-accent absolute inset-0 cursor-grab rounded-md"
      style="width: {100 / (meta.length - power)}%; translate: {pos * 100}% 0 0"
      tabindex="-1"
      {onpointerdown}
      onpointermove={(e) => {
        if (e.pointerId != pointerId) return;
        pos = startPos + (e.clientX - clientX) / e.currentTarget.offsetWidth;
      }}
      onpointerup={(e) => {
        if (e.pointerId != pointerId) return;

        e.currentTarget.releasePointerCapture(pointerId);
        pointerId = null;

        setIdx(
          Math.sign(clientX - e.clientX) > 0 ? Math.floor(pos) : Math.ceil(pos),
        );
      }}
    ></button>

    {#each Array(meta.length - power) as _, i}
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
{/if}
