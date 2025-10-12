import { For, Show, createEffect, createMemo, createSignal, onCleanup } from 'solid-js';
import Stars from '@/components/Stars';
import Feather from '~icons/ph/feather-fill';
import type { Props as ReviewsProps } from './Reviews.astro';
import { modals } from '@/frontend/stores';
import { useQueryDevice } from '@/frontend/mobile';

export default function Reviews(props: ReviewsProps['content']) {
	const phone = useQueryDevice();
	const power = createMemo(() => (phone.isMobile ? 0 : 1));

	const [idx, setIdxSignal] = createSignal(0);
	const [pos, setPos] = createSignal(0);

	let clientX = 0;
	let clientY = 0;
	let startPos = 0;
	let lastFrame = 0;
	let pointerId: number | null = null;
	let animationId: number | null = null;

	const maxIdx = () => Math.max(0, (props.length ?? 0) - power() - 1);

	const clampIdx = (newIdx: number) => Math.max(0, Math.min(newIdx, maxIdx()));

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
		const next = clampIdx(newIdx);
		setIdxSignal(next);
		if (animationId) cancelAnimationFrame(animationId);
		lastFrame = performance.now();
		animationId = requestAnimationFrame(animate);
	};

	createEffect(() => {
		phone.isMobile;
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
		(e.currentTarget as HTMLElement).setPointerCapture?.(pointerId);
		if (animationId) cancelAnimationFrame(animationId);
		animationId = null;
		window.getSelection?.()?.removeAllRanges();
		clientX = e.clientX;
		clientY = e.clientY;
		startPos = pos();
	};

	const onPointerMove = (e: PointerEvent & { currentTarget: EventTarget & HTMLDivElement }) => {
		if (e.pointerId !== pointerId) return;
		const w = (e.currentTarget as HTMLElement).offsetWidth || 1;
		const scale = power() + 1;
		const delta = (e.clientX - clientX) / w;
		setPos(startPos - delta * scale);
	};

	const onPointerUp = (e: PointerEvent & { currentTarget: EventTarget & HTMLDivElement }) => {
		if (e.pointerId !== pointerId) return;
		if (pointerId != null) {
			(e.currentTarget as HTMLElement).releasePointerCapture?.(pointerId);
		}
		pointerId = null;

		const diffX = clientX - e.clientX;
		const diffY = clientY - e.clientY;

		if (Math.abs(diffX) > 20 && Math.abs(diffX) > Math.abs(diffY)) {
			setIdx(Math.sign(diffX) < 0 ? Math.floor(pos()) : Math.ceil(pos()));
		} else {
			setIdx(idx());
		}
	};

	const onPointerMoveThumb = (
		e: PointerEvent & { currentTarget: EventTarget & HTMLButtonElement },
	) => {
		if (e.pointerId !== pointerId) return;
		const w = (e.currentTarget as HTMLElement).offsetWidth || 1;
		setPos(startPos + (e.clientX - clientX) / w);
	};

	const onPointerUpThumb = (
		e: PointerEvent & { currentTarget: EventTarget & HTMLButtonElement },
	) => {
		if (e.pointerId !== pointerId) return;
		if (pointerId != null) {
			(e.currentTarget as HTMLElement).releasePointerCapture?.(pointerId);
		}
		pointerId = null;

		setIdx(Math.sign(clientX - e.clientX) > 0 ? Math.floor(pos()) : Math.ceil(pos()));
	};

	const pagesCount = createMemo(() => Math.max(0, (props.length ?? 0) - power()));

	return (
		<div class="relative my-7 cursor-grab touch-pan-y">
			<div
				class="relative my-7 cursor-grab touch-pan-y"
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
			>
				<div
					class="flex will-change-transform"
					style={{
						translate: `${(-pos() * 100) / (power() + 1)}% 0 0`,
					}}
				>
					<For each={props}>
						{(review) => (
							<div class="content-box w-full flex-none px-2 sm:w-1/2 sm:px-4">
								<div class="border-accent mb-7 h-full rounded-md border p-7 md:p-10">
									<div class="bg-accent absolute top-0 -translate-y-1/2 rounded-md px-4 py-2">
										<span class="desc-sm font-semibold">{review.location}</span>
									</div>

									<h3 class="heading-2xl">{review.title}</h3>

									<div class="mt-3 mb-4 flex gap-1.5">
										<span class="sr-only">{review.stars} stars out of 5</span>
										<Stars class="size-6" length={review.stars} />
									</div>

									<p class="desc-base">{review.desc}</p>
								</div>
							</div>
						)}
					</For>
				</div>

				<button
					class="bg-accent gap-inset absolute bottom-0 left-8 flex translate-y-1/2 cursor-pointer items-center rounded-lg px-4 py-3 sm:right-12 sm:left-auto"
					onClick={() => modals.open(modals.review)}
					onPointerDown={(e) => e.stopPropagation()}
				>
					<Feather class="size-8" />
					<span class="desc-sm font-serif">Write a review</span>
				</button>
			</div>

			<Show when={pagesCount() > 1}>
				<div class="bg-tone relative m-auto mt-20 flex h-4 w-[60vw] max-w-100 touch-pan-y rounded-md contain-paint">
					<button
						aria-label="Review scroller"
						class="bg-accent absolute inset-0 cursor-grab rounded-md"
						style={{
							width: `${100 / pagesCount()}%`,
							translate: `${pos() * 100}% 0 0`,
						}}
						tabIndex={-1}
						onPointerDown={onPointerDown}
						onPointerMove={onPointerMoveThumb}
						onPointerUp={onPointerUpThumb}
					/>
					<For each={Array.from({ length: pagesCount() })}>
						{(_, i) => (
							<button
								aria-label={`View review ${i()}`}
								class="flex-1 cursor-pointer rounded-sm"
								tabIndex={0}
								onClick={() => setIdx(i())}
							/>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
}
