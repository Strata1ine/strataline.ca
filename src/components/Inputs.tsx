import {
	For,
	createEffect,
	createMemo,
	createSignal,
	splitProps,
	type ComponentProps,
	type JSX,
} from 'solid-js';
import { createList } from 'solid-list';
import Popover from '@corvu/popover';
import Asterick from '~icons/ph/asterisk-bold';
import Check from '~icons/ph/check-bold';
import Upload from '~icons/ph/upload-simple-fill';
import ImagesSquare from '~icons/ph/images-square-fill';
import Resize from '~icons/ph/arrow-line-down-fill';
import NavArrow from '~icons/ph/navigation-arrow-fill';
import X from '~icons/ph/x-bold';
import { cn } from '@/frontend/utils';
import { cva } from 'class-variance-authority';

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
					!props.valid ? '-translate-y-full opacity-0' : '',
				)}
				aria-hidden={!props.valid}
				aria-label={props.valid ? 'Valid' : undefined}
			/>

			<X
				class={cn(
					'text-error size-full duration-250',
					props.valid ? '-translate-y-full opacity-0' : '',
				)}
				aria-hidden={!!props.valid}
				aria-label={!props.valid ? 'Invalid' : undefined}
			/>
		</div>
	);
}

function Label(props: Input & { id: string }) {
	return (
		<div class="relative touch-manipulation">
			<label
				class="absolute left-2 flex -translate-y-1/2 items-center gap-2 rounded-md bg-white px-3 select-none"
				for={props.id}
			>
				<span class="text-md font-serif leading-none font-semibold">{props.name}</span>
				{props.required ? <Asterick class="text-error size-3" /> : null}
			</label>

			<label class={inputVariants({ open: !!props.open })}>{props.children}</label>
		</div>
	);
}

export type Input = {
	name?: string;
	required?: boolean;
	validate?: boolean;
	open?: boolean;
	children?: JSX.Element;
};

function Input(props: Input & ComponentProps<'input'>) {
	const [local, input] = splitProps(props, ['name', 'required', 'open', 'children']);
	const id = genInput();

	return (
		<Label id={id} {...local}>
			<input class="w-full text-base focus:outline-none" id={id} {...input} />
			{local.children}
		</Label>
	);
}

export type TextArea = {
	height?: number;
	minheight?: number;
};

function TextArea(props: Input & TextArea & ComponentProps<'textarea'>) {
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
				class="w-full resize-none text-base focus:outline-none"
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

function PhoneNumber(props: Input) {
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

function Photos(props: Input) {
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

function Email(props: Input) {
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

function Select(
	props: Input & {
		items: string[];
	},
) {
	const [anim, _setAnim] = createSignal(false);
	const [prev, _setPrev] = createSignal(0);
	const [selected, _setSelected] = createSignal(0);
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
			{(popover) => {
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
						select?.children[active]?.scrollIntoView({
							block: 'nearest',
							behavior: 'instant',
						});
					},
				});

				let select: HTMLDivElement | undefined;
				const prevItem = createMemo(() => props.items[prev() ?? 0]);
				const currentItem = createMemo(() => props.items[selected() ?? 0]);

				const setSelected = (value: number) => {
					_setPrev(selected());
					_setSelected(value);
					setActive(value);
					if (selected() != prev()) {
						_setAnim(!anim());
						popover.setOpen(false);
					}
				};

				// if (popover.open && select) {
				// 	select.children[active() ?? 0]?.scrollIntoView({
				// 		block: 'center',
				// 		behavior: 'instant',
				// 	});
				// }

				return (
					<>
						<Input class="sr-only" tabindex="-1" open={popover.open} {...props}>
							<Popover.Trigger class="absolute inset-0 z-1 cursor-pointer" />
							<NavArrow class="size-8" />

							<span class="sr-only">{currentItem()}</span>
							<div
								aria-hidden="true"
								class={cn(
									'flex-1 transition-transform duration-200',
									!anim() && 'translate-y-full',
								)}
							>
								<span class={cn('desc-sm transition-opacity duration-300', !anim() && 'opacity-0')}>
									{anim() ? currentItem() : prevItem()}
								</span>
								<span
									class={cn(
										'desc-sm absolute bottom-full left-0 transition-opacity duration-300',
										anim() && 'opacity-0',
									)}
								>
									{anim() ? prevItem() : currentItem()}
								</span>
							</div>
						</Input>

						<Popover.Portal>
							<Popover.Content
								class={cn(
									'border-accent z-4 max-h-70 overflow-y-scroll border bg-white transition duration-400 select-none',
									'data-open:fade-in-0% data-open:animate-in data-closed:animate-out data-closed:fade-out-0%',
									'data-open:slide-in-from-bottom-10 data-closed:slide-out-to-bottom-10',
									menuStyles(),
								)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										setSelected(active() ?? 0);
									} else {
										onKeyDown(e);
									}
								}}
								ref={select}
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
					</>
				);
			}}
		</Popover>
	);
}

export const menuStyles = cva('border-accent', {
	variants: {
		top: {
			true: '',
			false: '',
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
		top: false,
		rounded: 'md',
	},
});

export const inputVariants = cva(
	'border-accent w3c-focus block border-1 select-none transition-[border-radius] duration-400 gap-inset flex items-center p-5 overflow-hidden',
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
				true: '',
				false: '',
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
