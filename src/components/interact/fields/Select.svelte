<script lang="ts">
  import Icon from "@iconify/svelte";
  import Field from "./Field.svelte";
  import { clickOutside } from "@lib/focus";
  import { field, input, expanded } from "./meta";
  import { getId } from "~/lib/stores";

  let { values, name, required } = $props();
  let selectedIdx: number = $state(0);
  let hoverIdx: number = $state(0);
  let value = $state(values[0]);
  let open = $state(false);

  let menu: HTMLElement;

  const onkeydown = (event: KeyboardEvent) => {
    if (!open) return;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        hoverIdx = (hoverIdx + 1) % values.length;
        menu.children[hoverIdx]?.scrollIntoView({ block: "nearest" });
        break;
      case "ArrowUp":
        event.preventDefault();
        hoverIdx = hoverIdx === 0 ? values.length - 1 : hoverIdx - 1;
        menu.children[hoverIdx]?.scrollIntoView({ block: "nearest" });
        break;
      case "Enter":
        event.preventDefault();
        selectedIdx = hoverIdx;
        value = values[selectedIdx];
        open = false;
        break;
      case "Escape":
        open = false;
        break;
      case "Home":
        event.preventDefault();
        hoverIdx = 0;
        menu.children[0]?.scrollIntoView({ block: "nearest" });
        break;
      case "End":
        event.preventDefault();
        hoverIdx = values.length - 1;
        menu.children[hoverIdx]?.scrollIntoView({ block: "nearest" });
        break;
      default: {
        if (event.key.length === 1) {
          const char = event.key.toLowerCase();
          const startIdx = (hoverIdx + 1) % values.length;
          for (let i = 0; i < values.length; i++) {
            const idx = (startIdx + i) % values.length;
            if (values[idx].toLowerCase().startsWith(char)) {
              hoverIdx = idx;
              menu.children[idx]?.scrollIntoView({ block: "nearest" });
              break;
            }
          }
        }
      }
    }
  };

  let id = getId();
  let select = getId();
</script>

<div class="relative" use:clickOutside={() => (open = false)} {onkeydown}>
  <Field
    class={field({ intent: "pointer", expanded: open })}
    {id}
    {name}
    {required}
  >
    <input tabindex="-1" type="hidden" {name} {required} bind:value />

    <button
      type="button"
      class={input({ intent: "overlay" })}
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={select}
      onclick={(_) => {
        open = !open;
      }}
      {id}
    >
      <Icon icon="ph:navigation-arrow-fill" class="h-auto w-8" />
      <span class="mr-auto font-sans text-sm sm:text-base"
        >{values[selectedIdx]}</span
      >

      <Icon icon="ph:caret-down-bold" class="h-auto w-6" />
    </button>

    <div
      class={expanded({ open })}
      bind:this={menu}
      role="listbox"
      tabindex="-1"
      id={select}
      aria-activedescendant={`${select}-${hoverIdx}`}
      inert={!open}
    >
      {#each values as option, i}
        <div
          id={`${select}-${i}`}
          role="option"
          aria-selected={selectedIdx == i}
          tabindex="-1"
          class="block w-full cursor-pointer px-5 py-2 select-none {hoverIdx ==
            i || selectedIdx == i
            ? 'bg-tone'
            : ''}"
          onmousedown={(e) => {
            if (e.button == 0) {
              value = option;
              open = false;
              selectedIdx = i;
            }
          }}
          onmouseenter={() => {
            hoverIdx = i;
          }}
        >
          {option}
        </div>
      {/each}
    </div>
  </Field>
</div>
