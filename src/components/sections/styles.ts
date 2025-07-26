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
        'font-serif text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-balance',
      '4xl': 'font-serif text-xl font-semibold md:text-3xl xl:text-4xl',
      '3xl': 'font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl',
      '2xl': 'text-lg font-semibold font-serif md:text-2xl',
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

export const imageStyles = cva(
  'select-none h-full object-cover',
  {
    variants: {
      anim: {
        grow: 'transition-[width] duration-700',
        zoom: 'min-w-0 transition-[flex] duration-800 flex-1 hover:flex-5',
      },
      active: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      { anim: 'grow', active: true, class: 'w-full' },
      { anim: 'grow', active: false, class: 'w-0' },
    ],
    defaultVariants: {
      active: false,
    },
  },
);

export const imageWrapperStyles = cva('contain-paint', {
  variants: {
    pos: {
      left: '',
      right: '',
    },

    size: {
      desktop: 'min-h-90 h-[50vh] max-h-120 w-1/2 rounded-sm',
      mobile: 'my-4 h-65',
    },

    display: {
      md: 'hidden sm:flex sm:justify-center',
      sm: 'flex justify-center sm:hidden',
    },
  },

  compoundVariants: [
    {
      pos: 'left',
      size: 'mobile',
      className: '-ml-inset mr-7 rounded-tr-sm rounded-br-sm',
    },
    {
      pos: 'right',
      size: 'mobile',
      className: '-mr-inset ml-7 rounded-tl-sm rounded-bl-sm',
    },
  ],
});
