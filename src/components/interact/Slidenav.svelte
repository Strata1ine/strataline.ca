<script lang="ts">
  import type { VariantProps } from "class-variance-authority";
  import { nav } from "@actions/meta";

  let {
    idx = $bindable(0),
    class: className,
    length,
    variant = {},
  }: {
    idx: number;
    class?: string;
    length: number;
    variant?: VariantProps<typeof nav>;
  } = $props();
</script>

<div class="relative {className}">
  {#each Array(length) as _, i}
    <button
      onclick={() => (idx = i)}
      aria-label="View slide {i}"
      class={nav({ ...variant, state: idx === i })}
    ></button>
  {/each}
</div>
