<script lang="ts">
  type SlideshowMeta = {
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
    meta: SlideshowMeta;
  } = $props();
</script>

<div class={className}>
  {#each meta.images as image, i}
    <img
      class={`object-cover ${meta.base} ${idx === i ? meta.active : meta.hidden}`}
      {...image}
      data-index={i}
      widths={[750, 1300, 2160]}
      sizes="60vw"
      width={2160}
      draggable={false}
    />
  {/each}
</div>
