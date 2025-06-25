import { cva } from "class-variance-authority";

export const container = cva("", {
  variants: {
    intent: {
      inner: "max-w-inner md:mx-auto px-inset box-content",
      outer: "max-w-outer md:mx-auto px-inset box-content",
      display: "max-w-[calc(var(--spacing-outer-span)+30rem)] md:mx-auto box-content",
      div: "my-35",
    },
  },
});

export const heading = cva("", {
  variants: {
    intent: {
      "6xl": "font-serif text-2xl font-bold text-balance md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl",
      "5xl": "font-serif text-2xl md:text-4xl xl:text-5xl font-bold text-balance",
      "4xl": "font-serif text-xl font-semibold md:text-3xl xl:text-4xl",
      "2xl": "text-xl sm:text-bg font-semibold font-serif md:text-2xl",
      "xl": "text-md sm:text-bg font-serif md:text-xl",
    },
  },
})

export const desc = cva("", {
  variants: {
    intent: {
      base: "font-sans text-base xl:text-md",
      sm: "font-sans text-sm sm:text-base",
      label: "text-md font-serif leading-none font-semibold",
    },
  },
})

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
  Left = "left",
  Right = "right",
}

export function swapPos(pos: Pos): Pos {
  return pos === Pos.Left ? Pos.Right : Pos.Left;
}
