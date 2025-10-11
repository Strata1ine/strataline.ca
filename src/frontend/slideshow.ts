import { onCleanup, createEffect } from 'solid-js';
import { videoPlaying } from './stores';

type SlideshowParams = {
	idx: number;
	setIdx: (v: number) => void;
	length: number;
	speed: number;
};

export function slideshow(node: HTMLElement, accessor: () => SlideshowParams) {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;
	let isVisible = false;

	function clear() {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
	}

	function next() {
		clear();
		const { idx, setIdx, length, speed } = accessor();
		if (isVisible && length > 1 && !videoPlaying()) {
			timeoutId = setTimeout(() => {
				setIdx((idx + 1) % length);
			}, speed * 1000);
		}
	}

	const observer = new IntersectionObserver(([entry]) => {
		if (entry.isIntersecting !== isVisible) {
			isVisible = entry.isIntersecting;
			next();
		}
	});

	observer.observe(node);

	createEffect(() => {
		if (videoPlaying()) {
			clear();
		} else {
			next();
		}
	});

	createEffect(() => {
		accessor();
		next();
	});

	onCleanup(() => {
		clear();
		observer.disconnect();
	});
}
