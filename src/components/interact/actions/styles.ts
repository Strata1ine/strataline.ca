import { cva } from 'class-variance-authority';

export const dotStyles = cva(
  'size-8 xl:size-10 rounded-[50%] border-solid border-black transition-[border] duration-250 touch-manipulation cursor-pointer',
  {
    variants: {
      open: {
        true: 'border-4',
        false: 'border',
      },
    },
    defaultVariants: {
      open: false,
    },
  },
);


export const Styles = cva(
  'size-8 xl:size-10 rounded-[50%] border-solid border-black transition-[border] duration-250 touch-manipulation cursor-pointer',
  {
    variants: {
      open: {
        true: 'border-4',
        false: 'border',
      },
    },
    defaultVariants: {
      open: false,
    },
  },
);

export const actionStyles = cva(
  'rounded-lg px-6 py-2 font-serif text-md xl:text-lg font-bold cursor-pointer',
  {
    variants: {
      background: {
        fill: 'bg-accent',
        outline: 'bg-white border-black border',
      },
      display: {
        fill: 'w-full text-center',
      },
    },
    defaultVariants: {
      background: 'outline',
    },
  },
);
