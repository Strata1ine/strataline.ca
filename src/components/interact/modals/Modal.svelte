<script>
  import { modals } from "~/lib/stores";
  import { focusLock } from "~/lib/focus.js";
  import { cover } from "./meta";

  const { variant = {}, class: customClass = "", id, children } = $props();

  let active = $state(false);
  modals.idx.subscribe((v) => (active = v));
</script>

<div
  use:focusLock={active}
  role="dialog"
  aria-modal="true"
  aria-labelledby={id}
  tabindex="-1"
  onkeydown={(e) => {
    if (e.key === "Escape") {
      modals.close();
    }
  }}
  class="{cover(variant)} {customClass} {active
    ? ''
    : 'pointer-events-none opacity-0'}"
  aria-hidden={!active}
>
  {@render children?.()}
</div>
