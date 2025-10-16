import { cn } from '@/frontend/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'solid-js';
import { splitProps } from 'solid-js';

export const buttonVariants = cva(
	'touch-manipulation font-bold cursor-pointer select-none px-6 py-4 font-serif text-2xl xl:text-3xl leading-none rounded-md',
	{
		variants: {
			variant: {
				fill: 'bg-accent w-full text-center',
				outline: 'border-black border bg-white',
				accent: 'bg-accent-dark text-white',
			},
		},
		defaultVariants: {
			variant: 'outline',
		},
	},
);

function Button(props: ComponentProps<'button'> & VariantProps<typeof buttonVariants>) {
	const [local, rest] = splitProps(props, ['class', 'variant']);
	const { class: className, variant } = local;
	return (
		<button
			class={cn(
				buttonVariants({
					variant,
				}),
				className,
			)}
			{...rest}
		/>
	);
}

function Link(props: ComponentProps<'a'> & VariantProps<typeof buttonVariants>) {
	const [local, rest] = splitProps(props, ['class', 'variant']);
	const { class: className, variant } = local;
	return (
		<a
			class={cn(
				buttonVariants({
					variant,
				}),
				className,
			)}
			{...rest}
		/>
	);
}

export const fabSize = 95;
export const fabVariants = cva('touch-manipulation cursor-pointer select-none', {
	variants: {
		variant: {
			pill: `rounded-[50%] flex size-18 sm:size-23 w-[${fabSize}px] h-[${fabSize}px]`,
		},
		background: {
			outline: 'border-black border bg-white',
			accent: 'bg-accent/60 border border-black backdrop-blur-md',
		},
	},
	defaultVariants: {
		background: 'outline',
		variant: 'pill',
	},
});

function Fab(props: ComponentProps<'button'> & VariantProps<typeof fabVariants>) {
	const [local, rest] = splitProps(props, ['class', 'variant', 'background']);
	const { class: className, variant, background } = local;
	return (
		<button
			class={cn(
				fabVariants({
					variant: variant,
					background: background,
				}),
				className,
			)}
			{...rest}
		/>
	);
}

const Actions = { Button, Link, Fab };
export default Actions;
