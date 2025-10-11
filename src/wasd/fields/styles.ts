import { cva } from 'class-variance-authority';

export const inputStyles = cva('gap-inset flex items-center p-5 overflow-hidden');

export const fieldStyles = cva(
	'border-accent w3c-focus block border-1 select-none transition-[border-radius] duration-400',
	{
		variants: {
			open: {
				true: '',
				false: '',
			},
			rounded: {
				md: '',
				xl: '',
			},
			top: {
				true: '',
				false: '',
			},
		},
		compoundVariants: [
			{ open: false, rounded: 'md', className: 'rounded-md' },
			{ open: false, rounded: 'xl', className: 'rounded-xl' },

			{ open: true, top: false, rounded: 'md', className: 'rounded-tl-md rounded-tr-md' },
			{ open: true, top: false, rounded: 'xl', className: 'rounded-tl-xl rounded-tr-xl' },

			{ open: true, top: true, rounded: 'md', className: 'rounded-bl-md rounded-br-md' },
			{ open: true, top: true, rounded: 'xl', className: 'rounded-bl-xl rounded-br-xl' },
		],
		defaultVariants: {
			open: false,
			rounded: 'md',
			top: false,
		},
	},
);

export const menuButton = cva('block w-full cursor-pointer px-5 py-2 overflow-hidden', {
	variants: {
		hover: {
			true: 'bg-tone',
			false: '',
		},
	},
});

export const menuStyles = cva(
	'border-accent absolute z-1 border bg-white transition duration-400 right-0 left-0 select-none',
	{
		variants: {
			open: {
				true: '',
				false: '',
			},
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
				open: false,
				top: false,
				className: 'pointer-events-none translate-y-1/5 opacity-0',
			},
			{
				open: false,
				top: true,
				className: 'pointer-events-none -translate-y-1/5 opacity-0',
			},
			{
				top: false,
				rounded: 'md',
				className: 'top-full rounded-br-md rounded-bl-md border-t-0',
			},
			{
				top: false,
				rounded: 'xl',
				className: 'top-full rounded-br-xl rounded-bl-xl border-t-0',
			},
			{
				top: true,
				rounded: 'md',
				className: 'bottom-full rounded-tr-md rounded-tl-md border-b-0',
			},
			{
				top: true,
				rounded: 'xl',
				className: 'bottom-full rounded-tr-xl rounded-tl-xl border-b-0',
			},
		],
		defaultVariants: {
			open: false,
			top: false,
			rounded: 'md',
		},
	},
);
