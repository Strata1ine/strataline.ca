import { createSignal, onMount, onCleanup } from 'solid-js';

export function useQueryDevice(breakpoint = 750) {
	const [isMobile, setIsMobile] = createSignal(true);

	onMount(() => {
		const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
		const handler = () => setIsMobile(mediaQuery.matches);

		handler();
		mediaQuery.addEventListener('change', handler);

		onCleanup(() => {
			mediaQuery.removeEventListener('change', handler);
		});
	});

	return {
		isMobile,
	};
}
