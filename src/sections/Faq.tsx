import { For, Show, createSignal } from 'solid-js';
import type { Props as FaqMeta } from './Faq.astro';
import { cn } from '@/frontend/utils';

export default function Faq(props: FaqMeta['content']) {
	const [active, setActive] = createSignal<number | null>(null);

	return (
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
								<div class={cn('expand relative size-6 flex-none gap-4', open() && 'open')} />
							</div>

							<Show when={open()}>
								<div class="prose mt-3 mr-4 max-w-[110ch] font-sans">{faq.desc}</div>
							</Show>
						</button>
					);
				}}
			</For>
		</div>
	);
}
