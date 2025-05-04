"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  targetId: string;
  children?: React.ReactNode;
}

export function SkipLink({
  targetId,
  children = "Skip to content",
  className,
  ...props
}: SkipLinkProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  
  // Ensure the target ID has a # prefix
  const href = targetId.startsWith('#') ? targetId : `#${targetId}`;
  
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50",
        "bg-background text-foreground px-4 py-2 rounded-md shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-ring",
        className
      )}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...props}
    >
      {children}
    </a>
  );
} 