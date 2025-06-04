<script>
  import Icon from "@iconify/svelte";

  let { name, class: className, required, uid, children } = $props();
</script>

<label
  class="absolute left-2 z-1 flex -translate-y-1/2 items-center gap-2 rounded-sm bg-white px-3 select-none"
  for={uid}
>
  <span class="text-md font-serif leading-none font-semibold">
    {name}
  </span>

  {#if required}
    <Icon icon="ph:asterisk-bold" class="text-error w-3"></Icon>
  {/if}
</label>

<label class={className} for={uid}>
  {@render children()}
</label>
