import { cva, type VariantProps } from 'class-variance-authority';
import { type ComponentProps } from 'solid-js';

export const buttonVariants = cva(
	'touch-manipulation cursor-pointer select-none px-6 py-4 font-serif text-md xl:text-xl font-bold leading-none rounded-md',
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

export function Button(props: ComponentProps<'button'> & VariantProps<typeof buttonVariants>) {
	return (
		<button
			class={buttonVariants({
				variant: props.variant,
				display: props.display,
				class: props.class,
			})}
			{...props}
		/>
	);
}

export function Link(props: ComponentProps<'a'> & VariantProps<typeof buttonVariants>) {
	return (
		<a
			class={buttonVariants({
				variant: props.variant,
				display: props.display,
				class: props.class,
			})}
			{...props}
		/>
	);
}
