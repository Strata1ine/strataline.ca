import { cva } from "class-variance-authority";

export const nav = cva("cursor-pointer",
  {
    variants: {
      intent: {
        outline: "size-8 xl:size-10 rounded-[50%] border-solid border-black transition-[border] duration-250",
      },
      state: {
        false: "border",
        true: "border-4",
      },
    },
    defaultVariants: {
      intent: "outline",
    },
  }
)

export const action = cva(
  "rounded-lg px-6 py-2 font-serif text-md xl:text-lg font-bold cursor-pointer",
  {
    variants: {
      intent: {
        outline: "bg-white border-black border",
        fill: "bg-accent",
      },
      display: {
        default: "",
        full: "w-full text-center",
      },
    },
    defaultVariants: {
      intent: "outline",
      display: "default",
    },
  }
);
