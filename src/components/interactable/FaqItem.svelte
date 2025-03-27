<script context="module" lang="ts">
  import { writable } from "svelte/store";
  import { slide } from "svelte/transition";
  import { sineOut } from "svelte/easing";
  const prev = writable<HTMLElement | null>(null);
</script>

<script lang="ts">
  export let title;
  let button: HTMLElement;

  function toggleFaq() {
    $prev = $prev === button ? null : button;
  }

  function slideWithScroll(node: HTMLElement, { duration = 250 }) {
    const baseSlide = slide(node, { duration, easing: sineOut });
    return {
      ...baseSlide,
      css: (t: number) =>
        `height: ${baseSlide.css(t)} ${sineOut(t) * 100}%; opacity: ${sineOut(t)}`,
      tick: (t: number) => {
        const r = button.getBoundingClientRect();
        if ($prev === button && r.top < 0) {
          window.scrollTo({ top: window.scrollY + r.top });
        }
      },
    };
  }

  $: isActive = $prev === button;
</script>

<button bind:this={button} class="w-full cursor-pointer" on:click={toggleFaq}>
  <div class="flex items-center justify-between gap-4">
    <h3 class="font-serif text-2xl font-semibold">{title}</h3>
    <div
      class="expand relative h-6 w-6 flex-shrink-0 {isActive ? 'active' : ''}"
    ></div>
  </div>
  <div class="overflow-hidden" aria-hidden={!isActive}>
    {#if isActive}
      <div transition:slideWithScroll={{ duration: 250 }} class="mt-2">
        <slot />
      </div>
    {:else}
      <div class="hidden">
        <slot />
      </div>
    {/if}
  </div>
</button>

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
    &.active::before {
      transform: rotateZ(90deg);
    }
  }
</style>
