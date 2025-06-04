<script lang="ts">
  import Field from "./Field.svelte";
  import Valid from "./Valid.svelte";
  import { field, input } from "./meta";

  const { values, name, required, validate = false, ...slot } = $props();
  let uid = crypto.randomUUID();
  let valid = $state(false);
</script>

<div class="relative">
  <Field class={field({ intent: "text" })} {uid} {name} {required}>
    <div class={input()}>
      <input
        oninput={(e) => {
          valid = e.currentTarget.validity.valid;
        }}
        class="flex-1 text-sm focus:outline-none sm:text-base"
        autocomplete="on"
        id={uid}
        type="text"
        {required}
        {...slot}
      />

      {#if validate}
        <Valid bind:valid></Valid>
      {/if}
    </div>
  </Field>
</div>
