<script lang="ts">
  import Stars from "@/components/Stars";
  let rawLength = $state(10.0);
  let length = $derived(rawLength / 2);

  const min = 0;
  const max = 10;
  let pointerId: null | number = null;

  function u(e: any) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, e.clientX - rect.left);
    rawLength = Math.round(Math.min(max, (x / rect.width) * max));
  }
</script>

<div class="select-none">
  <input name="Stars" tabindex="-1" type="hidden" bind:value={length} />
  <div class="relative inline-flex gap-2">
    <Stars class="size-8" {length}>
      <div
        class="absolute inset-0 cursor-pointer touch-none"
        tabindex="0"
        role="slider"
        aria-label="Star rating"
        aria-valuemin={min}
        aria-valuemax={max / 2}
        aria-valuenow={length}
        onpointerdown={(e) => {
          if (e.button !== 0) return;
          pointerId = e.pointerId;
          e.currentTarget.setPointerCapture(pointerId);
          u(e);
        }}
        onpointerup={(e) => {
          if (e.pointerId != pointerId) return;
          e.currentTarget.releasePointerCapture(pointerId);
          pointerId = null;
        }}
        onpointermove={(e) => {
          if (e.pointerId != pointerId) return;
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
