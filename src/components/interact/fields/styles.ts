import { cva } from 'class-variance-authority';

export const inputStyles = cva('gap-inset flex items-center p-5 overflow-hidden');

export const fieldStyles = cva(
  'border-accent w3c-focus block border select-none',
  {
    variants: {
      open: {
        true: 'rounded-tl-lg rounded-tr-lg',
        false: 'rounded-lg',
        undefined: 'rounded-lg',
      },
    },
    compoundVariants: [
      {
        open: [true, false],
        className: 'transition-[border-radius] duration-300',
      },
    ],
  },
);

export const menuStyles = cva(
  'border-accent absolute z-1 top-full right-0 left-0 max-h-70 overflow-y-scroll rounded-br-lg rounded-bl-lg border border-t-0 bg-white transition duration-400',
  {
    variants: {
      open: {
        true: '',
        false: 'pointer-events-none translate-y-1/5 opacity-0',
      },
    },
  },
);
