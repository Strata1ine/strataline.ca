<script lang="ts">
  import Field from "./Field.svelte";
  import Valid from "@decor/Valid.svelte";
  import { getUid } from "~/lib/stores";
  import { input } from "./meta";
  import { desc } from "@sections/meta";

  const {
    name,
    required,
    validate = false,
    type,
    oninput,
    valid: iValid,
    pattern,
    placeholder,
    inputmode,
  } = $props();

  let valid = $state(iValid);
  let uid = getUid();
</script>

<Field {uid} {name} {required}>
  <div class={input()}>
    <input
      oninput={(e) => {
        if (oninput) oninput(e);
        valid = e.currentTarget.validity.valid;
      }}
      class="{desc({ intent: 'sm' })} w-full focus:outline-none"
      id={uid}
      tabindex="0"
      {name}
      {type}
      {required}
      {pattern}
      {placeholder}
      {inputmode}
    />

    {#if validate}
      <Valid bind:valid></Valid>
    {/if}
  </div>
</Field>
