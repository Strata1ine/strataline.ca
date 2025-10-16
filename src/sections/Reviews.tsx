import { For, Show, createEffect, createMemo, createSignal, onCleanup } from 'solid-js';
import type { Props as ReviewsProps } from './Reviews.astro';
import { useQueryDevice } from '@/frontend/mobile';
import createPersistent from 'solid-persistent';

import business from '#/business.json';
import Inputs from '@/components/Inputs';
import Menus from '@/components/Menus';
import Stars from '@/components/Stars';
import Feather from '~icons/ph/feather-fill';
import Actions from '@/components/Actions';
import Dialog from 'corvu/dialog';

export default function Reviews(props: { meta: ReviewsProps['content'] }) {
	const phone = useQueryDevice();
	const power = createMemo(() => (phone.isMobile() ? 0 : 1));

	const [idx, setIdxSignal] = createSignal(0);
	const [pos, setPos] = createSignal(0);

	let clientX = 0;
	let clientY = 0;
	let startPos = 0;
	let lastFrame = 0;
	let pointerId: number | null = null;
	let animationId: number | null = null;

	const maxIdx = () => Math.max(0, (props.meta.length ?? 0) - power() - 1);

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
		e.currentTarget.setPointerCapture?.(pointerId);
		if (animationId) cancelAnimationFrame(animationId);
		animationId = null;
		window.getSelection?.()?.removeAllRanges();
		clientX = e.clientX;
		clientY = e.clientY;
		startPos = pos();
	};

	const pagesCount = createMemo(() => Math.max(0, (props.meta.length ?? 0) - power()));

	const Thumb = () => {
		return (
			<button
				aria-label="Review scroller"
				class="bg-accent absolute inset-0 cursor-grab rounded-md"
				style={{
					width: `${100 / pagesCount()}%`,
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

	const menu = WriteReview();

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
				<div
					class="flex will-change-transform"
					style={{
						translate: `${(-pos() * 100) / (power() + 1)}% 0 0`,
					}}
				>
					<For each={props.meta}>{(review) => <Review {...review} />}</For>
				</div>

				<button
					class="bg-accent absolute bottom-0 left-8 flex translate-y-1/2 cursor-pointer items-center gap-4 rounded-lg px-4 py-3 sm:right-12 sm:left-auto"
					onPointerDown={(e) => {
						e.stopPropagation();
					}}
					onClick={() => {
						menu.setOpen(true);
					}}
				>
					<Feather class="size-8" />
					<span class="font-serif">Write a review</span>
				</button>
			</div>

			<Show when={pagesCount() > 1}>
				<div class="bg-tone relative m-auto mt-20 flex h-4 w-[60vw] max-w-100 touch-pan-y rounded-md contain-paint">
					<Thumb />
					<For
						each={Array.from({ length: pagesCount() })}
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

			{menu.dialog}
		</>
	);
}

const Review = (review: ReviewsProps['content'][number]) => {
	return (
		<div class="content-box w-full flex-none px-2 sm:w-1/2 sm:px-4">
			<div class="border-accent mb-7 h-full rounded-md border p-7 md:p-10">
				<div class="bg-accent absolute top-0 -translate-y-1/2 rounded-md px-4 py-2">
					<span class="text-base font-semibold">{review.location}</span>
				</div>

				<h3 class="font-serif text-2xl text-balance xl:text-3xl">{review.title}</h3>

				<div class="mt-3 mb-4 flex gap-1.5">
					<span class="sr-only">{review.stars} stars out of 5</span>
					<Stars class="size-6" length={review.stars} />
				</div>

				{/* its safe */}
				{/* eslint-disable-next-line solid/no-innerhtml */}
				<p class="desc-base" innerHTML={review.desc} />
			</div>
		</div>
	);
};

function WriteReview() {
	const [open, setOpen] = createSignal(false);
	const persistedContent = createPersistent(() => {
		return (
			<>
				<div class="mt-4">
					<Inputs.StarSlider />
				</div>
				<div class="mt-12 space-y-11">
					<Inputs.Email required />
					<Inputs.Select name="Location" items={['Select a location', ...business.areaServed]} />
					<Inputs.TextArea name="Review" />
					<Actions.Button variant="fill">Submit</Actions.Button>
				</div>
			</>
		);
	});

	return {
		open,
		setOpen,
		dialog: (
			<Dialog open={open()} onOpenChange={setOpen}>
				<Dialog.Portal>
					<Menus.DialogForm
						title="Review"
						desc="We will verify your submission via email."
						name="review"
						action="/submissions/review"
					>
						{persistedContent()}
					</Menus.DialogForm>
				</Dialog.Portal>
			</Dialog>
		),
	};
}
