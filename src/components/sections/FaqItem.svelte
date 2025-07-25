<script lang="ts">
  import { slide } from "svelte/transition";
  import { sineOut } from "svelte/easing";
  import { descStyles, headingStyles } from "./styles";

  import { type SubPropsOf } from "./registry";

  let {
    meta,
    i,
    active = $bindable(),
  }: {
    meta: SubPropsOf<"Faq", "content">[0];
    i: number;
    active: number | null;
  } = $props();

  let open: boolean = $state(false);

  $effect(() => {
    open = i === active;
  });

  let button: HTMLElement;
  function slideWithScroll(node: HTMLElement, { duration = 250 }) {
    return {
      ...slide(node, { duration, easing: sineOut }),
      tick: (_: any) => {
        const r = button.getBoundingClientRect();
        if (r.top < 0) {
          window.scrollTo({ top: window.scrollY + r.top });
        }
      },
    };
  }
</script>

<div class="border-accent border-t-1 py-8 first:border-t-0">
  <button
    class="flex w-full cursor-pointer items-center justify-between"
    bind:this={button}
    onclick={(e) => {
      active = open ? null : i;
      window.getSelection()?.removeAllRanges();
    }}
  >
    <h3 class={headingStyles({ size: "3xl" })}>{meta.title}</h3>
    <div
      class="expand relative size-6 gap-4 flex-shrink-0{i === active
        ? ' open'
        : ''}"
    ></div>
  </button>

  {#if open}
    <p
      transition:slideWithScroll={{ duration: 350 }}
      class="{descStyles({ size: 'base' })} mt-2"
    >
      {@html meta.markdown}
    </p>
  {/if}
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
