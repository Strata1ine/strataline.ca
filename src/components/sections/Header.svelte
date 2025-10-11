<script lang="ts">
  import Modal from "@/components/modals/Modal.svelte";
  import Burger from "@/components/decor/Burger.svelte";
  import { modals, genUid } from "@/frontend/stores.svelte";

  let open = $derived(modals.is(modals.mobile));
  const uid = genUid();

  import { modalStyles } from "@/components/modals/styles";
  import { type PropsOf } from "@/components/registry";
  const { meta }: { meta: PropsOf<"Header"> } = $props();
</script>

<ul class="mt-1 hidden gap-14 md:flex">
  {#each meta.content as item}
    <li>
      <a href="#{item.id}" class="desc-sm c relative" tabindex="0">
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
  <Burger bind:open />
</button>

<Modal class={modalStyles({ open })} {uid} bind:open>
  <ul class="px-inset flex h-full flex-col items-start justify-center gap-6">
    {#each meta.content as item}
      <li>
        <a
          href={`#${item.id}`}
          onclick={(_) => {
            modals.close();
          }}
          tabindex="0"
          class="heading-2xl leading-none"
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
