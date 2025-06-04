<script lang="ts">
  import Field from "./Field.svelte";
  import { field, input } from "./meta";
  import { getId } from "~/lib/stores";
  let { required = false, class: className = "", name } = $props();
  let id = getId();
</script>

<div class="relative">
  <Field class={field({ intent: "text" })} {id} {name} {required}>
    <div class={input()}>
      <textarea
        class="w-full resize-none text-sm focus:outline-none sm:text-base {className}"
        {id}
        {name}
        {required}
      ></textarea>
    </div>
  </Field>
</div>
