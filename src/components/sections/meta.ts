import { cva } from "class-variance-authority";

export const container = cva("", {
  variants: {
    intent: {
      inner: "xl:max-w-inner px-inset xl:mx-auto",
      outer: "2xl:max-w-outer px-inset 2xl:mx-auto",
      fill: "max-w-full",
      display: "max-w-[calc(var(--spacing-outer-span)+30rem)] xl:mx-auto",
    },
    spaced: {
      false: null,
      true: "my-30",
    },
  },
  defaultVariants: {
    intent: "outer",
    spaced: false,
  },
});


export const imageCover = cva("object-cover h-full select-none", {
  variants: {
    intent: {
      true: "min-w-0 hover:flex-5 flex-1 duration-800",
      false: "",
    },
  },
});

export enum Pos {
  Left = 0,
  Right = 1,
}

export function swapPos(pos: Pos): Pos {
  return pos === Pos.Left ? Pos.Right : Pos.Left;
}
