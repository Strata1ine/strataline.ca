import type { JSX } from 'solid-js';
import Star from '~icons/ph/star-fill';
import { cn } from '@/frontend/utils';

export default function Stars(props: { length: number; class?: string; children?: JSX.Element }) {
	return (
		<>
			{Array.from({ length: 5 }, (_, i) => {
				if (i + 0.5 < props.length) {
					return <Star class={cn('text-gold', props.class)} />;
				} else if (i + 0.5 > props.length) {
					return <Star class={cn('text-tone', props.class)} />;
				} else {
					return (
						<div class={cn('relative', props.class)}>
							<Star class="text-gold absolute size-full [clip-path:inset(0_50%_0_0)]" />
							<Star class="text-tone absolute size-full [clip-path:inset(0_0_0_50%)]" />
						</div>
					);
				}
			})}
			{props.children}
		</>
	);
}
