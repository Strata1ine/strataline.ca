import { cva, type VariantProps } from 'class-variance-authority';
import type { ImageSource } from '@/schemas';
import { cn } from '@/frontend/utils';

const IMAGE_CDN = import.meta.env.PUBLIC_IMAGE_CDN as string;

export type Props = {
	image: ImageSource;
	class?: string;
	widths?: number[];
	quality?: number;
	active?: boolean;
	pos?: VariantProps<typeof imageRoundedVariants>['pos'];
	anim?: VariantProps<typeof imageVariants>['anim'];
	loading?: 'eager' | 'lazy';
};

const DEFAULT_QUALITY = 70;

export function optImage(path: string, widths?: number[], quality?: number) {
	const src = `${IMAGE_CDN}?url=${path}&fm=webp&q=${quality ?? DEFAULT_QUALITY}`;
	const srcSet = (widths ?? [])
		.map((w) => `${IMAGE_CDN}?url=${path}&w=${w}&fm=webp&q=${quality} ${w}w`)
		.join(', ');

	return { src, srcSet };
}

export function Image(props: Props) {
	const quality = props.quality ?? DEFAULT_QUALITY;
	const widths = props.widths ?? [];

	const { src, srcSet } = optImage(props.image.src.src, widths, quality);

	return (
		<img
			class={cn(
				imageVariants({
					anim: props.anim,
					active: props.active,
					x: props.image.x,
					y: props.image.y,
				}),
				props.pos ? imageRoundedVariants({ pos: props.pos }) : undefined,
				props.class,
			)}
			src={src}
			alt={props.image.alt}
			srcset={srcSet}
			draggable={false}
			loading={props.loading ?? 'lazy'}
		/>
	);
}

export const imageVariants = cva('object-cover w-full h-full select-none', {
	variants: {
		anim: {
			fade: 'transition-[opacity] duration-1000 absolute',
			zoom: 'min-w-0 transition-[flex] duration-800 flex-1 hover:flex-5',
			hover: 'transition-[scale] duration-300 hover:scale-[1.05]',
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

export const imageRoundedVariants = cva('sm:rounded-md', {
	variants: {
		pos: {
			left: '',
			right: '',
		},
	},
	compoundVariants: [
		{
			pos: 'left',
			className: 'rounded-tl-sm rounded-bl-sm translate-x-inset sm:translate-none',
		},
		{
			pos: 'right',
			className: 'rounded-tr-sm rounded-br-sm -translate-x-inset sm:translate-none',
		},
	],
});

export default Image;
