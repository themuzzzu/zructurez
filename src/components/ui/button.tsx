
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground before:absolute before:inset-0 before:bg-white/10 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500 hover:shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 before:absolute before:inset-0 before:bg-white/10 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground before:absolute before:inset-0 before:bg-accent/50 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 before:absolute before:inset-0 before:bg-white/10 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500",
        ghost: "hover:bg-accent hover:text-accent-foreground relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-accent-foreground after:transition-all hover:after:w-full",
        link: "text-primary underline-offset-4 hover:underline relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-primary after:transition-all hover:after:w-full",
        glow: "bg-primary text-primary-foreground animate-button-glow hover:animate-button-pulse hover:scale-105 active:scale-95",
        "home-nav": "bg-primary text-white hover:bg-primary/90 hover:text-white transition-colors duration-200",
        "dark-nav": "bg-black hover:bg-zinc-900 text-muted-foreground rounded-md py-2 px-4 flex gap-3 items-center justify-start transition-colors w-full",
        "dark-nav-active": "bg-zinc-800 text-white rounded-md py-2 px-4 flex gap-3 items-center justify-start transition-colors w-full",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-2 py-1 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-9 w-9 sm:h-10 sm:w-10",
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
