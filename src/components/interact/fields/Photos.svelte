<script>
  import Field from "./Field.svelte";
  import Upload from "~/icons/ph/upload-simple-fill.svelte";
  import ImagesSquare from "~/icons/ph/images-square-fill.svelte";
  import { input } from "./meta";
  import { getUid } from "~/frontend/stores";
  import { desc } from "@sections/meta";
  let { name = "Photos", base = "None selected", required = false } = $props();
  let value = $state(base);
  let uid = getUid();
</script>

<Field {uid} {name} {required}>
  <input
    class="hidden"
    accept="image/*"
    multiple
    type="file"
    tabindex="0"
    id={uid}
    {name}
    onchange={(e) => {
      if (e.target.files.length > 0) {
        value = `${e.target.files.length} photo(s) selected`;
      } else {
        value = base;
      }
    }}
  />

  <div class="{input()} cursor-pointer">
    <ImagesSquare class="size-8" />
    <div class="flex-1">
      <span class={desc({ intent: "sm" })}>{value}</span>
    </div>
    <Upload class="size-6" />
  </div>
</Field>
