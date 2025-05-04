"use client";

import React from "react";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  max?: number;
  className?: string;
  size?: number;
  color?: string;
  showEmpty?: boolean;
  reviewCount?: number;
}

export function Rating({
  value,
  max = 5,
  className,
  size = 16,
  color = "text-yellow-400",
  showEmpty = true,
  reviewCount,
}: RatingProps) {
  // Calculate the number of full stars, half stars, and empty stars
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      <div className={cn("flex", className)}>
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={color}
            fill="currentColor"
            size={size}
          />
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <StarHalf
            className={color}
            fill="currentColor"
            size={size}
          />
        )}

        {/* Empty stars */}
        {showEmpty &&
          Array.from({ length: emptyStars }).map((_, i) => (
            <Star
              key={`empty-${i}`}
              className="text-gray-300"
              size={size}
            />
          ))}
      </div>
      
      {reviewCount !== undefined && (
        <span className="text-sm text-muted-foreground">
          ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
        </span>
      )}
    </div>
  );
} 