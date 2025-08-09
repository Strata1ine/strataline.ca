<script>
  let { name, uid, required = false, open = $bindable() } = $props();
  import Asterick from "~/icons/ph/asterisk-bold.svelte";
</script>

<label
  class="absolute left-2 flex -translate-y-1/2 items-center gap-2 rounded-md bg-white px-3 select-none"
  for={uid}
  onclick={(e) => {
    if (e.currentTarget.control instanceof HTMLButtonElement) {
      e.preventDefault();
      e.currentTarget.control.click();
    }
  }}
>
  <span class="desc-md font-serif leading-none font-semibold">
    {name}
  </span>

  {#if required}
    <Asterick class="text-error size-3"></Asterick>
  {/if}
</label>
