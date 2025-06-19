<script>
  import Icon from "@iconify/svelte";
  import Label from "./Label.svelte";
  import { field, input, expanded } from "./meta";
  import { getUid } from "~/lib/stores";

  let { values, name, required } = $props();
  let selectedIdx = $state(0);
  let hoverIdx = $state(0);
  let open = $state(false);

  let uid = getUid();
  let selectUid = getUid();
  let select;
</script>

<div class="relative">
  <Label
    id={uid}
    onmousedown={(e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      select.focus();
      open = !open;
    }}
    {name}
    {required}
  ></Label>

  <label class={field({ expanded: open })}>
    <input
      tabindex="-1"
      type="hidden"
      value={values[selectedIdx]}
      {name}
      {required}
    />

    <button
      type="button"
      aria-haspopup="listbox"
      aria-labelledby={uid}
      aria-expanded={open}
      aria-controls={selectUid}
      class="{input()} w-full cursor-pointer"
      onmousedown={(e) => {
        e.preventDefault();
      }}
      onclick={() => {
        select.focus();
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
      bind:this={select}
      tabindex="-1"
      id={selectUid}
      aria-activedescendant="{selectUid}-{hoverIdx}"
      aria-hidden={!open}
      onfocusout={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          open = false;
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
            hoverIdx = (hoverIdx - 1 + values.length) % values.length;
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
            for (let i = 0; i < values.length; i++) {
              const idx =
                (((hoverIdx + 1) % values.length) + i) % values.length;
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
          id="{selectUid}-{i}"
          role="option"
          aria-selected={selectedIdx == i}
          tabindex="-1"
          class="block w-full cursor-pointer px-5 py-2{hoverIdx == i ||
          selectedIdx == i
            ? ' bg-tone'
            : ''}"
          onclick={(e) => {
            selectedIdx = i;
            open = false;
            e.preventDefault();
          }}
          onmouseenter={() => {
            hoverIdx = i;
          }}
          onmouseleave={() => {
            hoverIdx = -1;
          }}
        >
          {option}
        </button>
      {/each}
    </div>
  </label>
</div>
