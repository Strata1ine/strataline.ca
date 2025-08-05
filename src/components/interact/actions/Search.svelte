<script lang="ts">
  const { placeholder, values, input } = $props();
  import { fieldStyles } from "@fields/styles";
  import MagnifyingGlass from "~/icons/ph/magnifying-glass-bold.svelte";
</script>

<div
  class="flex items-center rounded-lg bg-white contain-paint {fieldStyles({
    rounded: 'xl',
  })}"
>
  <div class="px-6">
    <MagnifyingGlass class="size-10 flex-shrink-0"></MagnifyingGlass>
  </div>
  <input
    type="text"
    class="desc-sm w-full py-5 pr-6 focus:outline-none"
    {placeholder}
  />
</div>
