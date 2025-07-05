<script>
  import Check from "~/icons/ph/check-bold.svelte";
  import X from "~/icons/ph/x-bold.svelte";

  const { valid = $bindable() } = $props();
</script>

<div class="relative size-6">
  <Check
    class="text-success absolute size-full duration-250 {!valid
      ? '-translate-y-full opacity-0'
      : ''}"
  />

  <X
    class="text-error size-full duration-250 {valid
      ? '-translate-y-full opacity-0'
      : ''}"
  />
</div>
