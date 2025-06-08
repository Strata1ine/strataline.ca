<script>
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";

  let { text = [], speed = 0.45 } = $props();

  let self;
  let moveDirection = 1;
  let currentSpeed = speed;
  let isDragging = false;
  let startX = 0;
  let dragOffset = 0;
  let rawOffset = 0;
  let lastXDiff = 0;

  const updateTranslation = () => {
    const halfWidth = self.scrollWidth / 2;
    self.style.transform = `translateX(-${((rawOffset % halfWidth) + halfWidth) % halfWidth}px)`;
  };

  const animate = () => {
    if (
      !isDragging &&
      self.getBoundingClientRect().top <= window.innerHeight &&
      self.getBoundingClientRect().bottom >= 0
    ) {
      rawOffset += moveDirection * currentSpeed;
      updateTranslation();
    }
    requestAnimationFrame(animate);
  };

  onMount(() => {
    animate();
  });

  const handlePointerEnd = (e) => {
    if (isDragging) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      currentSpeed = speed;
      moveDirection = lastXDiff > 0 ? -1 : 1;
      isDragging = false;
      e.preventDefault();
    }
  };
</script>

<div class="border-accent border-y-1">
  <div
    class="py-inset contain-paint"
    onpointerdown={(e) => {
      if (e.button !== 0) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      window.getSelection().removeAllRanges();
      isDragging = true;
      currentSpeed = 0;
      startX = e.pageX;
      dragOffset = rawOffset;
      e.preventDefault();
    }}
    onpointermove={(e) => {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        lastXDiff = e.pageX - startX;
        rawOffset = dragOffset - lastXDiff;
        updateTranslation();
        e.preventDefault();
      }
    }}
    onpointerup={handlePointerEnd}
    onpointercancel={handlePointerEnd}
  >
    <div
      bind:this={self}
      class="flex h-18 items-center gap-12 will-change-transform select-none md:h-20 md:gap-20 lg:gap-25 xl:h-25"
    >
      {#each [...text, ...text] as item}
        <h4
          class="shrink-0 font-serif
        text-2xl sm:text-3xl xl:text-4xl"
        >
          {item}
        </h4>
        <Icon
          icon="ph:star-four-fill"
          class="text-gold h-auto w-7 shrink-0 sm:w-9"
        />
      {/each}
    </div>
  </div>
</div>
