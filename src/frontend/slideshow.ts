import { onCleanup, createEffect } from 'solid-js';
import { videoPlaying } from './stores';

type SlideshowParams = {
	idx: number;
	setIdx: (v: number) => void;
	length: number;
	speed: number;
};

export function slideshow(accessor: SlideshowParams) {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	function clear() {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
	}

	function next() {
		clear();
		const { idx, setIdx, length, speed } = accessor;
		if (length > 1 && !videoPlaying()) {
			timeoutId = setTimeout(() => {
				setIdx((idx + 1) % length);
			}, speed * 1000);
		}
	}

	createEffect(() => {
		if (videoPlaying()) {
			clear();
		} else {
			next();
		}
	});

	onCleanup(() => {
		clear();
	});
}
