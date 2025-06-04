import { cva } from "class-variance-authority";

export const input = cva("gap-inset flex items-center flex-1 p-5", {
  variants: {
    intent: {
      overlay: "pointer-events-none",
    },
  },
});

export const field = cva("border-accent w3c-focus flex border select-none", {
  variants: {
    intent: {
      text: "cursor-text",
      pointer: "cursor-pointer",
    },
    expanded: {
      true: "rounded-tl-lg rounded-tr-lg",
      false: "rounded-lg",
      undefined: "rounded-lg"
    }
  },
  compoundVariants: [
    {
      expanded: [true, false],
      class: "transition-[border-radius] duration-300"
    }
  ]
});

export const expanded = cva(
  "border-accent absolute z-1 top-[94%] right-0 left-0 max-h-70 overflow-y-scroll rounded-br-lg rounded-bl-lg border border-t-0 bg-white transition duration-400",
  {
    variants: {
      open: {
        true: "translate-y-0",
        false: "pointer-events-none translate-y-1/5 opacity-0"
      }
    }
  }
);
