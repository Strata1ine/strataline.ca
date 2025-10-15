import { For, createMemo, createSignal, splitProps, type ComponentProps, type JSX } from 'solid-js';
import { createList } from 'solid-list';
import type { RootChildrenProps as PopoverProps } from '@corvu/popover';
import type { RootChildrenProps as DialogProps } from '@corvu/dialog';
import Popover from '@corvu/popover';
import Asterick from '~icons/ph/asterisk-bold';
import Check from '~icons/ph/check-bold';
import Upload from '~icons/ph/upload-simple-fill';
import ImagesSquare from '~icons/ph/images-square-fill';
import Resize from '~icons/ph/arrow-line-down-fill';
import NavArrow from '~icons/ph/navigation-arrow-fill';
import Caret from '~icons/ph/caret-down-bold';
import X from '~icons/ph/x-bold';
import { cn } from '@/frontend/utils';
import { cva } from 'class-variance-authority';

function Label(props: FieldProps & { id: string }) {
	return (
		<div class="relative touch-manipulation">
			<label
				class={cn(
					'absolute left-2 flex -translate-y-1/2 items-center gap-2 rounded-md bg-white px-3 transition-opacity select-none',
					props.top ? 'opacity-0' : 'opacity-100',
				)}
				for={props.id}
			>
				<span class="text-md font-serif leading-none font-semibold">{props.name}</span>
				{props.required ? <Asterick class="text-error size-3" /> : null}
			</label>

			<label class={inputVariants({ open: props.open, top: props.top })}>{props.children}</label>
		</div>
	);
}

export type FieldProps = {
	name?: string;
	required?: boolean;
	validate?: boolean;
	open?: boolean;
	top?: boolean;
	children?: JSX.Element;
};

function Input(props: FieldProps & ComponentProps<'input'>) {
	const [local, input] = splitProps(props, ['name', 'required', 'open', 'children', 'top']);
	const id = genInput();

	return (
		<Label id={id} {...local}>
			<input class="w-full focus:outline-none" id={id} {...input} />
			{local.children}
		</Label>
	);
}

export type TextAreaProps = {
	height?: number;
	minheight?: number;
};

function TextArea(props: FieldProps & TextAreaProps & ComponentProps<'textarea'>) {
	const [local, input] = splitProps(props, [
		'name',
		'required',
		'open',
		'children',
		'height',
		'minheight',
	]);
	const id = genInput();
	let textarea: HTMLTextAreaElement | undefined;
	const minheight = local.minheight ?? 100;

	const [height, setHeight] = createSignal(local.height ?? 100);

	let offset = 0;
	return (
		<Label id={id} {...local}>
			<textarea
				ref={textarea}
				class="w-full resize-none focus:outline-none"
				style={{
					height: `${height()}px`,
				}}
				id={id}
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
		</Label>
	);
}

function PhoneNumber(props: FieldProps) {
	const [valid, setValid] = createSignal(!props.required);

	return (
		<Input
			name={props.name ?? 'Phone number'}
			inputmode="tel"
			autocomplete="tel"
			pattern="^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$"
			placeholder="(xxx) xxx-xxxx"
			onInput={(e) => {
				let parse = e.currentTarget.value.replace(/\D/g, '');
				let pos = e.currentTarget.selectionStart || 0;

				if (parse.length == 4 || parse.length == 7) {
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
		>
			<ValidityIcon valid={valid()} />
		</Input>
	);
}

function Photos(props: FieldProps) {
	const label = 'None selected';
	const [value, setValue] = createSignal(label);

	return (
		<Input
			name="Photos"
			accept="image/*"
			multiple
			type="file"
			class="sr-only"
			onChange={(e) => {
				if (!e.currentTarget.files) return;
				if (e.currentTarget.files.length > 0) {
					setValue(`${e.currentTarget.files.length} photo(s) selected`);
				} else {
					setValue(label);
				}
			}}
			{...props}
		>
			<ImagesSquare class="size-8" />
			<span class="flex-1">{value()}</span>
			<Upload class="size-6" />
		</Input>
	);
}

function Email(props: FieldProps) {
	const [valid, setValid] = createSignal(false);
	return (
		<Input
			name={props.name ?? 'E-mail'}
			type="email"
			inputmode="email"
			autocomplete="email"
			onInput={(e) => setValid(e.currentTarget.validity.valid)}
			{...props}
		>
			<ValidityIcon valid={valid()} />
		</Input>
	);
}

type SelectProps = FieldProps & {
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
			orientation: 'vertical',
			loop: true,
			textDirection: 'ltr',
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
			<Input
				class="sr-only"
				tabindex="-1"
				open={popover.open}
				top={popover.open && top()}
				{...props}
			>
				<Popover.Trigger class="absolute inset-0 z-1 cursor-pointer" />
				<NavArrow class="size-8" />

				<SwapText current={currentItem()} prev={prevItem()} swap={swap()} />

				<Caret
					class={cn('size-6 transition-transform duration-300', popover.open ? '-rotate-180' : '')}
				/>

				<Popover.Portal>
					<Popover.Content
						class={cn(
							'border-accent z-4 max-h-70 overflow-y-scroll border bg-white transition-[border-radius] duration-400 outline-none select-none',
							'data-open:fade-in-0% data-open:animate-in data-closed:animate-out data-closed:fade-out-0%',
							top()
								? 'data-open:slide-in-from-top-10 data-closed:slide-out-to-top-10'
								: 'data-open:slide-in-from-bottom-10 data-closed:slide-out-to-bottom-10',
							menuStyles({ top: top() }),
						)}
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
									class="hover:bg-tone aria-selected:bg-tone block w-full cursor-pointer px-5 py-2"
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
			</Input>
		);
	}

	return (
		<Popover
			floatingOptions={{
				flip: true,
				offset: -1,
				size: {
					matchSize: true,
				},
			}}
		>
			{(popover) => <Menu {...popover} />}
		</Popover>
	);
}

export const menuStyles = cva('border-accent', {
	variants: {
		top: {
			true: undefined,
			false: undefined,
		},
		rounded: {
			md: '',
			xl: '',
		},
	},
	compoundVariants: [
		{
			top: false,
			rounded: 'md',
			className: 'rounded-br-md rounded-bl-md',
		},
		{
			top: false,
			rounded: 'xl',
			className: 'rounded-br-xl rounded-bl-xl',
		},
		{
			top: true,
			rounded: 'md',
			className: 'rounded-tr-md rounded-tl-md',
		},
		{
			top: true,
			rounded: 'xl',
			className: 'rounded-tr-xl rounded-tl-xl',
		},
	],
	defaultVariants: {
		rounded: 'md',
	},
});

export const inputVariants = cva(
	'border-accent w3c-focus block border-1 select-none transition-[border-radius] duration-400 gap-4 flex items-center p-5 overflow-hidden',
	{
		variants: {
			variant: {
				md: '',
				xl: '',
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

const Inputs = { Input, TextArea, PhoneNumber, Photos, Select, Email };

export default Inputs;

let counter = 0;
export const genInput = (): string => {
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
				aria-hidden={!!props.valid}
				aria-label={!props.valid ? 'Invalid' : undefined}
			/>
		</div>
	);
}

export function SwapText(props: {
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
