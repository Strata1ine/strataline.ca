import { cva } from "class-variance-authority";

export const cover = cva("fixed inset-0 overflow-y-auto overflow-x-clip duration-250", {
  variants: {
    intent: {
      fill: "bg-white xl:hidden",
      blur: "bg-white sm:bg-transparent sm:backdrop-blur-[5rem]",
    },
  },
  defaultVariants: {
    intent: "fill",
  },
});
