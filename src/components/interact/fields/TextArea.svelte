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
  <Field class={field()} {id} {name} {required}>
    <div class={input()}>
      <textarea
        class="w-full resize-none text-sm focus:outline-none sm:text-base"
        style="height: {height}px"
        bind:this={textarea}
        onkeydown={(e) => {
          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            height = Math.max(
              minheight,
              height + (e.key === "ArrowDown" ? 20 : -20),
            );
          }
        }}
        {id}
        {name}
        {required}
      ></textarea>

      <div
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
        <Resize class="p-inset ml-auto h-auto w-12" />
      </div>
    </div>
  </Field>
</div>
