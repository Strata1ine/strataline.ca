<script lang="ts">
  import Field from "./Field.svelte";
  import Valid from "@decor/Valid.svelte";
  import { genUid } from "~/frontend/stores.svelte";
  import { inputStyles } from "./styles";

  const {
    name,
    required,
    validate = false,
    type,
    oninput,
    valid: iValid,
    pattern,
    inputmode,
    placeholder,
    autocomplete,
  } = $props();

  let valid = $state(iValid);
  let uid = genUid();
</script>

<Field {uid} {name} {required}>
  <div class={inputStyles()}>
    <input
      oninput={(e) => {
        if (oninput) oninput(e);
        valid = e.currentTarget.validity.valid;
      }}
      class="desc-sm w-full focus:outline-none"
      id={uid}
      tabindex="0"
      {inputmode}
      {name}
      {type}
      {required}
      {pattern}
      {placeholder}
      {autocomplete}
    />

    {#if validate}
      <Valid bind:valid></Valid>
    {/if}
  </div>
</Field>
