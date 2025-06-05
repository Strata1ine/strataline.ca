<script lang="ts">
  import Field from "./Field.svelte";
  import { field, input } from "./meta";
  import { getId } from "~/lib/stores";
  import Resize from "@icons/Resize.svelte";

  let { required = false, minheight = 80, height = 150, name } = $props();
  let textarea: HTMLTextAreaElement;
  let id = getId();
  let offset = 0;
</script>

<div class="relative">
  <Field class={field({ intent: "text" })} {id} {name} {required}>
    <div class={input()}>
      <textarea
        class="w-full resize-none text-sm focus:outline-none sm:text-base"
        style="height: {height}px"
        bind:this={textarea}
        {id}
        {name}
        {required}
      ></textarea>

      <button
        class="absolute right-0 bottom-0 cursor-ns-resize touch-none"
        onpointerdown={(e) => {
          offset =
            e.clientY -
            e.currentTarget.getBoundingClientRect().top -
            e.currentTarget.getBoundingClientRect().height / 2;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onpointermove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            height = Math.max(
              minheight,
              e.clientY - offset - textarea.getBoundingClientRect().top,
            );
          }
        }}
        onpointerup={(e) => {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }}
      >
        <Resize class="ml-auto h-auto w-11 p-2"></Resize>
      </button>
    </div>
  </Field>
</div>
