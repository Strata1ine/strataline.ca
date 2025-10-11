<script lang="ts">
  import { dotStyles } from "@/components/actions/styles";
  import { videoPlaying } from "@/frontend/stores.svelte";

  let {
    idx = $bindable(0),
    length,
  }: {
    idx: number;
    class?: string;
    length: number;
  } = $props();
</script>

{#each Array(length) as _, i}
  <button
    onclick={() => {
      videoPlaying.set(false);
      idx = i;
    }}
    aria-label="View slide {i + 1}"
    class="cursor-pointer touch-manipulation p-2"
    tabindex="0"
  >
    <div class={dotStyles({ open: idx === i })}></div>
  </button>
{/each}
