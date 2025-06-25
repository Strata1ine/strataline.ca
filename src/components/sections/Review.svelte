<script lang="ts">
  import { Opinion as Meta } from "@/meta";
  import { heading, desc } from "@sections/meta";

  const {
    meta,
  }: {
    meta: Meta[];
  } = $props();

  let idx = $state(0);
</script>

<div class="mt-7 flex cursor-grab select-none">
  {#each meta as review, i}
    <div
      class="border-accent relative mr-10 w-full max-w-155 min-w-0 shrink-0 rounded-sm border p-7 md:p-10"
    >
      <div
        class="bg-accent absolute top-0 -translate-y-1/2 rounded-sm px-5 py-3"
      >
        <span class="{desc({ intent: 'sm' })} font-semibold">
          {review.location}
        </span>
      </div>

      <h3 class={heading({ intent: "2xl" })}>{review.title}</h3>
      <p class="{desc({ intent: 'base' })} mt-4">{review.markdown}</p>
    </div>
  {/each}
</div>

<div class="bg-tone m-auto mt-12 flex h-3 w-100 rounded-sm contain-paint">
  {#each meta as review, i}
    <button
      aria-label="View review {i}"
      class="flex-1 rounded-sm {i == idx
        ? 'bg-accent cursor-grab'
        : 'cursor-pointer'} "
    ></button>
  {/each}
</div>
