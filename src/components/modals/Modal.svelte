<script>
  import { modals } from "@/frontend/stores.svelte";
  import { focusLock } from "@/frontend/focus";

  const { class: className, open = $bindable(), uid, children } = $props();
</script>

<div
  use:focusLock={open}
  role="dialog"
  aria-modal="true"
  aria-labelledby={uid}
  tabindex="-1"
  onkeydown={(e) => {
    if (e.key === "Escape") {
      modals.close();
    }
  }}
  class={className}
  inert={!open}
  aria-hidden={!open}
>
  {@render children?.()}
</div>
