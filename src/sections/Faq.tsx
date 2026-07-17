import { For, Show, createSignal, onMount } from 'solid-js';
import type { Props as FaqMeta } from './Faq.astro';
import Accordion from '@corvu/accordion';
import styles from './Faq.module.scss';
import { cn } from '@/frontend/utils';

export default function Faq(props: {
	content: FaqMeta['content'];
	showMoreLabel?: FaqMeta['showMoreLabel'];
}) {
	const [revealStage, setRevealStage] = createSignal(0);
	const [jsEnabled, setJsEnabled] = createSignal(false);
	const initialCount = 6;
	const revealBatchSize = 8;
	const hiddenCount = () => Math.max(0, props.content.length - initialCount);
	const visibleCount = () =>
		jsEnabled()
			? Math.min(
					props.content.length,
					initialCount + revealStage() * revealBatchSize,
				)
			: props.content.length;
	const visibleItems = () => props.content.slice(0, visibleCount());
	const hiddenItems = () => props.content.slice(visibleCount());
	const showMoreLabel = () => props.showMoreLabel ?? 'View more questions';

	onMount(() => {
		setJsEnabled(true);
	});

	const renderItem = (faq: FaqMeta['content'][number]) => {
		let trigger: HTMLButtonElement | undefined;
		return (
			<div
				class="border-primary-dark cursor-pointer border-t py-8 first:border-t-0"
				onClick={(e) => {
					if (e.target === e.currentTarget) trigger?.click();
				}}
			>
				<Accordion.Item>
					<h3 class="font-serif text-3xl md:text-4xl">
						<Accordion.Trigger
							ref={trigger}
							class={cn(
								'flex w-full cursor-pointer touch-manipulation items-center justify-between gap-6',
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
	};

	return (
		<div class="-mt-6">
			<Accordion collapseBehavior="hide">
				<For each={visibleItems()}>{(faq) => renderItem(faq)}</For>
				<div classList={{ hidden: jsEnabled() && hiddenItems().length > 0 }}>
					<For each={hiddenItems()}>{(faq) => renderItem(faq)}</For>
				</div>
			</Accordion>
			<Show when={jsEnabled() && hiddenItems().length > 0}>
				<div class="mt-8 flex justify-center">
					<button
						type="button"
						class="bg-primary-dark border-primary-dark text-background hover:bg-primary-dark/90 focus-visible:ring-primary-dark rounded-[8px] border px-8 py-3 font-sans text-xl font-semibold leading-none transition-colors focus-visible:outline-none focus-visible:ring-2"
						onClick={() =>
							setRevealStage((stage) =>
								Math.min(Math.ceil(hiddenCount() / revealBatchSize), stage + 1),
							)
						}
					>
						{showMoreLabel()}
					</button>
				</div>
			</Show>
		</div>
	);
}
