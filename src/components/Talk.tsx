import { createSignal, onMount, onCleanup, type ComponentProps } from 'solid-js';
import createPersistent from 'solid-persistent';
import { useQueryDevice } from '@/frontend/mobile';
import { cn } from '@/frontend/utils';

import Dialog from '@corvu/dialog';
import Mailbox from '~icons/ph/mailbox-fill';
import Actions, { buttonVariants, fabVariants, fabSize } from '@/components/Actions';
import Menus from './Menus';
import Inputs from './Inputs';

import business from '#/business.json';

function LetsTalk(props: ComponentProps<typeof Dialog.Trigger>) {
	const persistedContent = createPersistent(() => {
		return (
			<div class="mt-12 space-y-11">
				<Inputs.Email required />
				<Inputs.PhoneNumber validate />
				<Inputs.Select name="Location" items={['Select a location', ...business.areaServed]} />
				<Inputs.TextArea required name="Messege" />
				<Inputs.Photos />
				<Actions.Button variant="fill">Submit</Actions.Button>
			</div>
		);
	});

	return (
		<Dialog>
			<Dialog.Trigger {...props} />
			<Dialog.Portal>
				<Menus.DialogForm
					title="Let's talk"
					desc="Feel free to ask a question and a quote."
					name="contact"
					action="/submissions/talk"
				>
					{persistedContent()}
				</Menus.DialogForm>
			</Dialog.Portal>
		</Dialog>
	);
}

export default function Talk() {
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
			>
				<span
					aria-hidden="true"
					class={cn(
						'absolute top-1/2 left-1/2 -translate-1/2 font-bold whitespace-nowrap',
						hydrated() && 'transition-opacity duration-750',
						above() ? 'opacity-100' : 'opacity-0',
					)}
				>
					Let's Talk
				</span>

				<Mailbox
					class={cn(
						'absolute top-1/2 left-1/2 size-10 -translate-1/2 sm:size-12',
						hydrated() && 'transition-opacity duration-750',
						above() ? 'opacity-0' : 'opacity-100',
					)}
				/>
			</LetsTalk>
		</div>
	);
}
