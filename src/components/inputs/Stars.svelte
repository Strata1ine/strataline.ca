<script>
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";
  export let rating = 4;
  let isDragging = false;
  let container;

  onMount(() => {
    window.addEventListener("mouseup", () => (isDragging = false));
    return () =>
      window.removeEventListener("mouseup", () => (isDragging = false));
  });

  function updateRating(event) {
    if (!isDragging) return;
    const rect = container.getBoundingClientRect();
    const x = Math.max(0, event.clientX - rect.left);
    rating = Math.round(Math.min(5, (x / rect.width) * 5) * 2) / 2;
  }
</script>

<div
  class="flex relative"
  role="slider"
  aria-valuemin="0.5"
  aria-valuemax="5"
  tabindex="0"
  aria-valuenow={rating}
  bind:this={container}
  on:mousedown={(event) => {
    isDragging = true;
    updateRating(event);
  }}
  on:mousemove={updateRating}
  on:mouseenter={updateRating}
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
        id={`star-${i}`}
        name="rating"
        value={i}
        class="absolute opacity-0"
        checked={rating === i}
        on:change={() => (rating = i)}
      />
      <span class="contain-paint w-1/2">
        <label for={`star-${i}`} class="flex cursor-pointer">
          <span class="sr-only">Rate {i}</span>
          <span class:text-tone={i >= rating} class:text-gold={i < rating}>
            <Icon icon="ph:star-fill" class="h-auto w-10 text-gray-300" />
          </span>
        </label>
      </span>
      <input
        type="radio"
        id={`star-${i + 0.5}`}
        name="rating"
        value={i + 0.5}
        class="absolute opacity-0"
        checked={rating === i + 0.5}
        on:change={() => (rating = i + 0.5)}
      />
      <span class="relative contain-paint w-1/2 flex-1 scale-x-[-1]">
        <span class="sr-only">Rate {i + 0.5}</span>
        <label for={`star-${i + 0.5}`} class="cursor-pointer absolute">
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
