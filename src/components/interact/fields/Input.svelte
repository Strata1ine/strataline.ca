<script lang="ts">
  import Field from "./Field.svelte";
  import Valid from "./Valid.svelte";
  import { getUid } from "~/lib/stores";
  import { desc } from "@sections/meta";
  import { input } from "./meta";

  const { name, required, validate = false, type } = $props();
  let uid = getUid();
  let valid = $state(false);
</script>

<Field {uid} {name} {required}>
  <div class={input()}>
    <input
      oninput={(e) => {
        valid = e.currentTarget.validity.valid;
      }}
      class="w-full {desc({ intent: 'sm' })} focus:outline-none"
      id={uid}
      tabindex="0"
      {type}
      {required}
    />

    {#if validate}
      <Valid bind:valid></Valid>
    {/if}
  </div>
</Field>
