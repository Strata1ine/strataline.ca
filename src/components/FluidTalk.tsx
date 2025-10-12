import { createSignal, onMount, onCleanup } from 'solid-js';
import { modals } from '@/frontend/stores';
import { useQueryDevice } from '@/frontend/mobile';
import Mailbox from '~icons/ph/mailbox-fill';
import { buttonVariants } from '@/components/Button';
import { fabVariants, fabSize } from '@/components/Fab';
import { cn } from '@/frontend/utils';

export default function FluidTalk() {
	let sensor: HTMLElement;
	const [above, setAbove] = createSignal(true);
	const [style, setStyle] = createSignal<string | null>(null);
	const phone = useQueryDevice(1000);
	const inset = () => (phone.isMobile() ? 10 : 50);

	const update = () => {
		if (above() || !sensor) return setStyle(null);
		const { x } = sensor.getBoundingClientRect();
		setStyle(
			`${window.innerWidth - x - fabSize - inset()}px calc(100svh - ${fabSize + inset()}px) 0`,
		);
	};

	onMount(() => {
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

		window.addEventListener('resize', update, { passive: true });

		onCleanup(() => {
			observer.disconnect();
			resize.disconnect();
			window.removeEventListener('resize', update);
		});
	});

	return (
		<div class="relative mt-9 h-14 xl:h-16" ref={(el) => (sensor = el!)}>
			<button
				aria-label="Let's talk (Ctrl+/)"
				class={cn(
					'z-1 duration-1000',
					above()
						? cn(buttonVariants(), 'absolute h-14 w-34 xl:h-16 xl:w-42')
						: cn(fabVariants({ variant: 'pill', background: 'accent' }), 'fixed top-0'),
				)}
				style={{
					translate: style() ?? undefined,
					'transition-property': 'width, height, border-radius, translate, background-color, color',
					'will-change': 'width, height, border-radius, translate, background-color, color',
				}}
				onClick={() => modals.open(modals.talk)}
			>
				<div
					aria-hidden="true"
					class={cn(
						'absolute top-1/2 left-1/2 -translate-1/2 whitespace-nowrap transition-opacity duration-500',
						above() ? 'opacity-100' : 'opacity-0',
					)}
				>
					Let's Talk
				</div>
				<Mailbox
					class={cn(
						'absolute top-1/2 left-1/2 size-11 -translate-1/2 transition-opacity duration-500',
						above() ? 'opacity-0' : 'opacity-100',
					)}
				/>
			</button>
		</div>
	);
}
