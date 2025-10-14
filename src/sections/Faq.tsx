import { For } from 'solid-js';
import type { Props as FaqMeta } from './Faq.astro';
import Accordion from '@corvu/accordion';
import styles from './Faq.module.css';
import { cn } from '@/frontend/utils';

export default function Faq(props: { content: FaqMeta['content'] }) {
	return (
		<div class="-mt-6">
			<Accordion collapseBehavior="hide">
				<For each={props.content}>
					{(faq) => {
						return (
							<div class={cn('border-accent border-t-1 py-8 first:border-t-0', styles.trigger)}>
								<Accordion.Item>
									<h3 class="heading-3xl">
										<Accordion.Trigger class="gap-inset flex w-full cursor-pointer touch-manipulation items-center justify-between">
											{faq.title}
											<div
												class={cn('relative size-6 flex-none gap-4', styles.expand)}
												aria-hidden="true"
											/>
										</Accordion.Trigger>
									</h3>

									<Accordion.Content class={cn('contain-paint', styles.content)}>
										{/* eslint-disable-next-line solid/no-innerhtml */}
										<div class="prose my-3 mr-4 max-w-[110ch] font-sans" innerHTML={faq.desc} />
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
