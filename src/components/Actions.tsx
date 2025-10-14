import { cn } from '@/frontend/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'solid-js';

export const buttonVariants = cva(
	'touch-manipulation cursor-pointer select-none px-6 py-4 font-serif text-2xl xl:text-3xl font-bold leading-none rounded-md',
	{
		variants: {
			variant: {
				fill: 'bg-accent',
				outline: 'border-black border bg-white',
				accent: 'bg-accent-dark text-white',
			},
			display: {
				fill: 'w-full text-center',
			},
		},
		defaultVariants: {
			variant: 'outline',
		},
	},
);

function Button(props: ComponentProps<'button'> & VariantProps<typeof buttonVariants>) {
	const { class: className, variant, display, ...rest } = props;
	return (
		<button
			class={cn(
				buttonVariants({
					variant,
					display,
				}),
				className,
			)}
			{...rest}
		/>
	);
}

function Link(props: ComponentProps<'a'> & VariantProps<typeof buttonVariants>) {
	const { class: className, variant, display, ...rest } = props;
	return (
		<a
			class={cn(
				buttonVariants({
					variant,
					display,
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
	const { class: className, variant, background, ...rest } = props;
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

const Actions = Object.assign(Button, {
	Link,
	Button,
	Fab,
});

export default Actions;
