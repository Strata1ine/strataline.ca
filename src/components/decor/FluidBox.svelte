<script lang="ts">
  import { modals } from "~/frontend/stores";
  import Mailbox from "~/icons/ph/mailbox-fill.svelte";
  import { actionStyles } from "@actions/styles";
  import { onMount } from "svelte";

  let sensor: HTMLElement;
  let fixed: boolean = $state(true);
  let tv: null | string = $state(null);

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const outside = !(entry.intersectionRatio < 1.0);
        if (outside != (fixed || entry.boundingClientRect.top < 0)) {
          fixed = outside;
        }
      },
      { threshold: [0, 1.0] },
    );

    observer.observe(sensor);
    update();
    window.addEventListener("resize", () => update());
  });

  const size = 90;
  const inset = 20;

  const update = () => {
    if (!fixed) {
      const r = sensor.getBoundingClientRect();
      const x = window.innerWidth - r.x;
      const y = window.innerHeight;
      tv = `translate: ${x - size - inset}px ${y - size - inset}px`;
    } else {
      tv = null;
    }
  };

  $effect(() => {
    fixed;
    update();
  });

  const center =
    "absolute transition-[opacity] will-change-[opacity] duration-800 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
</script>

<div class="relative mt-9 h-14 xl:h-16" bind:this={sensor}>
  <button
    class="pointer-events-auto z-1 transform-gpu will-change-transform {fixed
      ? `${actionStyles()} absolute inset-0 h-14 w-34 xl:h-16 xl:w-42`
      : `${actionStyles({ variant: 'pill', background: 'accent' })} fixed top-0 w-[${size}px] h-[${size}px]`}"
    style="{tv}; transition-property: width, height, border-radius, translate, background-color, color; transition-duration: 800ms"
    onclick={() => modals.open(modals.talk)}
  >
    <div
      class="{center} whitespace-nowrap {fixed ? 'opacity-100' : 'opacity-0'}"
    >
      Let's Talk
    </div>

    <Mailbox
      class="{center} h-full w-full p-4 {!fixed ? 'opacity-100' : 'opacity-0'}"
    ></Mailbox>
  </button>
</div>
