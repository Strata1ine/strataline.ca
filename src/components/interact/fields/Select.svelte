<script>
  import Icon from "@iconify/svelte";
  import Field from "./Field.svelte";
  import { field, input, expanded } from "./meta";
  import { getId } from "~/lib/stores";
  import { preventDefault } from "svelte/legacy";

  let { values, name, required } = $props();
  let selectedIdx = $state(0);
  let hoverIdx = $state(0);
  let open = $state(false);

  let id = getId();
  let select = getId();
</script>

<div class="relative">
  <Field class={field({ expanded: open })} {id} {name} {required}>
    <input
      tabindex="-1"
      type="hidden"
      {name}
      {required}
      value={values[selectedIdx]}
    />

    <button
      {id}
      type="button"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={select}
      class="{input()} w-full cursor-pointer"
      onmousedown={(e) => {
        e.preventDefault();
        e.currentTarget.nextElementSibling.focus();
      }}
      onclick={(e) => {
        open = !open;
      }}
    >
      <Icon icon="ph:navigation-arrow-fill" class="size-8" />
      <div class="flex-1">
        <span class="font-sans text-sm sm:text-base">{values[selectedIdx]}</span
        >
      </div>

      <Icon icon="ph:caret-down-bold" class="size-6" />
    </button>

    <div
      class="{expanded({ open })} select-none"
      role="listbox"
      tabindex="-1"
      id={select}
      aria-activedescendant="{select}-{hoverIdx}"
      aria-hidden={!open}
      onfocusout={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          open = false;
          e.currentTarget.previousElementSibling.focus();
        }
      }}
      onkeydown={(event) => {
        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            hoverIdx = (hoverIdx + 1) % values.length;
            event.currentTarget.children[hoverIdx]?.scrollIntoView({
              block: "nearest",
            });
            break;
          case "ArrowUp":
            event.preventDefault();
            hoverIdx = hoverIdx === 0 ? values.length - 1 : hoverIdx - 1;
            event.currentTarget.children[hoverIdx]?.scrollIntoView({
              block: "nearest",
            });
            break;
          case "Enter":
            selectedIdx = hoverIdx;
            open = !open;
            break;
          case "Escape":
            event.stopPropagation();
            open = false;
            break;
          case "Home":
            event.preventDefault();
            hoverIdx = 0;
            event.currentTarget.children[0]?.scrollIntoView({
              block: "nearest",
            });
            break;
          case "End":
            event.preventDefault();
            hoverIdx = values.length - 1;
            event.currentTarget.children[hoverIdx]?.scrollIntoView({
              block: "nearest",
            });
            break;
          default: {
            if (event.key.length === 0) return;
            const char = event.key.toLowerCase();
            const startIdx = (hoverIdx + 1) % values.length;
            for (let i = 0; i < values.length; i++) {
              const idx = (startIdx + i) % values.length;
              if (values[idx].toLowerCase().startsWith(char)) {
                hoverIdx = idx;
                event.currentTarget.children[idx]?.scrollIntoView({
                  block: "nearest",
                });
                break;
              }
            }
          }
        }
      }}
    >
      {#each values as option, i}
        <button
          id="{select}-{i}"
          role="option"
          aria-selected={selectedIdx == i}
          tabindex="-1"
          class="block w-full cursor-pointer px-5 py-2 {hoverIdx == i ||
          selectedIdx == i
            ? 'bg-tone'
            : ''}"
          onclick={(e) => {
            selectedIdx = i;
            open = false;
            e.preventDefault();
          }}
          onmouseenter={() => {
            hoverIdx = i;
          }}
        >
          {option}
        </button>
      {/each}
    </div>
  </Field>
</div>
