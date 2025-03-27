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

<input
  type="range"
  name="Raiting"
  min="0.5"
  max="5"
  step="0.5"
  value={rating}
  aria-valuemin="0.5"
  aria-valuemax="5"
  aria-valuenow={rating}
  tabindex="0"
  bind:this={container}
  on:input={(e) => (rating = parseFloat(e.target.value))}
  on:pointerdown={(event) => {
    isDragging = true;
    updateRating(event);
  }}
  on:pointermove={updateRating}
  on:pointerenter={updateRating}
  on:keydown={(e) => {
    if (e.code === "ArrowRight" || e.code === "ArrowUp")
      rating = Math.min(5, rating + 0.5);
    else if (e.code === "ArrowLeft" || e.code === "ArrowDown")
      rating = Math.max(0.5, rating - 0.5);
  }}
  class="absolute z-10 cursor-pointer opacity-0"
/>

<div class="flex">
  {#each [0, 1, 2, 3, 4] as i}
    <span class="w-1/2 contain-paint">
      <label
        for={`${baseId}-star-${i}`}
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
        for={`${baseId}-star-${i + 0.5}`}
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
  {/each}
</div>
