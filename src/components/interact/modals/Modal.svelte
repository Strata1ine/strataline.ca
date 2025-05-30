<script>
  import { cva } from "class-variance-authority";
  import { modals } from "~/lib/stores";
  import { focusLock } from "~/lib/focus.js";

  export const style = cva("fixed inset-0 flex overflow-scroll duration-250", {
    variants: {
      intent: {
        fill: "bg-white xl:hidden",
        blur: "bg-white sm:bg-transparent sm:backdrop-blur-[5rem]",
      },
    },
    defaultVariants: {
      intent: "fill",
    },
  });

  const { varaint = {}, class: customClass = "", children } = $props();

  let active = $state(false);
  modals.idx.subscribe((v) => (active = v));
</script>

<div
  use:focusLock={active}
  role="dialog"
  aria-modal="true"
  class="{style(varaint)} {customClass} {active ? '' : 'opacity-0'}"
  aria-hidden={!active}
  inert={!active}
>
  {@render children?.()}
</div>
