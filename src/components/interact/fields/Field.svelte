<script>
  import Icon from "@iconify/svelte";

  let { name, class: className, required, id, children } = $props();
</script>

<label
  class="absolute left-2 flex -translate-y-1/2 items-center gap-2 rounded-sm bg-white px-3 select-none"
  for={id}
>
  <span class="text-md font-serif leading-none font-semibold">
    {name}
  </span>

  {#if required}
    <Icon icon="ph:asterisk-bold" class="text-error w-3"></Icon>
  {/if}
</label>

<label class={className} for={id}>
  {@render children()}
</label>
