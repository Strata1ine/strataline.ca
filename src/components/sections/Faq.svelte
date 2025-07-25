<script lang="ts">
  import { type PropsOf } from "./registry";
  const { meta }: { meta: PropsOf<"Faq"> } = $props();

  let active: null | number = $state(null);
  import FaqItem from "./FaqItem.svelte";
</script>

<div class="-my-4">
  {#each meta.content as faq, i}
    <FaqItem meta={faq} {i} bind:active></FaqItem>
  {/each}
</div>
