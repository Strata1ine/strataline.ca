import { cva } from 'class-variance-authority';
import type { Pos } from '@/schemas/pos';

export function swapNextPos(pos: Pos) {
	pos = swapPos(pos);
}

export function swapPos(pos: Pos): Pos {
	return pos === 'left' ? 'right' : 'left';
}

export const containerStyles = cva('w-full', {
	variants: {
		width: {
			inner: 'max-w-inner px-inset',
			outer: 'max-w-outer px-inset',
			display: 'max-w-[calc(var(--spacing-outer-span)+30rem)]',
		},
		center: {
			x: 'md:mx-auto',
			y: 'my-auto',
			both: 'md:mx-auto my-auto',
		},
	},
	defaultVariants: {
		center: 'x',
	},
});
