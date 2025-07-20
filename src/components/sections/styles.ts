import { cva } from 'class-variance-authority';

export const containerStyles = cva(
  'md:mx-auto box-content',
  {
    variants: {
      width: {
        inner: 'max-w-inner px-inset',
        outer: 'max-w-outer px-inset',
        display:
          'max-w-[calc(var(--spacing-outer-span)+30rem)]',
      },
    },
  },
);

export const headingStyles = cva('', {
  variants: {
    size: {
      '6xl':
        'font-serif text-2xl font-bold text-balance md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl',
      '5xl':
        'font-serif text-2xl md:text-4xl xl:text-5xl font-bold text-balance',
      '4xl': 'font-serif text-xl font-semibold md:text-3xl xl:text-4xl',
      '2xl': 'text-xl font-semibold font-serif md:text-2xl',
      xl: 'text-md sm:text-bg font-serif md:text-xl',
    },
  },
});

export const descStyles = cva('font-sans', {
  variants: {
    size: {
      base: 'text-base xl:text-md',
      sm: 'text-sm sm:text-base',
      md: 'text-md',
    },
    role: {
      label: 'font-serif font-semibold leading-none',
    },
  },
  defaultVariants: {
    size: 'base',
  },
});

export const imageStyles = cva('object-cover h-full select-none', {
  variants: {
    layout: {
      divided: 'min-w-0 hover:flex-5 flex-1 duration-800',
    },
  },
});

export const imageWrapperStyles = cva(
  'flex justify-center contain-paint',
  {
    variants: {
      position: { left: '', right: '' },
      device: {
        desktop:
          'hidden min-h-90 h-[50vh] max-h-120 w-1/2 rounded-sm sm:flex',
        mobile: 'my-4 h-65 sm:hidden',
      },
    },
    compoundVariants: [
      {
        position: 'left',
        device: 'mobile',
        className:
          '-ml-inset mr-7 rounded-tr-sm rounded-br-sm',
      },
      {
        position: 'right',
        device: 'mobile',
        className:
          '-mr-inset ml-7 rounded-tl-sm rounded-bl-sm',
      },
    ],
  },
);

export enum Pos {
  Left = "left",
  Right = "right",
}

export function swapPos(pos: Pos): Pos {
  return pos === Pos.Left ? Pos.Right : Pos.Left;
}
