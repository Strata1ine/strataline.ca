<script lang="ts">
  import { inputStyles } from "./styles";
  import { genUid } from "~/frontend/stores";
  import Field from "./Field.svelte";

  let { required = false, minheight = 80, height = 150, name } = $props();
  let textarea: HTMLTextAreaElement;
  let uid = genUid();
  let offset = 0;
</script>

<Field {uid} {name} {required}>
  <div class={inputStyles()}>
    <textarea
      class="desc-sm w-full resize-none focus:outline-none"
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
      id={uid}
      {name}
      {required}
    ></textarea>

    <div
      class="absolute right-0 bottom-0 cursor-ns-resize"
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
      <svg
        class="p-inset size-12"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m21 15-6 6m6-13L8 21"
        />
      </svg>
    </div>
  </div>
</Field>
