"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface CategoryCardProps {
  title: string;
  description?: string;
  image?: string;
  emoji?: string;
  href: string;
  badge?: string;
  className?: string;
  inverted?: boolean;
  priority?: boolean;
}

export function CategoryCard({
  title,
  description,
  image,
  emoji,
  href,
  badge,
  className,
  inverted = false,
  priority = false,
}: CategoryCardProps) {
  // Card color scheme based on inverted prop
  const bgColor = inverted ? "bg-white" : "bg-black";
  const textColor = inverted ? "text-black" : "text-white";
  const borderColor = inverted ? "border-black/10" : "border-white/10";
  const buttonColor = inverted 
    ? "bg-black text-white hover:bg-white hover:text-black hover:border-black" 
    : "bg-white text-black hover:bg-black hover:text-white hover:border-white";
  
  return (
    <Link
      href={href}
      className={cn(
        "group relative block w-full overflow-hidden rounded-lg transition-all duration-300",
        "aspect-[4/3] md:aspect-[3/4] lg:aspect-[4/3]",
        "border",
        borderColor,
        bgColor,
        textColor,
        "hover:shadow-lg hover:border-opacity-30",
        className
      )}
    >
      {/* Background image with overlay (if image provided) */}
      {image && (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={image}
              alt={title}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
          <div className={cn(
            "absolute inset-0 z-10",
            inverted 
              ? "bg-gradient-to-b from-white/90 via-white/70 to-white/90" 
              : "bg-gradient-to-b from-black/90 via-black/70 to-black/90"
          )}/>
        </>
      )}

      {/* Emoji background (if no image) */}
      {!image && emoji && (
        <motion.div 
          className={cn(
            "absolute -right-4 -bottom-4 text-[120px] md:text-[140px] lg:text-[160px] pointer-events-none select-none z-0",
            inverted ? "text-black/5" : "text-white/5"
          )}
          animate={{ 
            rotate: [0, 3, 0, -3, 0],
            scale: [0.98, 1.02, 0.98],
          }}
          transition={{ 
            duration: 8, 
            ease: "easeInOut", 
            repeat: Infinity,
            repeatType: "mirror" 
          }}
        >
          {emoji}
        </motion.div>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-6 z-20">
        {/* Top section */}
        <div>
          {badge && (
            <div className={cn(
              "inline-block px-2 py-1 text-xs font-medium rounded-sm mb-3",
              inverted ? "bg-black/10 text-black" : "bg-white/10 text-white"
            )}>
              {badge}
            </div>
          )}
        </div>

        {/* Bottom section */}
        <div>
          <h3 className={cn(
            "text-2xl md:text-3xl font-bold mb-1",
            textColor
          )}>
            {title}
          </h3>
          
          {description && (
            <p className={cn(
              "text-sm mb-4 max-w-[30ch] opacity-80",
              textColor
            )}>
              {description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <span className={cn(
              "text-sm font-medium",
              textColor
            )}>
              View Collection
            </span>
            <motion.div 
              className={cn(
                "flex size-8 items-center justify-center border",
                buttonColor
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUpRight className="size-4" />
            </motion.div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CategoryCard; 