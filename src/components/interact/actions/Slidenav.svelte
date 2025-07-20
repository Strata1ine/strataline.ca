<script lang="ts">
  import { navStyles } from "@actions/styles";

  let {
    idx = $bindable(0),
    class: className,
    length,
  }: {
    idx: number;
    class?: string;
    length: number;
  } = $props();
</script>

<div class="relative {className}">
  {#each Array(length) as _, i}
    <button
      onclick={() => (idx = i)}
      aria-label="View slide {i + 1}"
      class={navStyles({ open: idx === i })}
      tabindex="0"
    ></button>
  {/each}
</div>
