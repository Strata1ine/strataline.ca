<script lang="ts">
  import Field from "./Field.svelte";
  import Valid from "./Valid.svelte";
  import { field, input } from "./meta";
  import { getId } from "~/lib/stores";

  const { values, name, required, validate = false, ...slot } = $props();
  let id = getId();
  let valid = $state(false);
</script>

<div class="relative">
  <Field class={field()} {id} {name} {required}>
    <div class={input()}>
      <input
        oninput={(e) => {
          valid = e.currentTarget.validity.valid;
        }}
        class="w-full text-sm focus:outline-none sm:text-base"
        autocomplete="on"
        type="text"
        {id}
        {required}
        {...slot}
      />

      {#if validate}
        <Valid bind:valid></Valid>
      {/if}
    </div>
  </Field>
</div>
