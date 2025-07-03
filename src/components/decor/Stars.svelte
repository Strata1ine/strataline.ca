<script lang="ts">
  let { length = $bindable(0.0), class: className } = $props();
  import Star from "~/icons/ph/star-fill.svelte";
</script>

{#each Array(5) as _, i}
  <div class={className}>
    {#if i + 0.5 < length}
      <Star class="text-gold" />
    {:else if i + 0.5 > length}
      <Star class="text-tone" />
    {:else}
      <div class="relative">
        <Star
          class="absolute [clip-path:inset(0_50%_0_0)] {i < length
            ? 'text-gold'
            : 'text-tone'}"
        />
        <Star
          class="absolute [clip-path:inset(0_0_0_50%)] {i + 0.5 < length
            ? 'text-gold'
            : 'text-tone'}"
        />
      </div>
    {/if}
  </div>
{/each}
