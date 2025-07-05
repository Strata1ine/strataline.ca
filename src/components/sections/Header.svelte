<script lang="ts">
  import Modal from "@modals/Modal.svelte";
  import Burger from "@decor/Burger.svelte";
  import { Header as Meta } from "@/meta";
  import { modals, getUid } from "~/lib/stores";
  import { heading, desc } from "./meta";
  let active = $state(false);
  modals.idx.subscribe((v) => (active = v == modals.mobile));
  const uid = getUid();

  const { meta, class: className }: { meta: Meta; class: string } = $props();
</script>

<ul class="mt-2 hidden gap-11 md:flex">
  {#each meta.nav as item}
    <li>
      <a
        href={`#${item.id}`}
        class="{desc({ intent: 'sm' })} c relative"
        tabindex="0"
      >
        {item.name}
      </a>
    </li>
  {/each}
</ul>

<button
  aria-label="Open mobile menu"
  class="relative z-1 size-9 cursor-pointer touch-pan-y {className}"
  data-include-in-focuslock
  tabindex="0"
  onclick={() => {
    document.body.scrollTop = document.documentElement.scrollTop = 1;
    modals.toggle(modals.mobile);
  }}
>
  <Burger bind:active />
</button>

<Modal {uid} idx={modals.mobile}>
  <ul class="px-inset flex h-full flex-col items-start justify-center gap-6">
    {#each meta.nav as item}
      <li>
        <a
          href={`#${item.id}`}
          onclick={(_) => {
            modals.close(modals.mobile);
          }}
          tabindex="0"
          class="{heading({ intent: '2xl' })} leading-none"
        >
          {item.name}
        </a>
      </li>
    {/each}
  </ul>
</Modal>

<style>
  .c {
    &::after {
      content: "";
      position: absolute;
      bottom: -0.4rem;
      right: 10%;
      left: 10%;
      transform: scaleX(0);
      height: 1px;
      background: var(--color-black);
      transition: transform 200ms ease-in-out;
      opacity: 0.5;
    }
    &:hover::after {
      transform: scaleX(1);
    }
  }
</style>
