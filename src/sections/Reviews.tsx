import { For, Show, createEffect, createMemo, createSignal, onCleanup } from 'solid-js';
import type { Props as ReviewsProps } from './Reviews.astro';
import { createMediaQuery } from '@solid-primitives/media';

import Stars from '@/components/Stars';
import Feather from '~icons/ph/feather-fill';
import CaretLeft from '~icons/ph/caret-left-bold';
import CaretRight from '~icons/ph/caret-right-bold';

export default function Reviews(props: { meta: ReviewsProps['content'] }) {
	const isMobile = createMediaQuery('(max-width: 650px)');
	const power = createMemo(() => (isMobile() ? 0 : 1));
	const reviewTrimLength = createMemo(() => {
		const lengths = props.meta.map((review) => plainReviewText(review.desc).length).sort((a, b) => b - a);
		return lengths[1] ?? lengths[0] ?? 0;
	});

	const [idx, _setIdx] = createSignal(0);
	const [pos, setPos] = createSignal(0);

	let clientX = 0;
	let clientY = 0;
	let startPos = 0;
	let lastFrame = 0;
	let pointerId: number | null = null;
	let animationId: number | null = null;

	const animate = (t: number) => {
		const dt = t - lastFrame;
		lastFrame = t;
		const diff = idx() - pos();
		if (Math.abs(diff) < 0.001) {
			animationId = null;
			return;
		}

		setPos((p) => p + diff * 0.007777 * dt);
		animationId = requestAnimationFrame(animate);
	};

	const setIdx = (newIdx: number) => {
		const next = Math.max(0, Math.min(newIdx, Math.max(0, (props.meta.length ?? 0) - power() - 1)));
		_setIdx(next);
		if (animationId) cancelAnimationFrame(animationId);
		lastFrame = performance.now();
		animationId = requestAnimationFrame(animate);
	};

	createEffect(() => {
		isMobile;
		setIdx(idx());
	});

	onCleanup(() => {
		if (animationId) cancelAnimationFrame(animationId);
	});

	const onPointerDown = (
		e: PointerEvent & {
			currentTarget: EventTarget & (HTMLButtonElement | HTMLDivElement);
		},
	) => {
		if (e.button !== 0) return;
		pointerId = e.pointerId;
		e.currentTarget.setPointerCapture?.(pointerId);
		if (animationId) cancelAnimationFrame(animationId);
		animationId = null;
		window.getSelection?.()?.removeAllRanges();
		clientX = e.clientX;
		clientY = e.clientY;
		startPos = pos();
	};

	const reviewCount = createMemo(() => Math.max(0, props.meta.length - power()));
	const canGoPrev = createMemo(() => idx() > 0);
	const canGoNext = createMemo(() => idx() < reviewCount() - 1);

	const Thumb = () => {
		return (
			<button
				aria-label="Review scroller"
				class="bg-primary-dark absolute inset-0 cursor-grab rounded-md"
				style={{
					width: `${100 / reviewCount()}%`,
					translate: `${pos() * 100}% 0 0`,
				}}
				tabIndex={-1}
				onPointerDown={onPointerDown}
				onPointerMove={(e) => {
					if (e.pointerId !== pointerId) return;
					const w = e.currentTarget.offsetWidth || 1;
					setPos(startPos + (e.clientX - clientX) / w);
				}}
				onPointerUp={(e) => {
					if (e.pointerId !== pointerId) return;
					if (pointerId != null) {
						e.currentTarget.releasePointerCapture?.(pointerId);
					}

					pointerId = null;
					setIdx(Math.sign(clientX - e.clientX) > 0 ? Math.floor(pos()) : Math.ceil(pos()));
				}}
			/>
		);
	};

	return (
		<>
			<div
				class="relative my-7 cursor-grab touch-pan-y"
				onPointerDown={onPointerDown}
				onPointerMove={(e) => {
					if (e.pointerId !== pointerId) return;
					const w = e.currentTarget.offsetWidth || 1;
					const scale = power() + 1;
					const delta = (e.clientX - clientX) / w;
					setPos(startPos - delta * scale);
				}}
				onPointerUp={(e) => {
					if (e.pointerId !== pointerId) return;
					if (pointerId != null) {
						e.currentTarget.releasePointerCapture?.(pointerId);
					}

					pointerId = null;

					const diffX = clientX - e.clientX;
					const diffY = clientY - e.clientY;

					if (Math.abs(diffX) > 20 && Math.abs(diffX) > Math.abs(diffY)) {
						setIdx(Math.sign(diffX) < 0 ? Math.floor(pos()) : Math.ceil(pos()));
					} else {
						setIdx(idx());
					}
				}}
			>
				<Show when={reviewCount() > 1}>
					<div class="mb-5 flex items-center justify-between gap-4 px-2 sm:px-4">
						<p class="font-sans text-sm font-semibold tracking-wide text-black/55 uppercase">
							Drag or use arrows for more reviews
						</p>
						<div class="flex items-center gap-2">
							<button
								aria-label="Previous reviews"
								class="border-primary-dark bg-primary hover:bg-primary-dark disabled:opacity-35 flex size-11 items-center justify-center rounded-full border transition disabled:cursor-default"
								disabled={!canGoPrev()}
								onPointerDown={(e) => e.stopPropagation()}
								onClick={() => setIdx(idx() - 1)}
							>
								<CaretLeft class="size-5" />
							</button>
							<button
								aria-label="More reviews"
								class="border-secondary bg-secondary flex size-11 items-center justify-center rounded-full border text-white shadow-lg shadow-black/10 transition hover:border-black hover:bg-black"
								disabled={!canGoNext()}
								onPointerDown={(e) => e.stopPropagation()}
								onClick={() => setIdx(idx() + 1)}
							>
								<CaretRight class="size-5" />
							</button>
						</div>
					</div>
				</Show>

				<div
					class="flex will-change-transform"
					style={{
						translate: `${(-pos() * 100) / (power() + 1)}% 0 0`,
					}}
				>
					<For each={props.meta}>{(review) => <Review {...review} trimLength={reviewTrimLength()} />}</For>
				</div>

				<Show when={canGoNext()}>
					<div
						class="pointer-events-none absolute top-20 right-0 bottom-8 z-10 w-24 bg-gradient-to-l from-[rgb(252_245_248)] to-transparent"
						aria-hidden="true"
					/>
				</Show>
				<Show when={canGoNext()}>
					<button
						aria-label="More reviews"
						class="bg-secondary absolute top-1/2 right-2 z-20 flex size-13 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-xl shadow-black/20 transition hover:bg-black sm:right-4"
						onPointerDown={(e) => e.stopPropagation()}
						onClick={() => setIdx(idx() + 1)}
					>
						<CaretRight class="size-6" />
					</button>
				</Show>
				<Show when={canGoPrev()}>
					<button
						aria-label="Previous reviews"
						class="bg-primary border-primary-dark absolute top-1/2 left-2 z-20 flex size-13 -translate-y-1/2 items-center justify-center rounded-full border shadow-xl shadow-black/10 transition hover:bg-white sm:left-4"
						onPointerDown={(e) => e.stopPropagation()}
						onClick={() => setIdx(idx() - 1)}
					>
						<CaretLeft class="size-6" />
					</button>
				</Show>

				<a
					class="bg-primary absolute bottom-0 left-8 z-30 flex translate-y-1/2 cursor-pointer items-center gap-4 rounded-lg px-4 py-3 sm:right-12 sm:left-auto"
					href="/reviews"
					onPointerDown={(e) => {
						e.stopPropagation();
					}}
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					<Feather class="size-8" />
					<span class="font-sans">Write a review</span>
				</a>
			</div>

			<Show when={reviewCount() > 1}>
				<div class="relative m-auto mt-20 flex h-5 w-[60vw] max-w-100 touch-pan-y rounded-md bg-slate-100 contain-paint">
					<Thumb />
					<For
						each={Array.from({ length: reviewCount() })}
						children={(_, i) => (
							<button
								aria-label={`View review ${i()}`}
								class="flex-1 cursor-pointer rounded-sm"
								tabIndex={0}
								onClick={() => setIdx(i())}
							/>
						)}
					/>
				</div>
			</Show>
		</>
	);
}

type ReviewProps = ReviewsProps['content'][number] & {
	trimLength: number;
};

const Review = (review: ReviewProps) => {
	const [expanded, setExpanded] = createSignal(false);
	const plainDesc = createMemo(() => plainReviewText(review.desc));
	const shouldTrim = createMemo(() => review.trimLength > 0 && plainDesc().length > review.trimLength);
	const collapsedDesc = createMemo(() => truncateReviewText(plainDesc(), review.trimLength));

	return (
		<div class="content-box w-full flex-none px-2 sm:w-1/2 sm:px-4">
			<div class="border-primary-dark mb-7 h-full rounded-md border p-7 md:p-10">
				<div class="bg-primary absolute top-0 -translate-y-1/2 rounded-md px-4 py-2">
					<span class="text-base font-semibold text-nowrap">{review.location}</span>
				</div>

				<h3 class="font-serif text-2xl text-balance xl:text-3xl">{review.title}</h3>

				<div class="mt-3 mb-4 flex gap-1.5">
					<span class="sr-only">{review.stars} stars out of 5</span>
					<Stars class="size-6" length={review.stars} />
				</div>

				<Show
					when={shouldTrim() && !expanded()}
					fallback={
						// eslint-disable-next-line solid/no-innerhtml
						<p class="desc-base" innerHTML={review.desc} />
					}
				>
					<p class="desc-base">{collapsedDesc()}</p>
				</Show>

				<Show when={shouldTrim()}>
					<button
						type="button"
						class="text-secondary mt-4 cursor-pointer font-sans text-sm font-semibold transition hover:text-black"
						onPointerDown={(e) => e.stopPropagation()}
						onClick={(e) => {
							e.stopPropagation();
							setExpanded((value) => !value);
						}}
					>
						{expanded() ? 'Show less' : 'Read more'}
					</button>
				</Show>
			</div>
		</div>
	);
};

function plainReviewText(html: string) {
	return html
		.replace(/<[^>]*>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&#x26;|&#38;/g, '&')
		.replace(/&rsquo;|&#8217;/g, "'")
		.replace(/&lsquo;|&#8216;/g, "'")
		.replace(/&rdquo;|&#8221;/g, '"')
		.replace(/&ldquo;|&#8220;/g, '"')
		.replace(/\s+/g, ' ')
		.trim();
}

function truncateReviewText(text: string, maxLength: number) {
	if (text.length <= maxLength) return text;

	const trimmed = text.slice(0, maxLength).trimEnd();
	const lastSpace = trimmed.lastIndexOf(' ');
	const safeText = lastSpace > 120 ? trimmed.slice(0, lastSpace) : trimmed;
	return `${safeText.replace(/[.,;:!?-]+$/, '')}...`;
}
