import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-[14px] font-bold tracking-[0.5px] leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:bg-primary-disabled disabled:text-muted rounded-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-on-primary hover:bg-primary-active",
        destructive: "bg-error text-white hover:bg-error/90",
        outline: "border border-hairline-strong bg-canvas text-ink hover:bg-surface-soft",
        secondary: "bg-canvas text-ink hover:bg-surface-soft border border-hairline",
        ghost: "hover:bg-surface-soft text-ink",
        link: "text-primary hover:underline",
        'text-link': "bg-transparent text-ink text-[13px] uppercase tracking-[1.5px] hover:text-primary",
        'secondary-on-dark': "bg-transparent text-on-dark border border-on-dark hover:bg-surface-dark-elevated",
      },
      size: {
        default: "h-[48px] px-[32px] py-[14px]",
        sm: "h-[40px] px-[16px]",
        lg: "h-[56px] px-[40px]",
        icon: "h-[48px] w-[48px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
