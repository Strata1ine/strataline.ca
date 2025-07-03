<script>
  import Asterick from "~/icons/ph/asterisk-bold.svelte";
  import { desc } from "@sections/meta";
  let { name, required, for: f } = $props();
</script>

<label
  class="absolute left-2 flex -translate-y-1/2 items-center gap-2 rounded-sm bg-white px-3 select-none"
  for={f}
  onclick={(e) => {
    if (e.currentTarget.control instanceof HTMLButtonElement) {
      e.preventDefault();
      e.currentTarget.control.click();
    }
  }}
>
  <span class={desc({ intent: "label" })}>
    {name}
  </span>

  {#if required}
    <Asterick class="text-error size-3"></Asterick>
  {/if}
</label>
