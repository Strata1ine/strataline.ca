import { For } from 'solid-js';
import type { Props as FaqMeta } from './Faq.astro';
import Accordion from '@corvu/accordion';
import styles from './Faq.module.scss';
import { cn } from '@/frontend/utils';

export default function Faq(props: { content: FaqMeta['content'] }) {
	return (
		<div class="-mt-6">
			<Accordion collapseBehavior="hide">
				<For each={props.content}>
					{(faq, _) => {
						let trigger: HTMLButtonElement | undefined;
						return (
							<div
								class="border-accent cursor-pointer border-t-1 py-8 first:border-t-0"
								onClick={(e) => {
									if (e.target !== e.currentTarget) return;
									trigger?.click();
								}}
							>
								<Accordion.Item>
									<h3 class="font-serif text-3xl md:text-4xl">
										<Accordion.Trigger
											ref={trigger}
											class={cn(
												'flex w-full cursor-pointer touch-manipulation items-center justify-between gap-3',
												styles.trigger,
											)}
										>
											{faq.title}
											<div
												class={cn('relative size-6 flex-none gap-4', styles.expand)}
												aria-hidden="true"
											/>
										</Accordion.Trigger>
									</h3>
									<Accordion.Content class="data-expanded:animate-expand data-collapsed:animate-collapse data-expanded:fade-in-0% data-collapsed:fade-out-0% transition-opacity duration-400 contain-content data-collapsed:opacity-0 data-expanded:opacity-100">
										{/* eslint-disable-next-line solid/no-innerhtml */}
										<div class="prose mt-3 mr-4 max-w-[110ch]" innerHTML={faq.desc} />
									</Accordion.Content>
								</Accordion.Item>
							</div>
						);
					}}
				</For>
			</Accordion>
		</div>
	);
}
