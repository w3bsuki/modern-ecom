import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Base button styles
const baseButtonStyles = [
  "inline-flex",
  "items-center",
  "justify-center",
  "gap-2",
  "whitespace-nowrap",
  "rounded",
  "text-sm",
  "font-medium",
  "transition-all",
  "shrink-0",
  "outline-none",
  // SVG/icon styles
  "[&_svg]:pointer-events-none",
  "[&_svg:not([class*='size-'])]:size-4",
  "[&_svg]:shrink-0",
  // Focus and state styles - Enhanced for better visibility and accessibility  
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-ring",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-background",
  // Disabled state - More obvious visual feedback
  "disabled:pointer-events-none",
  "disabled:opacity-50",
  "disabled:cursor-not-allowed",
  // Invalid state
  "aria-invalid:ring-destructive/20",
  "dark:aria-invalid:ring-destructive/40",
  "aria-invalid:border-destructive",
].join(" ")

/**
 * Button component with variants for different styles and sizes
 */
const buttonVariants = cva(baseButtonStyles, {
  variants: {
    variant: {
      default: [
        "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        "active:translate-y-0.5 active:shadow-none",
        "focus-visible:bg-primary/95"
      ].join(" "),
      destructive: [
        "bg-destructive text-white shadow-xs hover:bg-destructive/90",
        "focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        "active:translate-y-0.5 active:shadow-none",
        "dark:bg-destructive/60"
      ].join(" "),
      outline: [
        "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        "active:translate-y-0.5 active:shadow-none",
        "dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
      ].join(" "),
      secondary: [
        "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        "active:translate-y-0.5 active:shadow-none"
      ].join(" "),
      ghost: [
        "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        "focus-visible:bg-accent/50"
      ].join(" "),
      link: [
        "text-primary underline-offset-4 hover:underline",
        "focus-visible:underline"
      ].join(" "),
    },
    size: {
      default: "h-9 px-4 py-2 has-[>svg]:px-3",
      sm: "h-8 rounded gap-1.5 px-3 has-[>svg]:px-2.5",
      lg: "h-10 rounded px-6 has-[>svg]:px-4",
      icon: "size-9",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

interface ButtonProps extends 
  React.ComponentProps<"button">,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

/**
 * Button component with support for different variants and sizes
 * 
 * @param className - Additional CSS classes
 * @param variant - Button style variant
 * @param size - Button size variant
 * @param asChild - Whether to render as a child component
 * @param loading - Whether button is in loading state
 */
function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  const isDisabled = disabled || loading;

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="sr-only">Loading</span>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {children}
        </>
      ) : (
        children
      )}
    </Comp>
  )
}

export { Button, buttonVariants, type ButtonProps }
