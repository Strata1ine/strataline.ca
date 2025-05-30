<script>
  import clsx from "clsx";
  import { action } from "./meta";

  let { variant = {}, children, ...slot } = $props();
</script>

<a class={action(variant)} rel="noopener noreferrer" {...slot}>
  {@render children?.()}
</a>
