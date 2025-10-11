<script>
  import Label from "@/components/fields/Label.svelte";
  import { fieldStyles } from "./styles";

  import { clickOutside } from "@/frontend/focus";
  let { name, uid, required, children, open = $bindable() } = $props();
</script>

<div
  class="relative my-10 touch-manipulation"
  use:clickOutside={open !== undefined
    ? () => {
        open = false;
      }
    : () => {}}
>
  <Label {name} {uid} {required} />
  <label class={fieldStyles({ open })}>
    {@render children?.()}
  </label>
</div>
