<script>
  import Icon from "@iconify/svelte";
  import Field from "./Field.svelte";
  import { field, input } from "./meta";
  import { getId } from "~/lib/stores";
  let { name = "Photos", base = "None selected" } = $props();
  let value = $state(base);
  let id = getId();
</script>

<div class="relative">
  <Field class={field()} {id} {name}>
    <input
      class="absolute opacity-0"
      accept="image/*"
      multiple
      type="file"
      {id}
      {name}
      onchange={(e) => {
        if (e.target.files.length > 0) {
          value = `${e.target.files.length} photo(s) selected`;
        } else {
          value = base;
        }
      }}
    />

    <div class={input()}>
      <Icon icon="ph:images-square-fill" class="h-auto w-8" />
      <span class="mr-auto font-sans text-sm sm:text-base">{value}</span>
      <Icon icon="ph:upload-simple-fill" class="h-auto w-6" />
    </div>
  </Field>
</div>
