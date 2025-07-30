import { cva } from 'class-variance-authority';
import type { Pos } from "./registry";
export { type Pos };

export function swapNextPos(pos: Pos) {
  pos = swapPos(pos);
}

export function swapPos(pos: Pos): Pos {
  return pos === "left" ? "right" : "left"
}

const spaceVariants = {
  gap: {
    sm: 'gap-4 md:gap-6 xl:gap-8',
    base: 'gap-6 md:gap-8 xl:gap-11',
  },
  space: {
    base: 'space-y-20 sm:space-y-30',
  },
  padding: {
    base: 'py-7 first:pt-0 last:pb-0',
  }
};

export const spaceStyles = cva('', {
  variants: spaceVariants,
});

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
      ...spaceVariants,
    },
  },
);

export const imageStyles = cva(
  'select-none object-cover h-full',
  {
    variants: {
      anim: {
        grow: 'transition-[width] duration-700',
        zoom: 'min-w-0 transition-[flex] duration-800 flex-1 hover:flex-5',
        hover: 'transition duration-300 hover:scale-[1.05]',
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
      desktop: 'min-h-90 h-[50vh] max-h-120 w-1/2 rounded-sm flex-none',
      mobile: 'h-65',
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
      className: '-ml-inset rounded-tr-sm rounded-br-sm',
    },
    {
      pos: 'right',
      size: 'mobile',
      className: '-mr-inset rounded-tl-sm rounded-bl-sm',
    },
  ],
});
