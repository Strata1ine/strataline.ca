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

export const heading = cva("", {
  variants: {
    intent: {
      primary: "font-serif text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold text-balance",
    },
    spaced: {
      false: null,
      true: "mb-14",
    },
    align: {
      left: null,
      // only intended for desktop devices
      right: "sm:text-right",
    },
  },
  defaultVariants: {
    intent: "primary",
    align: "left",
    spaced: false,
  },
});

export const imageCover = cva("object-cover h-full select-none", {
  variants: {
    multiple: {
      true: "min-w-0 hover:flex-5 flex-1 duration-800",
      false: "",
    },
  },
});


export const imageVariants = cva(
  "flex justify-center contain-paint",
  {
    variants: {
      position: {
        left: "",
        right: ""
      },
      device: {
        desktop: "hidden min-h-90 h-[50vh] max-h-120 w-1/2 rounded-sm sm:flex",
        mobile: "my-4 h-65 sm:hidden"
      }
    },
    compoundVariants: [
      {
        position: "left",
        device: "mobile",
        class: "-ml-inset mr-7 rounded-tr-sm rounded-br-sm"
      },
      {
        position: "right",
        device: "mobile",
        class: "-mr-inset ml-7 rounded-tl-sm rounded-bl-sm"
      }
    ]
  }
)

export enum Pos {
  Left = 0,
  Right = 1,
}

export function swapPos(pos: Pos): Pos {
  return pos === Pos.Left ? Pos.Right : Pos.Left;
}
