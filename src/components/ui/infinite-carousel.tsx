"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface InfiniteCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: "slow" | "normal" | "fast"
}

export function InfiniteCarousel({
  children,
  className,
  speed = "normal",
  ...props
}: InfiniteCarouselProps) {
  const speedValues = {
    slow: "30s",
    normal: "20s",
    fast: "10s"
  }

  const animationDuration = speedValues[speed]

  return (
    <div
      className={cn(
        "flex w-full overflow-hidden bg-black text-white",
        className
      )}
      {...props}
    >
      <div className="animate-marquee flex whitespace-nowrap">
        {Array(12).fill(0).map((_, i) => (
          <div key={i} className="mx-4 flex items-center py-2 text-sm uppercase">
            SIGNUP <span className="mx-2">•</span> GET 10% OFF <span className="mx-2">•</span>
            <button
              onClick={() => alert("Sign up modal would open here")}
              className="ml-2 rounded-sm bg-white px-3 py-0.5 text-xs font-semibold text-black transition-colors hover:bg-black hover:text-white hover:outline hover:outline-1 hover:outline-white"
            >
              JOIN
            </button>
          </div>
        ))}
      </div>
    </div>
  )
} 