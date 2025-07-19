<script lang="ts">
  import Modal from "@modals/Modal.svelte";
  import Burger from "@decor/Burger.svelte";
  import { modals, getUid } from "~/frontend/stores";
  import { heading, desc } from "./meta";
  let active = $state(false);
  modals.idx.subscribe((v) => (active = v == modals.mobile));
  const uid = getUid();

  import { type PropsOf } from "./registry";
  const { meta }: { meta: PropsOf<"Header"> } = $props();
</script>

<ul class="mt-2 hidden gap-11 md:flex">
  {#each meta.nav as item}
    <li>
      <a
        href="#{item.id}"
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
  class="relative z-1 size-10 cursor-pointer touch-manipulation md:hidden"
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
            modals.close();
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
