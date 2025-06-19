<script lang="ts">
  type ImageSlideshowMeta = {
    active: string;
    hidden: string;
    base: string;
    images: any[];
  };

  const {
    idx = $bindable(0),
    class: className,
    meta,
  }: {
    idx?: number;
    class: string;
    meta: ImageSlideshowMeta;
  } = $props();
</script>

<div class={className}>
  {#each meta.images as image, i}
    <img
      class="object-cover {meta.base} {idx === i ? meta.active : meta.hidden}"
      fetchpriority={i == idx ? "high" : "low"}
      {...image}
    />
  {/each}
</div>
