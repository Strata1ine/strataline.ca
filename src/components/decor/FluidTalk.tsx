import { createSignal, onMount, createEffect, Show } from "solid-js";
import { modals } from "@/frontend/stores";
import { useQueryDevice } from "@/frontend/mobile";
import Mailbox from "@/icons/ph/mailbox-fill";
import { actionStyles, pillSize } from "@/components/actions/styles";

export default function FluidTalk() {
  let sensor: HTMLElement | undefined;
  const [above, setAbove] = createSignal(true);
  const [style, setStyle] = createSignal<null | string>(null);
  const [hydrated, setHydrated] = createSignal(false);
  let transitioning = false;
  
  const phone = useQueryDevice(1000);
  const inset = () => phone.isMobile() ? 10 : 50;

  const update = () => {
    if (!above()) {
      if (transitioning) return;
      if (!sensor) return;
      const r = sensor.getBoundingClientRect();
      setStyle(`${window.innerWidth - r.x - pillSize - inset()}px calc(100svh - ${pillSize + inset()}px) 0 `);
    } else {
      setStyle(null);
    }
  };

  onMount(() => {
    if (!sensor) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const outside = !(entry.intersectionRatio < 1.0);
        if (outside != (above() && entry.boundingClientRect.top < 0)) {
          setAbove(outside);
          update();
        }
      },
      { threshold: [0, 1.0] },
    );
    
    setTimeout(() => {
      setHydrated(true);
    }, 20);
    
    observer.observe(sensor);
    
    const resizeObserver = new ResizeObserver(() => {
      update();
    });
    
    resizeObserver.observe(document.documentElement);
  });

  return (
    <div class="relative mt-9 h-14 xl:h-16" ref={sensor}>
      <button
        aria-label="Let's talk (Ctrl+/)"
        class={`z-1 ${
          above()
            ? `${actionStyles()} absolute h-14 w-34 xl:h-16 xl:w-42`
            : `${actionStyles({ variant: 'pill', background: 'accent' })} fixed top-0 `
        } ${hydrated() ? 'duration-1000' : ''}`}
        style={`translate: ${style()}; transition-property: width, height, border-radius, translate, background-color, color; will-change: width, height, border-radius, translate, background-color, color`}
        onclick={() => modals.open(modals.talk)}
      >
        <div
          aria-hidden="true"
          class={`absolute top-1/2 left-1/2 -translate-1/2 whitespace-nowrap transition-opacity duration-500 ${
            above() ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Let's Talk
        </div>
        <Mailbox
          class={`absolute top-1/2 left-1/2 size-11 -translate-1/2 transition-opacity duration-500 ${
            above() ? 'opacity-0' : 'opacity-100'
          }`}
        />
      </button>
    </div>
  );
}
