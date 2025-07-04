import { cva } from "class-variance-authority";

export const cover = cva("fixed inset-0 overflow-y-auto overflow-x-clip duration-250", {
  variants: {
    intent: {
      fill: "bg-white",
      blur: "bg-white sm:bg-transparent sm:backdrop-blur-[5rem]",
    },
    active: {
      true: "",
      false: "pointer-events-none opacity-0"
    },
    overlay: {
      true: "z-3",
      false: "z-1",
    },
  },
  defaultVariants: {
    intent: "fill",
  },
});
