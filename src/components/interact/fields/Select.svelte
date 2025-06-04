<script lang="ts">
  import Icon from "@iconify/svelte";
  import Field from "./Field.svelte";
  import { clickOutside } from "@lib/focus";
  import { field, input, expanded } from "./meta";

  let { values, name, required } = $props();
  let selectedIdx: number = $state(0);
  let hoverIdx: number = $state(0);
  let value = $state(values[0]);
  let open = $state(false);

  let menu: HTMLElement;

  const onkeydown = (event: KeyboardEvent) => {
    if (!open) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      hoverIdx = (hoverIdx + 1) % values.length;
      menu.children[hoverIdx]?.scrollIntoView({ block: "nearest" });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      hoverIdx = hoverIdx === 0 ? values.length - 1 : hoverIdx - 1;
      menu.children[hoverIdx]?.scrollIntoView({ block: "nearest" });
    } else if (event.key === "Enter") {
      event.preventDefault();
      selectedIdx = hoverIdx;
      value = values[selectedIdx];
      open = false;
    } else if (event.key == "Escape") {
      open = false;
    }
  };

  let uid = crypto.randomUUID();
</script>

<div class="relative" use:clickOutside={() => (open = false)} {onkeydown}>
  <Field
    class={field({ intent: "pointer", expanded: open })}
    {uid}
    {name}
    {required}
  >
    <input tabindex="-1" type="hidden" {name} {required} bind:value />

    <button
      type="button"
      class={input({ intent: "overlay" })}
      aria-haspopup="listbox"
      aria-expanded={open}
      id={uid}
      aria-controls={`${uid}-select`}
      onclick={(_) => {
        open = !open;
      }}
    >
      <Icon icon="ph:navigation-arrow-fill" class="h-auto w-8" />
      <span class="mr-auto font-sans text-sm sm:text-base"
        >{values[selectedIdx]}</span
      >

      <Icon icon="ph:caret-down-fill" class="h-auto w-5" />
    </button>

    <div
      class={expanded({ open })}
      bind:this={menu}
      role="listbox"
      tabindex="-1"
      id={`${uid}-select`}
      aria-activedescendant={`${uid}-option-${hoverIdx}`}
      inert={!open}
    >
      {#each values as option, i}
        <div
          id={`${uid}-option-${i}`}
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
