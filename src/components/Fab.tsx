import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'solid-js';

export const fabSize = 90;
export const fabVariants = cva('touch-manipulation cursor-pointer select-none', {
	variants: {
		variant: {
			pill: `rounded-[50%] flex size-18 sm:size-20 w-[${fabSize}px] h-[${fabSize}px]`,
		},
		background: {
			fill: 'bg-accent',
			outline: 'border-black border bg-white',
			accent: 'bg-accent-dark text-white',
		},
	},
	defaultVariants: {
		background: 'outline',
		variant: 'pill',
	},
});

export default function FabButton(
	props: ComponentProps<'button'> & VariantProps<typeof fabVariants>,
) {
	return (
		<button
			class={fabVariants({
				variant: props.variant,
				background: props.background,
				class: props.class,
			})}
			{...props}
		/>
	);
}
