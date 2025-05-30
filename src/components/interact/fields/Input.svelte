<script module>
  let counter = 0;

  export function id() {
    return `dialog_${counter++}`;
  }
</script>

<script>
  import { onMount } from "svelte";
  import { cva } from "class-variance-authority";
  import Icon from "@iconify/svelte";

  let input = $state(null);
  let valid = $state(false);

  export const style = cva("focus:outline-none", {
    variants: {
      intent: {
        fill: "w-full font-sans text-sm sm:text-base",
        hidden:
          "absolute inset-0 cursor-pointer appearance-none text-transparent select-none",
      },
    },
    defaultVariants: {
      intent: "fill",
    },
  });

  let {
    name,
    variant = {},
    class: customClass = "",
    // input type
    as = "input",
    // label as required
    required = false,
    // automagically validate input and have a visual
    validate = false,
    // fetch oninput to override it with automagic validator check
    oninput,
    children,
    overlay,
    icons,
    ...rest
  } = $props();

  onMount(() => {
    valid = input ? input.checkValidity() : false;
  });

  const inputOverride = (e) => {
    if (oninput) {
      oninput(e);
    }

    valid = input.checkValidity();
  };

  const uid = id();
</script>

<div class="relative my-10">
  <label
    class="absolute left-2 z-1 flex -translate-y-1/2 items-center gap-2 rounded-sm bg-white px-3"
    for={uid}
  >
    <span class="text-bg font-serif leading-none font-semibold">
      {name}
    </span>

    {#if required}
      <Icon icon="ph:asterisk-bold" class="text-error w-3"></Icon>
    {/if}
  </label>

  <label
    class="border-accent flex rounded-sm border-1 px-5 py-5 focus-within:border-black"
    for={uid}
  >
    {#if children}
      <svelte:element
        this={as}
        id={uid}
        class="{style(variant)} {customClass}"
        bind:this={input}
        oninput={inputOverride}
        {required}
        {...rest}
      >
        {@render children()}
      </svelte:element>
    {:else}
      <svelte:element
        this={as}
        id={uid}
        class="{style(variant)} {customClass}"
        bind:this={input}
        oninput={inputOverride}
        {required}
        {...rest}
      />
    {/if}

    {#if overlay}
      <div class="gap-inset pointer-events-none flex flex-1 items-center">
        {@render overlay()}
      </div>
    {/if}

    {#if icons || validate}
      <div class="flex items-center gap-2 pl-2">
        {@render icons?.()}

        {#if validate}
          <div class="relative h-auto w-6">
            <Icon
              icon="ph:check-bold"
              class="text-success absolute size-full duration-250 {!valid
                ? '-translate-y-full opacity-0'
                : ''}"
            />

            <Icon
              icon="ph:x-bold"
              class="text-error size-full duration-250 {valid
                ? '-translate-y-full opacity-0'
                : ''}"
            />
          </div>
        {/if}
      </div>
    {/if}
  </label>
</div>
