import { For, onCleanup, onMount } from 'solid-js';
import Star from '~icons/ph/star-four-fill';
import type { Props as TextCarouselMeta } from './TextCarousel.astro';

export default function TextCarousel(props: { meta: TextCarouselMeta }) {
	let textCarousel!: HTMLElement;
	let container!: HTMLElement;

	let clientX = 0;
	let clientY = 0;
	let startPos = 0;
	let rawPos = 0;
	let moveDirection = -1;
	let lastFrame = 0;

	let pos = 0;
	let isVisible = false;
	let animationId: number | null = null;
	let pointerId: number | null = null;

	let currentVelocity = 0;
	let prevX = 0;

	const updateTranslation = (o: number) => {
		const w = (textCarousel.children[0] as HTMLElement).scrollWidth;
		pos = o - Math.floor(o / w) * w;
		textCarousel.style.translate = `${-pos}px 0 0`;
	};

	const scrollMultiplier = (e: HTMLElement) => window.innerWidth / e.getBoundingClientRect().width;

	const animate = (currentTime: number = 0) => {
		if (!isVisible) return;
		const friction = 0.9;
		const dt = currentTime - lastFrame;
		lastFrame = currentTime;

		const movement = currentVelocity * (dt / 16);
		rawPos += moveDirection * props.meta.speed * dt + movement;
		currentVelocity *= Math.pow(friction, dt / 16);

		updateTranslation(rawPos);
		animationId = requestAnimationFrame(animate);
	};

	onMount(() => {
		const observer = new IntersectionObserver(([entry]) => {
			if (entry && entry.isIntersecting !== isVisible) {
				isVisible = entry.isIntersecting;
				if (isVisible) {
					requestAnimationFrame(animate);
				} else if (animationId != null) {
					cancelAnimationFrame(animationId);
					animationId = null;
				}
			}
		});

		observer.observe(container);

		onCleanup(() => {
			observer.disconnect();
			if (animationId != null) {
				cancelAnimationFrame(animationId);
				animationId = null;
			}
		});
	});

	return (
		<div
			class="border-primary-dark touch-pan-y border-y contain-paint"
			ref={(el) => (container = el)}
			onPointerDown={(e) => {
				if (e.button !== 0) return;

				pointerId = e.pointerId;
				e.currentTarget.setPointerCapture(pointerId);

				if (animationId != null) {
					cancelAnimationFrame(animationId);
					animationId = null;
				}

				window.getSelection()?.removeAllRanges();
				clientX = e.clientX;
				clientY = e.clientY;

				currentVelocity = 0;
				startPos = pos;
			}}
			onPointerMove={(e) => {
				if (e.pointerId !== pointerId) return;

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
				if (e.pointerId !== pointerId) return;
				if (pointerId != null) {
					e.currentTarget.releasePointerCapture(pointerId);
				}
				pointerId = null;

				const diffX = clientX - e.clientX;
				const diffY = clientY - e.clientY;
				moveDirection = diffX < 0 ? -1 : 1;

				if (Math.abs(diffX) > 20 && Math.abs(diffX) > Math.abs(diffY)) {
					currentVelocity *= scrollMultiplier(container) * 25;
					lastFrame = performance.now();
					requestAnimationFrame(animate);
				}
			}}
			role="marquee"
		>
			<div
				ref={(el) => (textCarousel = el)}
				class="flex h-25 items-center will-change-transform select-none md:h-30"
				style={{ translate: `${-pos}px 0 0` }}
			>
				<For each={[0, 1, 2]}>
					{() => (
						<div class="flex flex-none">
							<For
								each={props.meta.text}
								children={(item) => (
									<>
										<h3 class="mx-12 flex-none font-serif text-3xl md:mx-20 md:text-4xl lg:mx-23">
											{item}
										</h3>

										<Star class="text-gold size-7 flex-none sm:size-9" />
									</>
								)}
							/>
						</div>
					)}
				</For>
			</div>
		</div>
	);
}
