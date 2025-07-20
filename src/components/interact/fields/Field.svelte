<script>
  import Asterick from "~/icons/ph/asterisk-bold.svelte";
  import { descStyles } from "@sections/styles";
  import { fieldStyles } from "./styles";
  import { clickOutside } from "~/frontend/focus";
  let { name, uid, required, children, open = $bindable() } = $props();
</script>

<div
  class="relative"
  use:clickOutside={open !== undefined
    ? () => {
        open = false;
      }
    : () => {}}
>
  <label
    class="absolute left-2 flex -translate-y-1/2 items-center gap-2 rounded-sm bg-white px-3 select-none"
    for={uid}
    onclick={(e) => {
      if (e.currentTarget.control instanceof HTMLButtonElement) {
        e.preventDefault();
        e.currentTarget.control.click();
      }
    }}
  >
    <span class={descStyles({ size: "md", role: "label" })}>
      {name}
    </span>

    {#if required}
      <Asterick class="text-error size-3"></Asterick>
    {/if}
  </label>
  <label class={fieldStyles({ expanded: open })}>
    {@render children?.()}
  </label>
</div>
