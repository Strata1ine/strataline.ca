import { createSignal, onMount, onCleanup } from 'solid-js';

import { useQueryDevice } from '@/frontend/mobile';
import Mailbox from '~icons/ph/mailbox-fill';
import { buttonVariants, fabVariants, fabSize } from '@/components/Actions';
import { cn } from '@/frontend/utils';
import LetsTalk from './menus/Talk';

export default function FluidTalk() {
	let sensor: HTMLElement;
	const [above, setAbove] = createSignal(true);
	const [style, setStyle] = createSignal<string | null>(null);
	const [hydrated, setHydrated] = createSignal(false);
	const queryMobile = useQueryDevice(800);
	const inset = () => (queryMobile.isMobile() ? 25 : 70);

	const update = () => {
		if (above() || !sensor) return setStyle(null);
		const { x } = sensor.getBoundingClientRect();
		setStyle(
			`${window.innerWidth - x - fabSize - inset()}px calc(100svh - ${fabSize + inset()}px) 0`,
		);
	};

	onMount(() => {
		update();
		const wait = setTimeout(() => {
			setHydrated(true);
		}, 20);

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry) return;
				const nextAbove = !(entry.intersectionRatio < 1);
				if (nextAbove != (above() && entry.boundingClientRect.top < 0)) {
					setAbove(nextAbove);
					update();
				}
			},
			{ threshold: [0, 1] },
		);
		observer.observe(sensor);

		const resize = new ResizeObserver(() => update());
		resize.observe(document.documentElement);

		onCleanup(() => {
			clearTimeout(wait);
			observer.disconnect();
			resize.disconnect();
			window.removeEventListener('resize', update);
			window.removeEventListener('load', load);
		});
	});

	return (
		<div class="relative mt-9 h-14 xl:h-16" ref={(el) => (sensor = el!)}>
			<LetsTalk
				aria-label="Let's talk (Ctrl+/)"
				class={cn(
					'z-1',
					hydrated() && 'duration-1000',
					above()
						? cn(buttonVariants(), 'absolute h-14 w-34 xl:h-16 xl:w-42')
						: cn(fabVariants({ variant: 'pill', background: 'accent' }), 'fixed top-0'),
				)}
				style={{
					translate: style() ?? undefined,
					'transition-property': 'width, height, border-radius, translate, background-color, color',
				}}
				onClick={() => {}}
			>
				<span
					aria-hidden="true"
					class={cn(
						'absolute top-1/2 left-1/2 -translate-1/2 whitespace-nowrap',
						hydrated() && 'transition-opacity duration-500',
						above() ? 'opacity-100' : 'opacity-0',
					)}
				>
					Let's Talk
				</span>

				<Mailbox
					class={cn(
						'absolute top-1/2 left-1/2 size-10 -translate-1/2 sm:size-12',
						hydrated() && 'transition-opacity duration-500',
						above() ? 'opacity-0' : 'opacity-100',
					)}
				/>
			</LetsTalk>
		</div>
	);
}
