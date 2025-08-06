<script lang="ts">
  import { modals } from "~/frontend/stores.svelte";
  import { useQueryDevice } from "~/frontend/mobile.svelte";
  import Mailbox from "~/icons/ph/mailbox-fill.svelte";
  import { actionStyles, pillSize } from "@actions/styles";
  import { onMount } from "svelte";

  let sensor: HTMLElement;
  let above: boolean = $state(true);
  let style: null | string = $state(null);
  let hydrated: boolean = $state(false);
  let transitioning: boolean = false;

  const phone = useQueryDevice(1000);
  const inset = $derived(phone.isMobile ? 10 : 50);

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const outside = !(entry.intersectionRatio < 1.0);
        if (outside != (above && entry.boundingClientRect.top < 0)) {
          above = outside;
          update();
        }
      },
      { threshold: [0, 1.0] },
    );

    setTimeout(() => {
      hydrated = true;
    }, 20);

    observer.observe(sensor);
    const resizeObserver = new ResizeObserver(() => {
      update();
    });
    resizeObserver.observe(document.documentElement);
  });

  const update = () => {
    if (!above) {
      if (transitioning) return;
      const r = sensor.getBoundingClientRect();
      style = `${window.innerWidth - r.x - pillSize - inset}px calc(100svh - ${pillSize + inset}px) 0 `;
    } else {
      style = null;
    }
  };
</script>

<div class="relative mt-9 h-14 xl:h-16" bind:this={sensor}>
  <button
    class="z-1 {above
      ? `${actionStyles()} absolute h-14 w-34 xl:h-16 xl:w-42`
      : `${actionStyles({ variant: 'pill', background: 'accent' })} fixed top-0 `}"
    class:duration-1000={hydrated}
    style="translate: {style}; transition-property: width, height, border-radius, translate, background-color, color; will-change: width, height, border-radius, translate, background-color, color"
    onclick={() => modals.open(modals.talk)}
  >
    <div
      class="absolute top-1/2 left-1/2 -translate-1/2 whitespace-nowrap transition-opacity duration-500 {above
        ? 'opacity-100'
        : 'opacity-0'}"
    >
      Let's Talk
    </div>

    <Mailbox
      class="absolute top-1/2 left-1/2 size-11 -translate-1/2 transition-opacity duration-500 {above
        ? 'opacity-0'
        : 'opacity-100'}"
      aria-hidden="true"
    />
  </button>
</div>
