<script lang="ts">
  import Label from "./Label.svelte";
  import Valid from "./Valid.svelte";
  import { getUid } from "~/lib/stores";
  import { desc } from "@sections/meta";
  import { field, input } from "./meta";

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
        class="w-full {desc({ intent: 'sm' })} focus:outline-none"
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
