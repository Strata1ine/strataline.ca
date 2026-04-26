import { createSignal, onMount, onCleanup, splitProps, type ComponentProps } from 'solid-js';
import createPersistent from 'solid-persistent';
import { cn } from '@/frontend/utils';

import Dialog from '@corvu/dialog';
import Mailbox from '~icons/ph/mailbox-fill';
import Actions, { buttonVariants, fabVariants, fabSize } from '@/components/Actions';
import Menus from './Menus';
import Inputs from './Inputs';

import business from '#/business.json';
import { createMediaQuery } from '@solid-primitives/media';

const digits = business.telephone.replace(/\D/g, '');
const phoneHref = `tel:${digits.length === 10 ? `+1${digits}` : `+${digits}`}`;

const talkDialogs = new Set<{ isOpen: () => boolean; close: () => void }>();
const anyTalkDialogOpen = () => [...talkDialogs].some((dialog) => dialog.isOpen());
const closeTalkDialogs = () => {
	for (const dialog of talkDialogs) dialog.close();
};
const contactDialogInDom = () =>
	typeof document != 'undefined' && document.querySelector('[data-contact-dialog]') != null;
const anyContactDialogOpen = () => anyTalkDialogOpen() || contactDialogInDom();

export function LetsTalk(props: ComponentProps<'button'>) {
	let trigger: HTMLButtonElement | undefined;
	let suppressNextClick = false;
	const [local, rest] = splitProps(props, ['children', 'onClick', 'onPointerDown', 'type']);
	const [open, setOpen] = createSignal(false);
	const closeFromTrigger = (event: Event) => {
		suppressNextClick = true;
		event.preventDefault();
		event.stopPropagation();
		closeTalkDialogs();
	};
	const handlePointerDown: ComponentProps<'button'>['onPointerDown'] = (event) => {
		local.onPointerDown?.(event);
		if (event.defaultPrevented || !anyContactDialogOpen()) return;
		closeFromTrigger(event);
	};
	const handleClick: ComponentProps<'button'>['onClick'] = (event) => {
		local.onClick?.(event);
		event.preventDefault();
		event.stopPropagation();
		if (suppressNextClick) {
			suppressNextClick = false;
			return;
		}
		const shouldOpen = !anyContactDialogOpen();
		closeTalkDialogs();
		setOpen(shouldOpen);
	};

	onMount(() => {
		const controller = {
			isOpen: open,
			close: () => setOpen(false),
		};

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.key == '/') {
				e.preventDefault();
				closeTalkDialogs();
				setOpen(true);
			}
		};

		const handlePointerDown = (event: PointerEvent) => {
			if (!open() || !trigger) return;
			if (trigger.contains(event.target as Node)) return;

			const rect = trigger.getBoundingClientRect();
			const landsOnTrigger =
				event.clientX >= rect.left &&
				event.clientX <= rect.right &&
				event.clientY >= rect.top &&
				event.clientY <= rect.bottom;

			if (!landsOnTrigger) return;
			closeFromTrigger(event);
		};

		talkDialogs.add(controller);
		window.addEventListener('keydown', handleKeyDown);
		document.addEventListener('pointerdown', handlePointerDown, true);

		onCleanup(() => {
			talkDialogs.delete(controller);
			window.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('pointerdown', handlePointerDown, true);
		});
	});

	const persistedContent = createPersistent(() => {
		return (
			<div class="mt-12 space-y-11">
				<Inputs.Email required />
				<Inputs.PhoneNumber validate />
				<Inputs.Select name="Location" items={['Select a location', ...business.areaServed]} />
				<Inputs.TextArea required name="Messege" />
				<Actions.Button value="submit" variant="fill">
					Submit
				</Actions.Button>
			</div>
		);
	});

	return (
		<Dialog
			open={open()}
			onOpenChange={setOpen}
			closeOnOutsidePointer={false}
			noOutsidePointerEvents={false}
		>
			<button
				{...rest}
				ref={(el) => (trigger = el)}
				type={local.type ?? 'button'}
				aria-expanded={open()}
				onPointerDown={handlePointerDown}
				onClick={handleClick}
			>
				{local.children}
			</button>
			<Dialog.Portal>
				<Menus.DialogForm
					title="Let's talk"
					desc="Feel free to ask a question and a quote."
					id="jReRE2JLR"
					action="/submissions/talk"
					contact
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
	const isMobile = createMediaQuery('(max-width: 800px)');
	const inset = () => (isMobile() ? 25 : 70);

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
		<div class="relative mt-9 flex h-14 items-center gap-5 sm:gap-6 xl:h-16" ref={(el) => (sensor = el!)}>
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
					translate: style(),
					'transition-property': 'width, height, border-radius, translate, background-color',
					'will-change': 'width, height, border-radius, translate, background-color',
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
			<div class={cn(buttonVariants(), 'invisible h-14 w-34 xl:h-16 xl:w-42')} aria-hidden="true" />
			<a
				class="font-sans text-xl leading-none font-semibold text-black/85 transition hover:text-secondary sm:text-2xl xl:text-3xl"
				href={phoneHref}
				aria-label={`Call Strataline at ${business.telephone}`}
			>
				{business.telephone}
			</a>
		</div>
	);
}
