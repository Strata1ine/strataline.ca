<script lang="ts">
  const { url }: { url: string } = $props();
</script>

<iframe
  loading="lazy"
  src="{url}?enablejsapi=1"
  title="YouTube video player"
  class="absolute h-full w-full select-none"
  frameborder="0"
  allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen
></iframe>
