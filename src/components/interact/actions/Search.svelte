<script lang="ts">
  const { placeholder, values }: { placeholder: string; values: string[] } =
    $props();

  import { fieldStyles, menuButton, menuStyles } from "@fields/styles";
  import { clickOutside } from "~/frontend/focus";
  import { genUid } from "~/frontend/stores.svelte";
  import MagnifyingGlass from "~/icons/ph/magnifying-glass-bold.svelte";

  let value: string = $state("");
  let open = $derived(value.length > 0);
  let hoverIdx: number = $state(-1);
  let select: HTMLDivElement;

  let uid = genUid();
  let selectUid = genUid();

  const filteredValues = $derived.by(() => {
    if (value.length > 40) {
      return ["We had to end that, you were having too much fun :)"];
    }

    const filtered = values.filter((option) =>
      option.toLowerCase().includes(value.toLowerCase()),
    );

    if (filtered.length === 0 && value.length > 0) {
      return [`No results found for "${value}"`];
    }

    return filtered;
  });

  $effect(() => {
    value;
    hoverIdx = filteredValues.length - 1;
  });

  function close() {
    value = filteredValues[hoverIdx];
    open = false;
    hoverIdx = -1;
  }

  const onkeydown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        hoverIdx = (hoverIdx + 1) % filteredValues.length;
        select.children[hoverIdx]?.scrollIntoView({
          block: "nearest",
        });
        break;
      case "ArrowUp":
        event.preventDefault();
        hoverIdx =
          (hoverIdx - 1 + filteredValues.length) % filteredValues.length;
        select.children[hoverIdx]?.scrollIntoView({
          block: "nearest",
        });
        break;
      case "Enter":
        event.stopPropagation();
        event.preventDefault();
        close();
        break;
      case "Escape":
        if (open) close();
        break;
    }
  };
</script>

<div
  class="relative"
  use:clickOutside={open !== undefined
    ? () => {
        open = false;
      }
    : () => {}}
>
  <div
    class="{menuStyles({ open, top: true, rounded: 'xl' })} overflow-hidden"
    role="listbox"
    tabindex="-1"
    bind:this={select}
    id={selectUid}
    aria-activedescendant="{selectUid}-{hoverIdx}"
    onmouseleave={() => {
      hoverIdx = filteredValues.length - 1;
    }}
    {onkeydown}
  >
    {#each filteredValues as option, i}
      <button
        tabindex="-1"
        role="option"
        id="{selectUid}-{i}"
        aria-selected={hoverIdx == i}
        type="button"
        class={menuButton({
          hover: hoverIdx == i,
        })}
        onmousemove={() => {
          hoverIdx = i;
        }}
        onclick={() => close()}
      >
        {option}
      </button>
    {/each}
  </div>

  <div
    class="flex items-center bg-white contain-paint {fieldStyles({
      rounded: 'xl',
      open,
      top: true,
    })}"
  >
    <label class="mx-6" for={uid}>
      <MagnifyingGlass class="size-10"></MagnifyingGlass>
    </label>

    <input
      type="text"
      role="combobox"
      id={uid}
      class="desc-sm w-full py-5 pr-6 focus:outline-none"
      bind:value
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={selectUid}
      onfocus={(_) => {
        if (value.length > 0) open = true;
      }}
      {placeholder}
      {onkeydown}
    />
  </div>
</div>
