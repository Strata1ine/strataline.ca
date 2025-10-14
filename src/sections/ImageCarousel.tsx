import { createSignal, For, onCleanup } from 'solid-js';
// import { containerVariants } from './layout/Container.astro';
import CaretCircleLeftFill from '~icons/ph/caret-circle-left-fill';
import type { Props as ImageCarouselMeta } from './ImageCarousel.astro';
import { cn } from '@/frontend/utils';

export default function ImageCarousel(props: ImageCarouselMeta) {
	let container!: HTMLDivElement;
	let imageCarousel!: HTMLDivElement;

	const [pos, setPos] = createSignal(0);
	const [pointerId, setPointerId] = createSignal<number | null>(null);
	const [animationId, setAnimationId] = createSignal<number | null>(null);

	let lastFrame = 0;
	let currentVelocity = 0;
	let prevX = 0;

	let clientX = 0;
	let clientY = 0;
	let startPos = 0;
	let rawPos = 0;

	const scrollMultiplier = (e: HTMLElement) => {
		return window.innerWidth / e.getBoundingClientRect().width;
	};

	const updateTranslation = (o: number) => {
		if (!imageCarousel || !imageCarousel.children.length) return;
		const w = (imageCarousel.children[0] as HTMLElement).scrollWidth;
		const wrapped = o - Math.floor(o / w) * w;
		setPos(wrapped);
	};

	const animate = (currentTime: number = 0) => {
		const friction = 0.9;
		const dt = currentTime - lastFrame;
		lastFrame = currentTime;

		if (Math.abs(currentVelocity) > 0.1) {
			const movement = currentVelocity * (dt / 16);
			const next = pos() + movement;
			updateTranslation(next);
			currentVelocity *= Math.pow(friction, dt / 16);
			const id = requestAnimationFrame(animate);
			setAnimationId(id);
		} else {
			setAnimationId(null);
		}
	};

	function reset() {
		const id = animationId();
		if (id) {
			cancelAnimationFrame(id);
			setAnimationId(null);
		}
	}

	const onPointerDown = (e: PointerEvent) => {
		if (e.button !== 0) return;
		reset();

		const id = e.pointerId;
		setPointerId(id);
		(e.currentTarget as HTMLElement).setPointerCapture(id);
		currentVelocity = 0;

		window.getSelection?.()?.removeAllRanges();
		clientX = e.clientX;
		clientY = e.clientY;
		startPos = pos();
	};

	const onPointerMove = (e: PointerEvent) => {
		if (e.pointerId !== pointerId()) return;

		rawPos = startPos - (e.clientX - clientX);
		updateTranslation(rawPos);

		const now = performance.now();
		const dt = now - lastFrame;
		if (dt > 0) {
			currentVelocity = (prevX - e.clientX) / dt;
		}

		lastFrame = now;
		prevX = e.clientX;
	};

	const onPointerUp = (e: PointerEvent) => {
		if (e.pointerId !== pointerId()) return;
		(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		setPointerId(null);

		const diffX = clientX - e.clientX;
		const diffY = clientY - e.clientY;

		if (Math.abs(diffX) > 20 && Math.abs(diffX) > Math.abs(diffY)) {
			currentVelocity *= scrollMultiplier(container) * 30;
			lastFrame = performance.now();
			const id = requestAnimationFrame(animate);
			setAnimationId(id);
		}
	};

	onCleanup(() => {
		reset();
	});

	return (
		<>
			<div
				ref={container}
				// class={cn(imageWrapperVariants({ variant: 'lg' }), 'cursor-grab touch-pan-y')}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				role="region"
				aria-label="Image carousel"
			>
				<div
					ref={imageCarousel}
					class="flex h-full will-change-transform"
					style={{ translate: `${-pos()}px 0 0` }}
				>
					<For each={props.content}>
						{(image) => (
							<div class="h-full flex-none">
								{/* <Image class="mx-2 block max-w-screen rounded-sm md:mx-4" image={image} /> */}
							</div>
						)}
					</For>
				</div>
			</div>
		</>
	);
}

			// 	<div class={cn(containerVariants({ variant: 'inner' }), 'mt-9 flex justify-end gap-1')}>
			// 	<button
			// 		onClick={() => {
			// 			reset();
			// 			lastFrame = performance.now();
			// 			currentVelocity = -(scrollMultiplier(container) * 40);
			// 			const id = requestAnimationFrame(animate);
			// 			setAnimationId(id);
			// 		}}
			// 		aria-label="Scroll carousel left"
			// 		class="relative"
			// 		tabIndex={0}
			// 	>
			// 		<span class="absolute inset-4 z-[-1] rounded-[50%] bg-black" />
			// 		<CaretCircleLeftFill class="text-tone size-20" />
			// 	</button>
			//
			// 	<button
			// 		onClick={() => {
			// 			reset();
			// 			lastFrame = performance.now();
			// 			currentVelocity = scrollMultiplier(container) * 40;
			// 			const id = requestAnimationFrame(animate);
			// 			setAnimationId(id);
			// 		}}
			// 		aria-label="Scroll carousel right"
			// 		class="relative"
			// 		tabIndex={0}
			// 	>
			// 		<span class="absolute inset-4 z-[-1] rounded-[50%] bg-black" />
			// 		<CaretCircleLeftFill class="text-tone size-20 rotate-180" />
			// 	</button>
			// </div>/*}
