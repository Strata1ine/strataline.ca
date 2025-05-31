<script>
  import Icon from "@iconify/svelte";
  import Input from "./Input.svelte";
  let { base, values } = $props();

  let value = $state(base);
</script>

<Input
  as="select"
  name="Location"
  oninput={(e) => {
    value = e.target.value;
  }}
>
  {#snippet overlay()}
    <Icon icon="ph:navigation-arrow-fill" class="h-auto w-8" />
    <span class="font-sans text-sm sm:text-base">{value}</span>
  {/snippet}

  {#snippet icons()}
    <Icon icon="ph:caret-down-fill" class="h-auto w-5" />
  {/snippet}

  {#each [base, ...values] as value}
    <option class="font-sans text-sm text-black sm:text-base">{value}</option>
  {/each}
</Input>
