import { cn } from '@/frontend/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { splitProps, type ComponentProps } from 'solid-js';

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

function Button(props: ComponentProps<'button'> & VariantProps<typeof buttonVariants>) {
	const [local, rest] = splitProps(props, ['class', 'variant', 'display']);

	return (
		<button
			class={cn(
				buttonVariants({
					variant: local.variant,
					display: local.display,
				}),
				local.class,
			)}
			{...rest}
		/>
	);
}

function Link(props: ComponentProps<'a'> & VariantProps<typeof buttonVariants>) {
	const [local, rest] = splitProps(props, ['class', 'variant', 'display']);

	return (
		<a
			class={cn(
				buttonVariants({
					variant: local.variant,
					display: local.display,
				}),
				local.class,
			)}
			{...rest}
		/>
	);
}

const Actions = Object.assign(Button, {
	Link,
	Button,
});

export default Actions;
