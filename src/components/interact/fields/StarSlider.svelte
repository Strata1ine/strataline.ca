<script lang="ts">
  import Stars from "@decor/Stars.svelte";
  let rawLength = $state(10.0);
  let length = $derived(rawLength / 2);

  const min = 0;
  const max = 10;
  let isDragging = false;

  function u(e: PointerEvent) {
    const rect = e.currentTarget!.getBoundingClientRect();
    const x = Math.max(0, e.clientX - rect.left);
    rawLength = Math.round(Math.min(max, (x / rect.width) * max));
  }
</script>

<div class="mt-4">
  <input name="Stars" tabindex="-1" type="hidden" bind:value={length} />
  <div class="relative inline-flex gap-2">
    <Stars class="size-8" length={rawLength / 2}>
      <div
        class="absolute inset-0 cursor-pointer touch-none"
        role="slider"
        tabindex="0"
        aria-valuemin={min}
        aria-valuemax={max / 2}
        aria-valuenow={length}
        onpointerdown={(e) => {
          if (e.button !== 0 || !e.isPrimary || e.detail > 1 || isDragging)
            return;
          u(e);
          isDragging = true;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onpointerup={(e) => {
          isDragging = false;
          e.currentTarget.releasePointerCapture(e.pointerId);
        }}
        onpointermove={(e) => {
          if (!isDragging) return;
          u(e);
        }}
        onkeydown={(e) => {
          if (e.key === "ArrowLeft") {
            rawLength = Math.max(min, rawLength - 1.0);
          } else if (e.key === "ArrowRight") {
            rawLength = Math.min(max, rawLength + 1.0);
          }
        }}
      ></div>
    </Stars>
  </div>
</div>
