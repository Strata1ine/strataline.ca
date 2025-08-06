<script>
  import Check from "~/icons/ph/check-bold.svelte";
  import X from "~/icons/ph/x-bold.svelte";

  const { valid = $bindable() } = $props();
</script>

<div class="relative size-6" aria-live="polite">
  <Check
    class="text-success absolute size-full duration-250 {!valid
      ? '-translate-y-full opacity-0'
      : ''}"
    aria-hidden={!valid}
    aria-label={valid ? "Valid" : undefined}
  />
  <X
    class="text-error size-full duration-250 {valid
      ? '-translate-y-full opacity-0'
      : ''}"
    aria-hidden={valid}
    aria-label={!valid ? "Invalid" : undefined}
  />
</div>
