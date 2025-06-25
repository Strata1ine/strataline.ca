<script lang="ts">
  import Label from "./Label.svelte";
  import Valid from "./Valid.svelte";
  import { field, input } from "./meta";
  import { getUid } from "@lib/stores";
  import { desc } from "@sections/meta";
  let { name = "Phone number", validate = false, required } = $props();
  let uid = getUid();
  let valid = $state(!required);
</script>

<div class="relative">
  <Label for={uid} {name} {required}></Label>
  <label class={field()}>
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
        class="w-full focus:outline-none {desc({ intent: 'sm' })}"
        inputmode="tel"
        pattern={String.raw`^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$`}
        placeholder="(xxx) xxx-xxxx"
        id={uid}
        {name}
        {required}
      />

      {#if validate}
        <Valid bind:valid />
      {/if}
    </div>
  </label>
</div>
