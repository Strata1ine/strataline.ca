<script lang="ts">
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";

  const baseId = crypto.randomUUID();
  export let rating = 5;
  let isDragging = false;
  let container: HTMLInputElement;

  onMount(() => {
    window.addEventListener("pointerup", () => (isDragging = false));
    return () =>
      window.removeEventListener("pointerup", () => (isDragging = false));
  });

  function updateRating(event: PointerEvent) {
    if (!isDragging) return;
    const rect = container.getBoundingClientRect();
    const x = Math.max(0, event.clientX - rect.left);
    rating = Math.round(Math.min(5, (x / rect.width) * 5) * 2) / 2;
  }
</script>

<div class="relative inline-block">
  <input
    type="range"
    name="Raiting"
    min="0"
    max="5"
    step="0.5"
    id={baseId}
    value={rating}
    aria-valuemin="0.5"
    aria-valuemax="5"
    aria-valuenow={rating}
    bind:this={container}
    on:input={(e) => (rating = parseFloat(e.target.value))}
    on:pointerdown={(event) => {
      isDragging = true;
      updateRating(event);
    }}
    on:pointermove={updateRating}
    on:pointerenter={updateRating}
    class="absolute inset-0 z-10 cursor-pointer appearance-none [&::-moz-range-thumb]:invisible [&::-ms-thumb]:invisible [&::-webkit-slider-thumb]:invisible"
  />

  <div class="flex">
    {#each [0, 1, 2, 3, 4] as i}
      <div class="relative flex">
        <span class="w-1/2 contain-paint">
          <label
            for={baseId}
            aria-label={`Rate ${i}`}
            class="flex cursor-pointer"
          >
            <span class="sr-only">Rate ${i}</span>
            <span class:text-tone={i >= rating} class:text-gold={i < rating}>
              <Icon icon="ph:star-fill" class="h-auto w-10 text-gray-300" />
            </span>
          </label>
        </span>
        <span class="relative w-1/2 flex-1 scale-x-[-1] contain-paint">
          <label
            for={baseId}
            aria-label={`Rate ${i + 0.5}`}
            class="absolute cursor-pointer"
          >
            <span class="sr-only">Rate ${i + 0.5}</span>
            <span
              class:text-tone={i + 0.5 >= rating}
              class:text-gold={i + 0.5 < rating}
            >
              <Icon icon="ph:star-fill" class="h-auto w-10 text-gray-300" />
            </span>
          </label>
        </span>
      </div>
    {/each}
  </div>
</div>
