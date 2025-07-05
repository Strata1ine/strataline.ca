<script lang="ts">
  import Field from "./Field.svelte";
  import Valid from "./Valid.svelte";
  import { getUid } from "~/lib/stores";
  import { desc } from "@sections/meta";
  import { input } from "./meta";

  let { name = "Phone number", validate = false, required } = $props();
  let uid = getUid();
  let valid = $state(!required);
</script>

<Field {uid} {name} {required}>
  <div class={input()}>
    <input
      oninput={(e) => {
        let newValue = e.currentTarget.value.replace(/\D/g, "");
        let pos = e.currentTarget.selectionStart || 0;

        if (newValue.length == 4 || newValue.length == 7) {
          pos += 3;
        }

        if (newValue.length > 3 && newValue.length <= 6) {
          newValue = `(${newValue.slice(0, 3)}) ${newValue.slice(3)}`;
        } else if (newValue.length > 6) {
          newValue = `(${newValue.slice(0, 3)}) ${newValue.slice(3, 6)}-${newValue.slice(6, 10)}`;
        }

        e.currentTarget.value = newValue;
        e.currentTarget.setSelectionRange(pos, pos);
        valid = e.currentTarget.validity.valid;
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
</Field>
