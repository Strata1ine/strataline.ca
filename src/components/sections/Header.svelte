<script>
  import Modal from "@modals/Modal.svelte";
  import Burger from "@decor/Burger.svelte";
  import { modals, getUid } from "~/lib/stores";
  const { class: className } = $props();
  let active = $state(false);
  modals.idx.subscribe((v) => (active = v == modals.mobile));
  const uid = getUid();
</script>

<button
  aria-label="Open mobile menu"
  class="z-1 size-9 cursor-pointer {className}"
  data-include-in-focuslock
  onclick={() => {
    modals.toggle(modals.mobile);
    window.scrollTo({ top: 0 });
  }}
>
  <Burger bind:active />
</button>

<Modal {uid} idx={modals.mobile}></Modal>
