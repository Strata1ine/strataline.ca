<script>
  import Icon from "@iconify/svelte";
  const { valid = $bindable() } = $props();
</script>

<div class="relative h-auto w-6">
  <Icon
    icon="ph:check-bold"
    class="text-success absolute size-full duration-250 {!valid
      ? '-translate-y-full opacity-0'
      : ''}"
  />

  <Icon
    icon="ph:x-bold"
    class="text-error size-full duration-250 {valid
      ? '-translate-y-full opacity-0'
      : ''}"
  />
</div>
