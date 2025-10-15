import { For } from 'solid-js';
import type { Props as FaqMeta } from './Faq.astro';
import Accordion from '@corvu/accordion';
import styles from './Faq.module.scss';
import { cn } from '@/frontend/utils';

export default function Faq(props: { content: FaqMeta['content'] }) {
	return (
		<div class="-mt-6">
			<Accordion collapseBehavior="hide">
				<For
					each={props.content}
					children={(faq, _) => (
						<div class="border-accent border-t-1 py-8 first:border-t-0">
							<Accordion.Item>
								<h3 class="font-serif text-3xl md:text-4xl">
									<Accordion.Trigger
										class={cn(
											'gap-inset flex w-full cursor-pointer touch-manipulation items-center justify-between',
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
					)}
				/>
			</Accordion>
		</div>
	);
}
