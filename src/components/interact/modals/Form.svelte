<script>
  import X from "~/icons/ph/x-bold.svelte";
  import { modals } from "~/lib/stores";

  let {
    title,
    id,
    class: className,
    action = "/submissions/contact",
    children,
  } = $props();
</script>

<div
  class="px-inset relative mx-auto w-full max-w-120 rounded-sm bg-white py-12 sm:my-10 sm:px-10"
>
  <div class="gap-inset flex items-center">
    <h2 class="flex-1 font-serif text-3xl font-bold md:text-4xl" {id}>
      {title}
    </h2>

    <button
      class="bg-tone cursor-pointer rounded-[50%] p-2"
      aria-label={`Close dialog`}
      onclick={() => modals.close()}
      tabindex="0"
    >
      <X class="size-10 rounded-[50%] lg:w-11" />
    </button>
  </div>

  <form
    class={className}
    enctype="multipart/form-data"
    method="post"
    {action}
    netlify
  >
    {@render children?.()}
  </form>
</div>
