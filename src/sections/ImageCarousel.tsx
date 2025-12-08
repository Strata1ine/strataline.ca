import { createSignal, For, onCleanup } from 'solid-js';
import type { Props as ImageCarouselMeta } from './ImageCarousel.astro';
import Image from '@/components/Image';
import CaretCircleLeftFill from '~icons/ph/CaretCircleLeftFill';

export default function ImageCarousel(props: { meta: ImageCarouselMeta }) {
	let container!: HTMLDivElement;

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
		if (!container || !container.children.length) return;
		const firstChild = container.children[0] as HTMLElement;
		const w = firstChild.scrollWidth;
		const wrapped = o - Math.floor(o / w) * w;

		container.style.transform = `translate3d(${-wrapped}px, 0, 0)`;
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
		if (id !== null) {
			cancelAnimationFrame(id);
			setAnimationId(null);
		}
	}

	onCleanup(() => {
		reset();
	});

	return (
		<>
			<div
				ref={container}
				class="flex h-120 cursor-grab touch-pan-y will-change-transform"
				onPointerDown={(e) => {
					if (e.button !== 0) return;
					reset();
					const id = e.pointerId;
					setPointerId(id);
					e.currentTarget.setPointerCapture(id);
					currentVelocity = 0;
					window.getSelection()?.removeAllRanges();
					clientX = e.clientX;
					clientY = e.clientY;
					startPos = pos();
				}}
				onPointerMove={(e) => {
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
				}}
				onPointerUp={(e) => {
					if (e.pointerId !== pointerId()) return;
					e.currentTarget.releasePointerCapture(e.pointerId);
					setPointerId(null);
					const diffX = clientX - e.clientX;
					const diffY = clientY - e.clientY;
					if (Math.abs(diffX) > 20 && Math.abs(diffX) > Math.abs(diffY)) {
						currentVelocity *= scrollMultiplier(container) * 30;
						lastFrame = performance.now();
						requestAnimationFrame(animate);
					}
				}}
				role="region"
				aria-label="Image carousel"
			>
				<For
					each={[0, 1]}
					children={() => (
						<div class="flex flex-none">
							<For
								each={props.meta.content}
								children={(image) => (
									<Image
										widths={[400, 600, 800]}
										class="mx-3 w-90 max-w-svw shadow-2xl"
										image={image}
									/>
								)}
							/>
						</div>
					)}
				/>
			</div>

			<div class="max-w-inner mt-9 flex justify-end gap-1 px-4 md:mx-auto">
				<button
					onClick={() => {
						reset();
						lastFrame = performance.now();
						currentVelocity = -(scrollMultiplier(container) * 40);
						const id = requestAnimationFrame(animate);
						setAnimationId(id);
					}}
					aria-label="Scroll carousel left"
					class="relative"
					tabIndex={0}
				>
					<span class="absolute inset-4 z-[-1] rounded-[50%] bg-black" />
					<CaretCircleLeftFill class="size-20 cursor-pointer text-gray-100" />
				</button>

				<button
					onClick={() => {
						reset();
						lastFrame = performance.now();
						currentVelocity = scrollMultiplier(container) * 40;
						const id = requestAnimationFrame(animate);
						setAnimationId(id);
					}}
					aria-label="Scroll carousel right"
					class="relative"
					tabIndex={0}
				>
					<span class="absolute inset-4 z-[-1] rounded-[50%] bg-black" />
					<CaretCircleLeftFill class="size-20 rotate-180 cursor-pointer text-gray-100" />
				</button>
			</div>
		</>
	);
}
