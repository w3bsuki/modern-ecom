import React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

// Improved Heading components
export function H1({ children, className, as = "h1", ...props }: TypographyProps) {
  const Component = as;
  return (
    <Component
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl font-heading",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function H2({ children, className, as = "h2", ...props }: TypographyProps) {
  const Component = as;
  return (
    <Component
      className={cn(
        "scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 font-heading",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function H3({ children, className, as = "h3", ...props }: TypographyProps) {
  const Component = as;
  return (
    <Component
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight font-heading",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function H4({ children, className, as = "h4", ...props }: TypographyProps) {
  const Component = as;
  return (
    <Component
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight font-heading",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

// Filter specific typography with improved readability
export function FilterHeading({ 
  children, 
  className, 
  as = "h4",
  ...props 
}: TypographyProps) {
  const Component = as;
  return (
    <Component
      className={cn(
        "text-base font-medium tracking-tight text-gray-900 font-heading",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function FilterLabel({ 
  children, 
  className, 
  as = "span",
  ...props 
}: TypographyProps) {
  const Component = as;
  return (
    <Component
      className={cn(
        "text-sm font-medium text-gray-700",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function FilterValue({ 
  children, 
  className, 
  as = "span",
  ...props 
}: TypographyProps) {
  const Component = as;
  return (
    <Component
      className={cn(
        "text-sm text-gray-600",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

// Enhanced text components with better typography
export function Paragraph({ 
  children, 
  className, 
  as = "p",
  ...props 
}: TypographyProps) {
  const Component = as;
  return (
    <Component
      className={cn(
        "leading-7 [&:not(:first-child)]:mt-6 font-body",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function Lead({ 
  children, 
  className, 
  as = "p",
  ...props 
}: TypographyProps) {
  const Component = as;
  return (
    <Component
      className={cn(
        "text-xl text-muted-foreground font-body leading-relaxed",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function Large({ 
  children, 
  className, 
  as = "div",
  ...props 
}: TypographyProps) {
  const Component = as;
  return (
    <Component
      className={cn(
        "text-lg font-semibold font-heading",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function Small({ 
  children, 
  className, 
  as = "span",
  ...props 
}: TypographyProps) {
  const Component = as;
  return (
    <Component
      className={cn(
        "text-sm font-medium leading-none",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function Muted({ 
  children, 
  className, 
  as = "p",
  ...props 
}: TypographyProps) {
  const Component = as;
  return (
    <Component
      className={cn(
        "text-sm text-muted-foreground font-body",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

// Add new professional typography components
export function Blockquote({ 
  children, 
  className, 
  as = "blockquote",
  ...props 
}: TypographyProps) {
  const Component = as;
  return (
    <Component
      className={cn(
        "mt-6 border-l-2 border-primary pl-6 italic text-muted-foreground font-body",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function InlineCode({ 
  children, 
  className, 
  as = "code",
  ...props 
}: TypographyProps) {
  const Component = as;
  return (
    <Component
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function Prose({ 
  children, 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "prose prose-gray dark:prose-invert max-w-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
} 