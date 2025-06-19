<script>
  import Icon from "@iconify/svelte";

  let { name, required, id, uid, onmousedown } = $props();
</script>

<label
  class="absolute left-2 flex -translate-y-1/2 items-center gap-2 rounded-sm bg-white px-3 select-none"
  {id}
  for={uid}
  {onmousedown}
>
  <span class="text-md font-serif leading-none font-semibold">
    {name}
  </span>

  {#if required}
    <Icon icon="ph:asterisk-bold" class="text-error size-3"></Icon>
  {/if}
</label>
