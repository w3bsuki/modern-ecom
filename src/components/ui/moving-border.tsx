"use client";
import React from "react";
import { cn } from "@/lib/utils";

export function Button({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: React.ElementType;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <Component
      className={cn(
        "bg-transparent relative text-xl h-16 w-40 p-[1px] overflow-hidden group",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <ShimmerButton />
      
      <div
        className={cn(
          "relative bg-slate-900/[0.8] border border-slate-800 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-sm antialiased",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}

const ShimmerButton = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Shimmer effect */}
      <div className="absolute h-[200%] w-[50%] bg-gradient-to-r from-transparent via-white/50 to-transparent top-0 -translate-x-full animate-shimmer-loop"></div>
      
      {/* Border glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30"></div>
      </div>
    </div>
  );
};

// Define the animation in global CSS by adding this to your globals.css file
// @keyframes shimmer-loop { 0% { transform: translateX(-100%) } 100% { transform: translateX(200%) } } 
// .animate-shimmer-loop { animation: shimmer-loop 2s infinite }
