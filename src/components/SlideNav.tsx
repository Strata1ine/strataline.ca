import { For } from 'solid-js';
import { setVideoPlaying } from '@/frontend/stores';
import { cva } from 'class-variance-authority';

type Props = {
	idx: number;
	setIdx: (value: number) => void;
	length: number;
	class?: string;
};

export const navStyles = cva(
	'size-8 xl:size-9 rounded-[50%] border-solid border-black transition-[border] duration-250',
	{
		variants: {
			open: {
				true: 'border-4',
				false: 'border',
			},
		},
		defaultVariants: {
			open: false,
		},
	},
);

export default function Slidenav(props: Props) {
	return (
		<For each={Array(props.length)}>
			{(_, i) => (
				<button
					onClick={() => {
						setVideoPlaying(false);
						props.setIdx(i());
					}}
					aria-label={`View slide ${i() + 1}`}
					class="cursor-pointer touch-manipulation p-2"
					tabindex="0"
				>
					<div class={navStyles({ open: props.idx === i() })} />
				</button>
			)}
		</For>
	);
}
