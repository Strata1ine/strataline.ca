<script lang="ts">
  import { onMount } from "svelte";
  import Icon from "@iconify/svelte";

  export let text = [
    "Made with love",
    "No scrape of dust left",
    "Absolutely revelatory",
    "Expert opinions",
  ];

  export let speed = 0.45;

  let carousel: HTMLElement;
  let autoDirection = 1;
  let currentSpeed = speed;
  let isDragging = false;
  let startX = 0;
  let dragOffset = 0;
  let rawOffset = 0;
  let lastXDiff = 0;

  const updateTranslation = () => {
    const halfWidth = carousel.scrollWidth / 2;
    carousel.style.transform = `translateX(-${((rawOffset % halfWidth) + halfWidth) % halfWidth}px)`;
  };

  const animate = () => {
    if (
      !isDragging &&
      carousel.getBoundingClientRect().top <= window.innerHeight &&
      carousel.getBoundingClientRect().bottom >= 0
    ) {
      rawOffset += autoDirection * currentSpeed;
      updateTranslation();
    }
    requestAnimationFrame(animate);
  };

  onMount(() => {
    animate();
    const pointerMove = (e: PointerEvent) => {
      if (isDragging) {
        lastXDiff = e.pageX - startX;
        rawOffset = dragOffset - lastXDiff;
        updateTranslation();
      }
    };
    const pointerUp = (_: PointerEvent) => {
      if (isDragging) {
        isDragging = false;
        currentSpeed = speed;
        autoDirection = lastXDiff > 0 ? -1 : 1;
      }
    };

    window.addEventListener("pointermove", pointerMove);
    window.addEventListener("pointerup", pointerUp);

    return () => {
      window.removeEventListener("pointermove", pointerMove);
      window.removeEventListener("pointerup", pointerUp);
    };
  });
</script>

<div class="border-accent border-y-1">
  <div
    class="py-inset contain-paint"
    on:pointerdown={(e) => {
      isDragging = true;
      currentSpeed = 0;
      startX = e.pageX;
      dragOffset = rawOffset;
    }}
    on:pointercancel={() => {
      isDragging = false;
      currentSpeed = speed;
    }}
  >
    <div
      bind:this={carousel}
      class="flex h-18 transform-gpu touch-pan-y items-center gap-12 will-change-transform select-none md:h-20 md:gap-20 lg:gap-25 xl:h-25"
    >
      {#each [...text, ...text] as item}
        <h4 class="flex-shrink-0 font-serif text-4xl">{item}</h4>
        <Icon
          icon="ph:star-four-fill"
          class="text-gold h-auto w-8 flex-shrink-0"
        />
      {/each}
    </div>
  </div>
</div>
