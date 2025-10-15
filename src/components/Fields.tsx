import { cva } from 'class-variance-authority';
import { createSignal, splitProps, type ComponentProps, type JSX } from 'solid-js';
import Asterick from '~icons/ph/asterisk-bold';
import Check from '~icons/ph/check-bold';
import Upload from '~icons/ph/upload-simple-fill';
import ImagesSquare from '~icons/ph/images-square-fill';
import Resize from '~icons/ph/arrow-line-down-fill';
import X from '~icons/ph/x-bold';
import { cn } from '@/frontend/utils';

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
				onClick={(e) => {
					if (e.currentTarget?.control instanceof HTMLButtonElement) {
						e.currentTarget.control.click();
						e.preventDefault();
					}
				}}
			>
				<span class="text-md font-serif leading-none font-semibold">{props.name}</span>
				{props.required ? <Asterick class="text-error size-3" /> : null}
			</label>

			<label class={fieldVariants({ open: !!props.open })}>{props.children}</label>
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
				<Resize class="p-inset size-12" />
			</div>
		</Label>
	);
}

function PhoneNumber(props: Input) {
	const [valid, setValid] = createSignal(false);

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

function PhotosInput(props: Input) {
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
			<span class="flex-1 text-base">{value()}</span>
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

export const fieldVariants = cva(
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

const Fields = { Input, TextArea, PhoneNumber, PhotosInput, Email };

export default Fields;
