import { For, Show, createSignal } from "solid-js";
import type { Props as FaqMeta } from "./Faq.astro";

export default function Faq(props: FaqMeta["content"]) {
  const [active, setActive] = createSignal<number | null>(null);

  return (
    <>
      <style>
        {`
          .expand::before {
            content: "";
            position: absolute;
            top: 0;
            left: calc(50% - 1px);
            bottom: 0;
            width: 2px;
            background-color: var(--color-black);
            transform-origin: center;
            transition: transform 250ms;
          }
          .expand::after {
            content: "";
            position: absolute;
            left: 0;
            top: calc(50% - 1px);
            right: 0;
            height: 2px;
            background-color: var(--color-black);
            transform-origin: center;
          }
          .expand.open::before {
            transform: rotateZ(90deg);
          }
        `}
      </style>

      <div class="-mt-6">
        <For each={props}>
          {(faq, i) => {
            const open = () => i() === active();
            return (
              <button
                class="border-accent w-full cursor-pointer touch-manipulation border-t-1 py-8 first:border-t-0"
                onClick={() => {
                  setActive(open() ? null : i());
                }}
              >
                <div class="gap-inset flex items-center justify-between">
                  <h3 class="heading-3xl">{faq.title}</h3>
                  <div
                    class={`expand relative size-6 gap-4 flex-none${
                      open() ? " open" : ""
                    }`}
                  />
                </div>

                <Show when={open()}>
                  <div
                    class="prose mt-3 mr-4 max-w-[110ch] font-sans"
                    innerHTML={faq.desc}
                  />
                </Show>
              </button>
            );
          }}
        </For>
      </div>
    </>
  );
}
