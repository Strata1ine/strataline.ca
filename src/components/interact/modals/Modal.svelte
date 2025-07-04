<script>
  import { modals } from "~/lib/stores";
  import { focusLock } from "~/lib/focus";
  import { cover } from "./meta";

  const { variant = {}, uid, idx, children } = $props();

  let active = $state(false);
  modals.idx.subscribe((v) => (active = idx == v));
</script>

<div
  use:focusLock={active}
  role="dialog"
  aria-modal="true"
  aria-labelledby={uid}
  tabindex="-1"
  onkeydown={(e) => {
    if (e.key === "Escape") {
      modals.close();
    }
  }}
  class={cover({ ...variant, active })}
  aria-hidden={!active}
>
  {@render children?.()}
</div>
