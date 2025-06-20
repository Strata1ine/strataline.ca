<script lang="ts">
  export type AnimMeta = {
    active: string;
    hidden: string;
    base: string;
  };

  const {
    idx = $bindable(0),
    class: className,
    animMeta,
    images,
  }: {
    idx?: number;
    class: string;
    animMeta: AnimMeta;
    images: any[];
  } = $props();
</script>

<div class={className}>
  {#each images as image, i}
    <img
      class="object-cover {animMeta.base} {idx === i
        ? animMeta.active
        : animMeta.hidden}"
      fetchpriority={i == idx ? "high" : "low"}
      {...image}
    />
  {/each}
</div>
