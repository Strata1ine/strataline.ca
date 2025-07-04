<script lang="ts">
  let { length = $bindable(0.0), class: className } = $props();
  import Star from "~/icons/ph/star-fill.svelte";
</script>

{#each Array(5) as _, i}
  {#if i + 0.5 < length}
    <Star class="text-gold {className}" />
  {:else if i + 0.5 > length}
    <Star class="text-tone {className}" />
  {:else}
    <div class="relative {className}">
      <Star class="text-gold [clip-path:inset(0_50%_0_0)]} absolute" />
      <Star
        class="absolute [clip-path:inset(0_0_0_50%)] {i + 0.5 < length
          ? 'text-gold'
          : 'text-tone'}"
      />
    </div>
  {/if}
{/each}
