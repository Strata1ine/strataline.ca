<script lang="ts">
  import { slide } from "svelte/transition";

  import { type PropsOf } from "./registry";
  import { quadOut } from "svelte/easing";
  const { meta }: { meta: PropsOf<"Faq"> } = $props();

  let active: null | number = $state(null);

  function slideWithScroll(node: HTMLElement, { duration = 700 }) {
    return {
      ...slide(node, { duration, easing: quadOut }),
      tick: (t: any) => {
        const r = node.getBoundingClientRect();
        if (r.top < 0) {
          window.scrollTo({ top: window.scrollY + r.top * (1 - quadOut(t)) });
        }
      },
    };
  }
</script>

<div class="-mt-6">
  {#each meta.content as faq, i}
    {@const open = i == active}

    <button
      class="border-accent w-full cursor-pointer touch-manipulation border-t-1 py-8 first:border-t-0"
      onclick={() => {
        active = open ? null : i;
        window.getSelection()?.removeAllRanges();
      }}
    >
      <div class="gap-inset flex items-center justify-between">
        <h3 class="heading-3xl">{faq.title}</h3>
        <div
          class="expand relative size-6 gap-4 flex-shrink-0{i === active
            ? ' open'
            : ''}"
        ></div>
      </div>

      {#if open}
        <div
          transition:slideWithScroll={{ duration: 350 }}
          class="prose mt-3 max-w-[110ch] font-sans sm:mr-10"
        >
          {@html faq.desc}
        </div>
      {/if}
    </button>
  {/each}
</div>

<style lang="scss">
  .expand {
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: calc(50% - 1px);
      bottom: 0;
      width: 2px;
      background-color: var(--color-black);
      transform-origin: center;
      transition: transform 250ms;
    }
    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: calc(50% - 1px);
      right: 0;
      height: 2px;
      background-color: var(--color-black);
      transform-origin: center;
    }
    &.open::before {
      transform: rotateZ(90deg);
    }
  }
</style>
