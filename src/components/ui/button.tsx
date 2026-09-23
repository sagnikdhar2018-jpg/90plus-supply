import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium tracking-wide uppercase transition-[transform,background-color,border-color,color,opacity] duration-150 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt",
  {
    variants: {
      variant: {
        primary: "bg-volt text-volt-ink hover:brightness-110 active:scale-[0.98] notch",
        ghost:
          "border border-line bg-surface/60 text-fg hover:border-volt/50 hover:text-volt active:scale-[0.98] notch",
        icon: "border border-line bg-surface text-fg hover:border-volt/50 hover:text-volt",
        text: "text-muted hover:text-fg normal-case tracking-normal",
      },
      size: {
        default: "h-11 px-5 text-xs",
        sm: "h-9 px-3 text-[11px]",
        lg: "h-12 px-6 text-sm",
        icon: "size-11 rounded-md",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
