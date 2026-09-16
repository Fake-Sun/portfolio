"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// shadcn's Base UI composition, with the portfolio's own visual variants.
export const buttonVariants = cva("ui-button", {
  variants: {
    variant: {
      default: "ui-button--primary",
      outline: "ui-button--outline",
      ghost: "ui-button--ghost"
    },
    size: {
      default: "ui-button--default",
      sm: "ui-button--sm",
      icon: "ui-button--icon"
    }
  },
  defaultVariants: { variant: "default", size: "default" }
});

export function Button({ className, variant, size, ...props }: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return <ButtonPrimitive data-slot="button" className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
