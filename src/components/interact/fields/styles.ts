import { cva } from 'class-variance-authority';

export const inputStyles = cva('gap-inset flex items-center p-5 overflow-hidden');

export const fieldStyles = cva(
  'border-accent w3c-focus block border-1 select-none transition-[border-radius] duration-300',
  {
    variants: {
      open: {
        true: '',
        false: '',
      },
      rounded: {
        md: '',
        xl: '',
      },
      fromTop: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      { open: false, rounded: 'md', className: 'rounded-md' },
      { open: false, rounded: 'xl', className: 'rounded-xl' },

      { open: true, fromTop: false, rounded: 'md', className: 'rounded-tl-md rounded-tr-md' },
      { open: true, fromTop: false, rounded: 'xl', className: 'rounded-tl-xl rounded-tr-xl' },

      { open: true, fromTop: true, rounded: 'md', className: 'rounded-bl-md rounded-br-md' },
      { open: true, fromTop: true, rounded: 'xl', className: 'rounded-bl-xl rounded-br-xl' },
    ],
    defaultVariants: {
      open: false,
      rounded: 'md',
      fromTop: false,
    },
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
