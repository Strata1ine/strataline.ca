<script lang="ts">
  import Field from "./Field.svelte";
  import Valid from "./Valid.svelte";
  import { field, input } from "./meta";
  import { getId } from "~/lib/stores";
  let { name = "Phone number", validate = false, required } = $props();
  let id = getId();
  let valid = $state(false);
</script>

<div class="relative">
  <Field class={field()} {id} {name} {required}>
    <div class={input()}>
      <input
        oninput={(e) => {
          const t = e.currentTarget;
          let newValue = t.value.replace(/\D/g, "");
          let pos = t.selectionStart || 0;
          if (newValue.length == 4 || newValue.length == 7) {
            pos += 3;
          }
          if (newValue.length > 3 && newValue.length <= 6) {
            newValue = `(${newValue.slice(0, 3)}) ${newValue.slice(3)}`;
          } else if (newValue.length > 6) {
            newValue = `(${newValue.slice(0, 3)}) ${newValue.slice(3, 6)}-${newValue.slice(6, 10)}`;
          }
          t.value = newValue;
          t.setSelectionRange(pos, pos);
          valid = t.validity.valid;
        }}
        class="w-full text-sm focus:outline-none sm:text-base"
        inputmode="tel"
        pattern={String.raw`^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$`}
        placeholder="(xxx) xxx-xxxx"
        {id}
        {name}
        {required}
      />

      {#if validate}
        <Valid bind:valid />
      {/if}
    </div>
  </Field>
</div>
