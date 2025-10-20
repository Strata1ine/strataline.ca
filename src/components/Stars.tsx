import type { JSX } from 'solid-js';
import Star from '~icons/ph/star-fill';

export default function Stars(props: { length: number; class?: string; children?: JSX.Element }) {
	return (
		<>
			{Array.from({ length: 5 }, (_, i) => (
				<div class={props.class}>
					{i + 0.5 < props.length ? (
						<Star class="text-gold size-full" />
					) : i + 0.5 > props.length ? (
						<Star class="text-slate-100 size-full" />
					) : (
						<div class="relative size-full">
							<Star class="text-gold absolute size-full [clip-path:inset(0_50%_0_0)]" />
							<Star class="text-slate-100 absolute size-full [clip-path:inset(0_0_0_50%)]" />
						</div>
					)}
				</div>
			))}
			{props.children}
		</>
	);
}
