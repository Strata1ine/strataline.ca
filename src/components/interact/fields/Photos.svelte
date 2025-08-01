<script>
  import Field from "./Field.svelte";
  import Upload from "~/icons/ph/upload-simple-fill.svelte";
  import ImagesSquare from "~/icons/ph/images-square-fill.svelte";
  import { inputStyles } from "./styles";
  import { genUid } from "~/frontend/stores.svelte";
  let { name = "Photos", base = "None selected", required = false } = $props();
  let value = $state(base);
  let uid = genUid();
</script>

<Field {uid} {name} {required}>
  <input
    class="sr-only"
    tabindex="0"
    accept="image/*"
    multiple
    type="file"
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

  <div class="{inputStyles()} cursor-pointer">
    <ImagesSquare class="size-8" />
    <span class="desc-sm flex-1">{value}</span>
    <Upload class="size-6" />
  </div>
</Field>
