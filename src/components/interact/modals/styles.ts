import { cva } from 'class-variance-authority';

export const modalStyles = cva(
  'fixed inset-0 overflow-y-auto overflow-x-clip duration-250',
  {
    variants: {
      background: {
        fill: 'bg-white',
        blur: 'bg-white sm:bg-transparent sm:backdrop-blur-[5rem]',
      },
      open: {
        true: '',
        false: 'pointer-events-none opacity-0',
      },
      overlay: {
        true: 'z-3',
        false: '',
      },
    },
    defaultVariants: {
      background: 'fill',
    },
  },
);
