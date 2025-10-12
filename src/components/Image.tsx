import { cva, type VariantProps } from 'class-variance-authority';
import type { ImageSource } from '@/schemas';

const IMAGE_CDN = import.meta.env.PUBLIC_IMAGE_CDN as string;

export type Props = {
	image: ImageSource;
	widths?: number[];
	quality?: number;
	active?: boolean;
	anim?: VariantProps<typeof imageVariants>['anim'];
};

export function Image(props: Props) {
	const quality = props.quality ?? 70;
	const widths = props.widths ?? [];

	const src = `${IMAGE_CDN}?url=${props.image.src.src}&fm=webp&q=${quality}`;

	const srcSet = widths
		.map((w) => `${IMAGE_CDN}?url=${props.image.src.src}&w=${w}&fm=webp&q=${quality} ${w}w`)
		.join(', ');

	return (
		<img
			class={imageVariants({
				anim: props.anim,
				active: props.active,
				x: props.image.x,
				y: props.image.y,
			})}
			src={src}
			alt={props.image.alt}
			srcset={srcSet}
			draggable={false}
		/>
	);
}

export const imageVariants = cva('object-cover h-full select-none', {
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

export const imageWrapperVariants = cva('contain-paint', {
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

export default Image;
