<script>
  import Input from "./Input.svelte";
  import Icon from "@iconify/svelte";

  let { name = "Photos", base = "None selected" } = $props();
  let value = $state(base);
</script>

<Input
  {name}
  accept="image/*"
  multiple
  type="file"
  onchange={(e) => {
    if (e.target.files.length > 0) {
      value = `${e.target.files.length} photo(s) selected`;
    } else {
      value = base;
    }
  }}
>
  {#snippet overlay()}
    <Icon icon="ph:images-square-fill" class="h-auto w-8" />
    <span class="font-sans text-sm sm:text-base">{value}</span>
  {/snippet}
</Input>
