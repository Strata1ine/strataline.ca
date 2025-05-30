<script>
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";
  import { id } from "./Input.svelte";

  let { rating = 5 } = $props();

  const baseId = id();
  let isDragging = false;
  let self = null;

  onMount(() => {
    const handlePointerUp = () => (isDragging = false);
    window.addEventListener("pointerup", handlePointerUp);
    return () => window.removeEventListener("pointerup", handlePointerUp);
  });

  function updateRating(event) {
    if (!isDragging || !self) return;
    const rect = self.getBoundingClientRect();
    const x = Math.max(0, event.clientX - rect.left);
    rating = Math.round(Math.min(5, (x / rect.width) * 5) * 2) / 2;
  }
</script>

<div class="relative inline-block">
  <input
    type="range"
    name="Rating"
    min="0"
    max="5"
    step="0.5"
    id={baseId}
    value={rating}
    aria-valuemin="0.5"
    aria-valuemax="5"
    aria-valuenow={rating}
    bind:this={self}
    oninput={(e) => (rating = parseFloat(e.target.value))}
    onpointerdown={(event) => {
      isDragging = true;
      updateRating(event);
    }}
    onpointermove={updateRating}
    onpointerenter={updateRating}
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
            <span class="sr-only">Rate {i}</span>
            <span class={i < rating ? "text-gold" : "text-tone"}>
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
            <span class="sr-only">Rate {i + 0.5}</span>
            <span class={i + 0.5 < rating ? "text-gold" : "text-tone"}>
              <Icon icon="ph:star-fill" class="h-auto w-10 text-gray-300" />
            </span>
          </label>
        </span>
      </div>
    {/each}
  </div>
</div>
