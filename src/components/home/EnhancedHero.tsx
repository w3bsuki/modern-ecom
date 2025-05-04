"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedHeroProps {
  title?: string;
  subtitle?: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  image?: string;
  align?: "left" | "right";
}

export function EnhancedHero({
  title = "Premium Hats For Every Occasion",
  subtitle = "Discover our handcrafted collection designed for style and comfort",
  primaryCta = {
    text: "Shop Collection",
    href: "/collections",
  },
  secondaryCta = {
    text: "View Bestsellers",
    href: "/collections/bestsellers",
  },
  image = "/images/hats/placeholder1.jpg",
  align = "right",
}: EnhancedHeroProps) {
  const [isPrimaryHovered, setIsPrimaryHovered] = useState(false);
  const [isSecondaryHovered, setIsSecondaryHovered] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }
    },
  };

  // Button component with hover effect
  const HeroButton = ({ 
    href, 
    children, 
    isPrimary = false,
    isHovered,
    onHoverChange,
  }: { 
    href: string; 
    children: React.ReactNode; 
    isPrimary?: boolean;
    isHovered: boolean;
    onHoverChange: (isHovered: boolean) => void;
  }) => (
    <Link 
      href={href}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      className={cn(
        "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-none transition-all duration-300",
        isPrimary 
          ? "bg-black text-white hover:bg-black/90" 
          : "bg-white text-black border border-black hover:bg-black hover:text-white"
      )}
    >
      <span className="font-medium">{children}</span>
      <motion.div
        animate={{ x: isHovered ? 4 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <ArrowRight size={16} />
      </motion.div>
    </Link>
  );

  return (
    <section className="w-full py-12 md:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className={`flex flex-col ${align === "right" ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8 md:gap-12`}>
          {/* Content Column */}
          <motion.div 
            className="md:w-1/2 space-y-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-black tracking-tight leading-tight"
              variants={itemVariants}
            >
              {title}
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-800 max-w-md"
              variants={itemVariants}
            >
              {subtitle}
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 pt-2"
              variants={itemVariants}
            >
              <HeroButton 
                href={primaryCta.href} 
                isPrimary 
                isHovered={isPrimaryHovered}
                onHoverChange={setIsPrimaryHovered}
              >
                {primaryCta.text}
              </HeroButton>
              
              <HeroButton 
                href={secondaryCta.href}
                isHovered={isSecondaryHovered}
                onHoverChange={setIsSecondaryHovered}
              >
                {secondaryCta.text}
              </HeroButton>
            </motion.div>
          </motion.div>
          
          {/* Image Column */}
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative aspect-square md:aspect-[4/5] overflow-hidden bg-gray-50">
              <Image
                src={image}
                alt="Featured hat collection"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover"
              />
              
              {/* Subtle overlay for text contrast if needed */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default EnhancedHero; 