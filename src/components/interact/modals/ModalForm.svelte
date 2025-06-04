<script>
  import Icon from "@iconify/svelte";
  import { modals } from "~/lib/stores";

  let {
    title,
    class: className,
    action = "/submissions/contact",
    children,
  } = $props();
</script>

<div
  class="px-inset relative m-auto w-full max-w-120 rounded-sm bg-white py-12 sm:px-10"
>
  <div class="mb-4 flex items-center">
    <h2 class="font-serif text-3xl font-bold md:text-4xl flex-1">
      {title}
    </h2>
    <button
      class="bg-tone cursor-pointer rounded-[50%] p-2"
      aria-label={`Close dialog`}
      onclick={() => modals.close()}
    >
      <Icon icon="ph:x-bold" class="h-auto w-10 rounded-[50%] lg:w-11" />
    </button>
  </div>

  <form class={className} enctype="multipart/form-data" method="post" {action} netlify>
    {@render children?.()}
  </form>
</div>
