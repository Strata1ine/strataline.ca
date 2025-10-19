import {
	For,
	Show,
	createContext,
	createMemo,
	createSignal,
	splitProps,
	useContext,
} from 'solid-js';
import { createList } from 'solid-list';
import type { ComponentProps, JSX } from 'solid-js';
import type { RootChildrenProps as PopoverProps } from '@corvu/popover';
import type { RootChildrenProps as DialogProps } from '@corvu/dialog';
import Popover from '@corvu/popover';
import { cn } from '@/frontend/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import Stars from './Stars';

import Asterick from '~icons/ph/asterisk-bold';
import Check from '~icons/ph/check-bold';
import Upload from '~icons/ph/upload-simple-fill';
import ImagesSquare from '~icons/ph/images-square-fill';
import Resize from '~icons/ph/arrow-line-down-fill';
import NavArrow from '~icons/ph/navigation-arrow-fill';
import Caret from '~icons/ph/caret-down-bold';
import MagnifyingGlass from '~icons/ph/magnifying-glass-bold';
import X from '~icons/ph/x-bold';
import createPresence from 'solid-presence';

export type FieldProps = {
	name?: string;
	required?: boolean;
	validate?: boolean;
	placeholder?: string;
	children?: JSX.Element;
	open?: boolean;
	top?: boolean;
	variant?: VariantProps<typeof fieldVariants>['variant'];
};

export type FieldContextProps = {
	id: string;
	required?: boolean;
	name?: string;
};

const FieldContext = createContext<FieldContextProps>({
	id: '',
	required: undefined,
	name: undefined,
});

function FieldRoot(props: FieldProps) {
	const id = genInput();

	return (
		<FieldContext.Provider value={{ id, name: props.name, required: props.required }}>
			<div class="relative touch-manipulation">
				<Show when={props.name}>
					<label
						class={cn(
							'absolute left-2 flex -translate-y-1/2 items-center gap-2 rounded-md bg-white px-3 transition-opacity select-none',
							props.top ? 'opacity-0' : 'opacity-100',
						)}
						for={id}
					>
						<span class="text-md font-serif leading-none font-bold">{props.name}</span>
						{props.required ? <Asterick class="text-error size-3" /> : null}
					</label>
				</Show>

				<label class={fieldVariants({ open: props.open, top: props.top, variant: props.variant })}>
					{props.children}
				</label>
			</div>
		</FieldContext.Provider>
	);
}

function FieldBody(props: ComponentProps<'input'>) {
	const context = useContext(FieldContext);
	return (
		<input
			id={context.id}
			name={context.name}
			required={context.required}
			class="w-full outline-none"
			{...props}
		/>
	);
}

function FieldHead(props: { children: JSX.Element }) {
	return <>{props.children}</>;
}

function FieldTail(props: { children: JSX.Element }) {
	return <>{props.children}</>;
}

const Field = Object.assign(FieldRoot, {
	Body: FieldBody,
	Head: FieldHead,
	Tail: FieldTail,
});

export type TextAreaProps = {
	height?: number;
	minheight?: number;
};

function TextArea(props: FieldProps & TextAreaProps & ComponentProps<'textarea'>) {
	const [local, input] = splitProps(props, ['name', 'open', 'children', 'height', 'minheight']);
	let textarea: HTMLTextAreaElement | undefined;
	const minheight = local.minheight ?? 100;

	const [height, setHeight] = createSignal(local.height ?? 100);

	let offset = 0;
	return (
		<Field {...local}>
			<textarea
				ref={textarea}
				class="w-full resize-none outline-none"
				style={{
					height: `${height()}px`,
				}}
				{...input}
			/>

			<div
				class="absolute right-0 bottom-0 cursor-ns-resize touch-none"
				onPointerDown={(e) => {
					offset =
						e.clientY -
						e.currentTarget.getBoundingClientRect().top -
						e.currentTarget.getBoundingClientRect().height / 2;
					e.currentTarget.setPointerCapture(e.pointerId);
				}}
				onPointerMove={(e) => {
					if (e.currentTarget.hasPointerCapture(e.pointerId) && textarea) {
						setHeight(
							Math.max(minheight, e.clientY - offset - textarea?.getBoundingClientRect().top),
						);
					}
				}}
				onPointerUp={(e) => {
					e.currentTarget.releasePointerCapture(e.pointerId);
				}}
			>
				<Resize class="size-5 -translate-5" />
			</div>
		</Field>
	);
}

function PhoneNumber(props: FieldProps) {
	const [valid, setValid] = createSignal(!props.required);
	return (
		<Field name={props.name ?? 'Phone number'} {...props}>
			<Field.Body
				inputmode="tel"
				autocomplete="tel"
				pattern="^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$"
				placeholder={props.placeholder ?? '(xxx) xxx-xxxx'}
				onInput={(e) => {
					let parse = e.currentTarget.value.replace(/\D/g, '');
					let pos = e.currentTarget.selectionStart || 0;
					if (parse.length === 4 || parse.length === 7) {
						pos += 3;
					}
					if (parse.length > 3 && parse.length <= 6) {
						parse = `(${parse.slice(0, 3)}) ${parse.slice(3)}`;
					} else if (parse.length > 6) {
						parse = `(${parse.slice(0, 3)}) ${parse.slice(3, 6)}-${parse.slice(6, 10)}`;
					}
					e.currentTarget.value = parse;
					e.currentTarget.setSelectionRange(pos, pos);
					setValid(e.currentTarget.validity.valid);
				}}
			/>
			<Field.Tail>
				<ValidityIcon valid={valid()} />
			</Field.Tail>
		</Field>
	);
}

function Photos(props: FieldProps) {
	const label = 'None selected';
	const [value, setValue] = createSignal(label);
	return (
		<Field name={props.name ?? 'Photos'} {...props}>
			<Field.Head>
				<ImagesSquare class="size-8" />
			</Field.Head>
			<Field.Body
				accept="image/*"
				multiple
				type="file"
				class="sr-only"
				placeholder={props.placeholder}
				onChange={(e) => {
					if (!e.currentTarget.files) return;
					if (e.currentTarget.files.length > 0) {
						setValue(`${e.currentTarget.files.length} photo(s) selected`);
					} else {
						setValue(label);
					}
				}}
			/>
			<span class="flex-1">{value()}</span>
			<Field.Tail>
				<Upload class="size-6" />
			</Field.Tail>
		</Field>
	);
}

function Email(props: FieldProps) {
	const [valid, setValid] = createSignal(false);
	return (
		<Field name={props.name ?? 'E-mail'} {...props}>
			<Field.Body
				type="email"
				inputmode="email"
				autocomplete="email"
				placeholder={props.placeholder}
				onInput={(e) => setValid(e.currentTarget.validity.valid)}
			/>

			<Field.Tail>
				<ValidityIcon valid={valid()} />
			</Field.Tail>
		</Field>
	);
}

export type SelectProps = FieldProps & {
	items: string[];
};

function Select(props: SelectProps) {
	function Menu(popover: PopoverProps & DialogProps) {
		const [swap, _setSwap] = createSignal(false);
		const [prev, _setPrev] = createSignal(0);
		const [selected, _setSelected] = createSignal(0);

		const prevItem = createMemo(() => props.items[prev() ?? 0]);
		const currentItem = createMemo(() => props.items[selected() ?? 0]);

		const { active, setActive, onKeyDown } = createList({
			items: props.items.map((_, i) => i),
			initialActive: 0,
			handleTab: true,
			vimMode: true,
			onActiveChange: (active) => {
				if (!active) return;
				popover.contentRef?.children[active]?.scrollIntoView({
					block: 'nearest',
					behavior: 'instant',
				});
			},
		});

		const top = (): boolean => popover.floatingState.placement == 'top';
		const setSelected = (value: number) => {
			_setPrev(selected());
			_setSelected(value);
			setActive(value);
			if (selected() != prev()) {
				_setSwap(!swap());
			}

			popover.setOpen(false);
		};

		return (
			<Field open={popover.open} top={popover.open && top()} {...props}>
				<Popover.Trigger class="absolute inset-0 z-1 cursor-pointer outline-none" />
				<Field.Body class="sr-only" tabindex="-1" placeholder={props.placeholder} />

				<Field.Head>
					<NavArrow class="size-8" />
					<SwapText current={currentItem()} prev={prevItem()} swap={swap()} />
				</Field.Head>

				<Field.Tail>
					<Caret
						class={cn(
							'size-6 transition-transform duration-300',
							popover.open ? '-rotate-180' : '',
						)}
					/>
				</Field.Tail>

				<Popover.Portal>
					<Popover.Content
						class={cn('z-2', menuVariants({ top: top(), open: popover.open }))}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								setSelected(active() ?? 0);
							} else {
								onKeyDown(e);
							}
						}}
					>
						<For
							each={props.items}
							children={(item, index) => (
								<span
									class={menuItemVariants({ active: active() === index() })}
									aria-selected={active() === index()}
									onMouseDown={(e) => {
										if (e.button == 0) {
											setSelected(index());
										}
									}}
								>
									{item}
								</span>
							)}
						/>
					</Popover.Content>
				</Popover.Portal>
			</Field>
		);
	}

	return (
		<Popover
			floatingOptions={{
				flip: true,
				offset: 0,
				size: {
					matchSize: true,
				},
			}}
		>
			{(popover) => <Menu {...popover} />}
		</Popover>
	);
}

export function Search(props: SelectProps) {
	const [value, setValue] = createSignal<string>('');
	const [menuRef, setMenuRef] = createSignal<HTMLElement | null>(null);
	const [open, setOpen] = createSignal(false);

	const filtered = createMemo(() =>
		props.items.filter((item) => {
			const s = value().toLowerCase();
			const i = item.toLowerCase();
			let j = 0;
			for (const c of i) if (c === s[j]) j++;
			return j === s.length;
		}),
	);

	const setSelected = (e: Event, idx: number | undefined | null) => {
		if (idx == undefined) return;
		const selected = filtered()[idx];
		if (selected !== undefined) setValue(selected);
		setOpen(false);
		e.preventDefault();
	};

	const { active, setActive, onKeyDown } = createList({
		items: () => [...Array(filtered().length).keys()],
		initialActive: props.items.length - 1,
		handleTab: true,
		vimMode: true,
		onActiveChange: (active) => {
			if (!active) return;
			menuRef()?.children[active]?.scrollIntoView({
				block: 'nearest',
				behavior: 'instant',
			});
		},
	});

	const { present } = createPresence({
		show: open,
		element: menuRef,
	});

	return (
		<Field open={open()} top={open()} {...props}>
			<Field.Head children={<MagnifyingGlass class="size-12" />} />

			<Field.Body
				placeholder={props.placeholder}
				aria-label={props.placeholder}
				role="searchbox"
				spellcheck={false}
				value={value()}
				onInput={(event) => {
					setValue(event.currentTarget.value);
					setActive(filtered().length - 1);
				}}
				onBlur={() => setOpen(false)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						setSelected(e, active());
					} else if (e.key === 'Escape') {
						setValue('');
						setOpen(false);
					} else {
						setOpen(true);
						onKeyDown(e);
					}
				}}
			/>

			<Field.Tail
				children={
					<button
						onClick={() => {
							setValue('');
						}}
						class="cursor-pointer"
						aria-label="Cancel search"
						aria-hidden={value().length === 0}
						disabled={value().length === 0}
						tabIndex={value().length === 0 ? -1 : 0}
					>
						<X
							class={cn(
								'size-4 transition-opacity duration-200',
								value().length !== 0 ? 'opacity-100' : 'opacity-0',
							)}
							aria-hidden="true"
						/>
					</button>
				}
			/>

			<ul
				ref={setMenuRef}
				class={cn(
					!present() && 'hidden',
					'absolute right-0 bottom-full left-0 z-2',
					menuVariants({ top: true, variant: props.variant, open: open() }),
				)}
				role="listbox"
				tabindex="-1"
			>
				<Show when={filtered().length == 0}>
					<li class={menuItemVariants()}>No results found for "{value()}"</li>
				</Show>

				<For each={filtered()}>
					{(item, index) => (
						<li
							role="option"
							onMouseMove={() => setActive(index())}
							onMouseDown={(e) => {
								e.button == 0 && setSelected(e, index());
							}}
							class={menuItemVariants({ active: active() === index() })}
							aria-selected={active() === index()}
						>
							{item}
						</li>
					)}
				</For>
			</ul>
		</Field>
	);
}

function StarSlider() {
	const min = 0;
	const max = 10;
	const [length, setLength] = createSignal(max);
	let pointerId: null | number = null;

	function u(e: any) {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = Math.max(0, e.clientX - rect.left);
		setLength(Math.round(Math.min(max, (x / rect.width) * max)));
	}

	return (
		<>
			<input name="Stars" tabindex="-1" type="hidden" value={length() / 2} />
			<div class="relative inline-flex gap-2">
				<Stars class="size-8" length={length() / 2}>
					<div
						class="absolute inset-0 cursor-pointer touch-none"
						tabindex="0"
						role="slider"
						aria-label="Star rating"
						aria-valuemin={min}
						aria-valuemax={max / 2}
						aria-valuenow={length() / 2}
						onPointerDown={(e) => {
							if (e.button !== 0) return;
							pointerId = e.pointerId;
							e.currentTarget.setPointerCapture(pointerId);
							u(e);
							window.getSelection()?.removeAllRanges();
						}}
						onPointerUp={(e) => {
							if (e.pointerId != pointerId) return;
							e.currentTarget.releasePointerCapture(pointerId);
							pointerId = null;
						}}
						onPointerMove={(e) => {
							if (e.pointerId != pointerId) return;
							u(e);
						}}
						onKeyDown={(e) => {
							if (e.key === 'ArrowLeft') {
								setLength(Math.max(min, length() - 1.0));
							} else if (e.key === 'ArrowRight') {
								setLength(Math.min(max, length() + 1.0));
							}
						}}
					/>
				</Stars>
			</div>
		</>
	);
}

export const menuVariants = cva(
	'border-accent overflow-hidden overflow-y-scroll transition-[border-radius] select-none duration-400 bg-white outline-none max-h-70',
	{
		variants: {
			top: {
				true: 'border-b-0',
				false: 'border-t-0',
			},
			open: {
				true: 'animate-in fade-in-0%',
				false: 'animate-out fade-out-0%',
			},
			variant: {
				md: 'border',
				xl: 'border-2',
			},
		},
		compoundVariants: [
			{
				top: false,
				variant: 'md',
				className: 'rounded-br-md rounded-bl-md',
			},
			{
				top: false,
				variant: 'xl',
				className: 'rounded-br-xl rounded-bl-xl',
			},
			{
				top: true,
				variant: 'md',
				className: 'rounded-tr-md rounded-tl-md',
			},
			{
				top: true,
				variant: 'xl',
				className: 'rounded-tr-xl rounded-tl-xl',
			},
			{
				top: true,
				open: true,
				className: 'slide-in-from-top-10',
			},
			{
				top: true,
				open: false,
				className: 'slide-out-to-top-10',
			},
			{
				top: false,
				open: true,
				className: 'slide-in-from-bottom-10',
			},
			{
				top: false,
				open: false,
				className: 'slide-out-to-bottom-10',
			},
		],
		defaultVariants: {
			variant: 'md',
		},
	},
);

const menuItemVariants = cva('block w-full cursor-pointer px-5 py-2 hover:bg-tone', {
	variants: {
		active: {
			true: 'bg-tone',
			false: '',
		},
	},
	defaultVariants: {
		active: false,
	},
});

export const fieldVariants = cva(
	'border-accent block select-none transition-[border-radius] duration-400 gap-4 flex items-center overflow-hidden',
	{
		variants: {
			variant: {
				md: 'p-5 border',
				xl: 'px-5 py-3 border-2',
			},
			open: {
				true: '',
				false: '',
			},
			top: {
				true: undefined,
				false: undefined,
			},
		},
		compoundVariants: [
			{ open: false, variant: 'md', className: 'rounded-md' },
			{ open: false, variant: 'xl', className: 'rounded-xl' },

			{ open: true, top: false, variant: 'md', className: 'rounded-tl-md rounded-tr-md' },
			{ open: true, top: false, variant: 'xl', className: 'rounded-tl-xl rounded-tr-xl' },

			{ open: true, top: true, variant: 'md', className: 'rounded-bl-md rounded-br-md' },
			{ open: true, top: true, variant: 'xl', className: 'rounded-bl-xl rounded-br-xl' },
		],
		defaultVariants: {
			open: false,
			variant: 'md',
			top: false,
		},
	},
);

const Inputs = { Field, TextArea, PhoneNumber, Photos, Select, Email, StarSlider, Search };

export default Inputs;

let counter = 0;
const genInput = (): string => {
	return `input-${(counter += 1)}`;
};

function ValidityIcon(props: { valid?: boolean }) {
	return (
		<div class="relative size-6" aria-live="polite">
			<Check
				class={cn(
					'text-success absolute size-full duration-250',
					!props.valid && '-translate-y-full opacity-0',
				)}
				aria-hidden={!props.valid}
				aria-label={props.valid ? 'Valid' : undefined}
			/>

			<X
				class={cn(
					'text-error size-full duration-250',
					props.valid && '-translate-y-full opacity-0',
				)}
				aria-hidden={props.valid}
				aria-label={!props.valid ? 'Invalid' : undefined}
			/>
		</div>
	);
}

function SwapText(props: {
	current: string | undefined;
	prev: string | undefined;
	swap: boolean;
}): JSX.Element {
	return (
		<>
			<span class="sr-only">{props.current}</span>

			<div
				aria-hidden="true"
				class={cn('flex-1 transition-transform duration-200', !props.swap && 'translate-y-full')}
			>
				<span class={cn('desc-sm transition-opacity duration-300', !props.swap && 'opacity-0')}>
					{props.swap ? props.current : props.prev}
				</span>

				<span
					class={cn(
						'desc-sm absolute bottom-full left-0 transition-opacity duration-300',
						props.swap && 'opacity-0',
					)}
				>
					{props.swap ? props.prev : props.current}
				</span>
			</div>
		</>
	);
}
