import { For } from 'solid-js';
import type { JSX } from 'solid-js';
import Star from '~icons/ph/star-fill';

export default function Stars(props: { length: number; class?: string; children?: JSX.Element }) {
	return (
		<>
			<For each={Array(5)}>
				{(_, i) => (
					<>
						{i() + 0.5 < props.length ? (
							<Star class={`text-gold ${props.class ?? ''}`} />
						) : i() + 0.5 > props.length ? (
							<Star class={`text-tone ${props.class ?? ''}`} />
						) : (
							<div class={`relative ${props.class ?? ''}`}>
								<Star class="text-gold absolute [clip-path:inset(0_50%_0_0)]" />
								<Star
									class={`absolute [clip-path:inset(0_0_0_50%)] ${
										i() + 0.5 < props.length ? 'text-gold' : 'text-tone'
									}`}
								/>
							</div>
						)}
					</>
				)}
			</For>

			{props.children}
		</>
	);
}
