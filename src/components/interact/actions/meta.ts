import { cva } from "class-variance-authority";

export const nav = cva("cursor-pointer",
  {
    variants: {
      intent: {
        outline: "w-8 h-8 xl:h-10 xl:w-10 rounded-[50%] border-solid border-black transition-[border] duration-250",
      },
      state: {
        false: "border-1",
        true: "border-4",
      },
    },
    defaultVariants: {
      intent: "outline",
    },
  }
)

export const action = cva(
  "rounded-lg px-5 py-2 xl:px-7 xl:py-4 font-serif text-bg xl:text-lg font-bold cursor-pointer",
  {
    variants: {
      intent: {
        outline: "bg-white border-black border-1",
        fill: "bg-accent",
      },
      display: {
        table: "table",
        full: "w-full text-center",
      },
    },
    defaultVariants: {
      intent: "outline",
      display: "table",
    },
  }
);
