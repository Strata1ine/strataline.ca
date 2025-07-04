<script>
  import { action } from "./meta";

  let { variant = {}, class: className, children, ...slot } = $props();
</script>

<button class="{className} {action(variant)}" {...slot} tabindex="0">
  {@render children?.()}
</button>
