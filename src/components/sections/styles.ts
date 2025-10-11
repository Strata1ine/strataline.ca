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

export const imageStyles = cva('object-cover h-full select-none', {
	variants: {
		anim: {
			fade: 'transition-[opacity] duration-1000 absolute w-full',
			zoom: 'min-w-0 transition-[flex] duration-800 flex-1 hover:flex-5',
			hover: 'transition duration-300 hover:scale-[1.05]',
		},
		active: {
			true: '',
			false: '',
		},
		x: {
			left: 'object-left',
			right: 'object-right',
		},
		y: {
			top: 'object-top',
			bottom: 'object-bottom',
		},
	},
	compoundVariants: [
		{ anim: 'fade', active: true, class: 'opacity-100' },
		{ anim: 'fade', active: false, class: 'opacity-0' },
	],
	defaultVariants: {
		active: false,
	},
});

export const imageWrapperStyles = cva('contain-paint', {
	variants: {
		pos: {
			left: '',
			right: '',
		},

		size: {
			lg: 'min-h-90 h-[60vh] max-h-150 flex-none',
			md: 'min-h-100 h-[45vh] max-h-150 flex-none',
			sm: 'h-svh max-h-65',
			xs: 'h-[30vw] min-h-30 sm:h-65',
		},

		display: {
			md: 'hidden sm:flex sm:justify-center',
			sm: 'flex justify-center sm:hidden',
		},
	},

	compoundVariants: [
		{
			pos: 'left',
			size: 'sm',
			className: '-ml-inset rounded-tr-sm rounded-br-sm',
		},
		{
			pos: 'right',
			size: 'sm',
			className: '-mr-inset rounded-tl-sm rounded-bl-sm',
		},
	],
});
