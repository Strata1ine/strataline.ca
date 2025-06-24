<script lang="ts">
  import Label from "./Label.svelte";
  import Valid from "./Valid.svelte";
  import { field, input } from "./meta";
  import { getUid } from "~/lib/stores";

  const { values, name, required, validate = false, ...slot } = $props();
  let uid = getUid();
  let valid = $state(false);
</script>

<div class="relative">
  <Label for={uid} {name} {required}></Label>
  <label class={field()}>
    <div class={input()}>
      <input
        oninput={(e) => {
          valid = e.currentTarget.validity.valid;
        }}
        class="w-full text-sm focus:outline-none sm:text-base"
        autocomplete="on"
        type="text"
        id={uid}
        {required}
        {...slot}
      />

      {#if validate}
        <Valid bind:valid></Valid>
      {/if}
    </div>
  </label>
</div>
