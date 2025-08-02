<script>
  import Caret from "~/icons/ph/caret-down-bold.svelte";
  import NavArrow from "~/icons/ph/navigation-arrow-fill.svelte";
  import { inputStyles, menuStyles } from "./styles";
  import { genUid } from "~/frontend/stores.svelte";
  import Field from "./Field.svelte";

  let { values, name, required } = $props();
  let prevIdx = $state(0);
  let selectedIdx = $state(0);
  let hoverIdx = $state(0);
  let open = $state(false);
  let anim = $state(false);

  let uid = genUid();
  let selectUid = genUid();
  let select;

  const onkeydown = (event) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        hoverIdx = (hoverIdx + 1) % values.length;
        select.children[hoverIdx]?.scrollIntoView({
          block: "nearest",
        });
        break;
      case "ArrowUp":
        event.preventDefault();
        hoverIdx = (hoverIdx - 1 + values.length) % values.length;
        select.children[hoverIdx]?.scrollIntoView({
          block: "nearest",
        });
        break;
      case "Enter":
        if (selectedIdx !== hoverIdx) {
          event.stopPropagation();
          event.preventDefault();
          prevIdx = selectedIdx;
          selectedIdx = hoverIdx;
          anim = !anim;
          open = false;
        }
        break;
      case "Escape":
        if (open) {
          event.stopPropagation();
          event.preventDefault();
          open = false;
        }
        break;
      case "Home":
        event.preventDefault();
        hoverIdx = 0;
        select.children[0]?.scrollIntoView({
          block: "nearest",
        });
        break;
      case "End":
        event.preventDefault();
        hoverIdx = values.length - 1;
        select.children[hoverIdx]?.scrollIntoView({
          block: "nearest",
        });
        break;
      default: {
        if (event.key.length === 0) return;
        const char = event.key.toLowerCase();
        for (let i = 0; i < values.length; i++) {
          const idx = (((hoverIdx + 1) % values.length) + i) % values.length;
          if (values[idx].toLowerCase().startsWith(char)) {
            hoverIdx = idx;
            select.children[idx]?.scrollIntoView({
              block: "nearest",
            });
            break;
          }
        }
      }
    }
  };
</script>

<Field {uid} {name} {required} bind:open>
  <input
    tabindex="-1"
    class="sr-only"
    value={selectedIdx === 0 ? undefined : values[selectedIdx]}
    {name}
    {required}
  />

  <button
    type="button"
    id={uid}
    aria-haspopup="listbox"
    aria-expanded={open}
    aria-controls={selectUid}
    class="{inputStyles()} w-full cursor-pointer"
    tabindex="0"
    onclick={() => {
      open = !open;
    }}
    {onkeydown}
  >
    <NavArrow class="size-8" />
    <div
      class="flex-1 transition-transform duration-200 {anim
        ? ''
        : 'translate-y-full'}"
    >
      <span
        class="desc-sm transition-opacity duration-300{anim
          ? ''
          : ' opacity-0'}">{anim ? values[selectedIdx] : values[prevIdx]}</span
      >
      <span
        class="desc-sm absolute bottom-full left-0 transition-opacity duration-300{anim
          ? ' opacity-0'
          : ''}">{anim ? values[prevIdx] : values[selectedIdx]}</span
      >
    </div>

    <Caret
      class="size-6 transition-transform duration-300{open
        ? ' -rotate-180'
        : ''}"
    />
  </button>

  <div
    class="{menuStyles({ open })} select-none"
    role="listbox"
    bind:this={select}
    id={selectUid}
    aria-activedescendant="{selectUid}-{selectedIdx}"
    tabindex="-1"
    onmouseleave={() => {
      hoverIdx = -1;
    }}
    {onkeydown}
  >
    {#each values as option, i}
      <button
        id="{selectUid}-{i}"
        role="option"
        type="button"
        aria-selected={selectedIdx == i}
        tabindex="-1"
        class="block w-full cursor-pointer px-5 py-2{hoverIdx == i ||
        selectedIdx == i
          ? ' bg-tone'
          : ''}"
        onclick={(_) => {
          if (selectedIdx != i) {
            prevIdx = selectedIdx;
            selectedIdx = i;
            anim = !anim;
          }

          open = false;
        }}
        onmousemove={() => {
          hoverIdx = i;
        }}
      >
        {option}
      </button>
    {/each}
  </div>
</Field>
