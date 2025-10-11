import { For } from "solid-js";
import { dotStyles } from "@/components/actions/styles";
import { setVideoPlaying } from "@/frontend/stores";

type Props = {
  idx: number;
  setIdx: (value: number) => void;
  length: number;
  class?: string;
};

export default function Slidenav(props: Props) {
  return (
    <For each={Array(props.length)}>
      {(_, i) => (
        <button
          onclick={() => {
            setVideoPlaying(false);
            props.setIdx(i());
          }}
          aria-label={`View slide ${i() + 1}`}
          class="cursor-pointer touch-manipulation p-2"
          tabindex="0"
        >
          <div class={dotStyles({ open: props.idx === i() })}></div>
        </button>
      )}
    </For>
  );
}
