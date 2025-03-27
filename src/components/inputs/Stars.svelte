<script lang="ts">
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";

  const baseId = crypto.randomUUID();

  export let rating = 5;

  let isDragging = false;
  let container: HTMLElement;

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

<div
  class="relative flex"
  role="slider"
  aria-valuemin="0.5"
  aria-valuemax="5"
  tabindex="0"
  aria-valuenow={rating}
  bind:this={container}
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
      rating = Math.max(0, rating - 0.5);
  }}
>
  {#each [0, 1, 2, 3, 4] as i}
    <div class="relative flex">
      <input
        type="radio"
        id={`${baseId}-star-${i}`}
        name="rating"
        value={i}
        class="absolute opacity-0 select-none"
        checked={rating === 4}
        on:change={() => (rating = i)}
      />
      <span class="w-1/2 contain-paint">
        <label
          for={`${baseId}-star-${i}`}
          aria-label={`Rate {i}`}
          class="flex cursor-pointer"
        >
          <span class="sr-only">Rate {i}</span>
          <span class:text-tone={i >= rating} class:text-gold={i < rating}>
            <Icon icon="ph:star-fill" class="h-auto w-10 text-gray-300" />
          </span>
        </label>
      </span>
      <input
        type="radio"
        id={`${baseId}-star-${i + 0.5}`}
        name="rating"
        value={i + 0.5}
        class="absolute opacity-0"
        checked={rating === i + 0.5}
        on:change={() => (rating = i + 0.5)}
      />
      <span class="relative w-1/2 flex-1 scale-x-[-1] contain-paint">
        <span class="sr-only">Rate {i + 0.5}</span>
        <label
          for={`${baseId}-star-${i + 0.5}`}
          class="absolute cursor-pointer"
        >
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
