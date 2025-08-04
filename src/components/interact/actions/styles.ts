import { cva } from 'class-variance-authority';

export const dotStyles = cva(
  'size-8 xl:size-10 rounded-[50%] border-solid border-black transition-[border] duration-250',
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


export const pillSize = 90;
export const actionStyles = cva('touch-manipulation cursor-pointer select-none', {
  variants: {
    variant: {
      text: 'px-6 py-4 font-serif text-md xl:text-xl font-bold leading-none rounded-md',
      pill: `rounded-[50%] flex size-18 sm:size-20 w-[${pillSize}px] h-[${pillSize}px]`,
    },
    background: {
      fill: 'bg-accent',
      outline: 'border-black border bg-white',
      accent: 'bg-accent-dark text-white',
    },
    display: {
      fill: 'w-full text-center',
    },
  },
  defaultVariants: {
    background: 'outline',
    variant: "text",
  },
});
