"use client";

import React from "react";
import { motion } from "framer-motion";
import CategoryCard from "@/components/ui/category-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CategoryCollectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function CategoryCollection({
  title = "Shop by Category",
  subtitle = "Explore our carefully curated categories for every occasion and style preference",
  className,
}: CategoryCollectionProps) {
  // Sample categories with emojis and descriptions
  const categories = [
    {
      title: "Caps & Snapbacks",
      description: "Casual, sporty headwear for everyday style",
      emoji: "🧢",
      href: "/collection/caps-snapbacks",
      badge: "BESTSELLERS",
    },
    {
      title: "Dad Hats",
      description: "Relaxed, unstructured caps with a lived-in look",
      emoji: "👒",
      href: "/collection/dad-hats",
      badge: "TRENDING",
      inverted: true,
    },
    {
      title: "Beanies",
      description: "Warm, snug-fitting knitted hats for colder days",
      emoji: "🧶",
      href: "/collection/beanies",
    },
    {
      title: "Fitted Caps",
      description: "Structured caps with a precise, tailored fit",
      emoji: "🎩",
      href: "/collection/fitted-caps",
      inverted: true,
    },
    {
      title: "Straw Hats",
      description: "Lightweight, breathable hats for warm weather",
      emoji: "🌞",
      href: "/collection/straw-hats",
      badge: "SUMMER ESSENTIALS",
    },
    {
      title: "Bucket Hats",
      description: "Casual, all-around brimmed hats for sun protection",
      emoji: "🎣",
      href: "/collection/bucket-hats",
      inverted: true,
    },
  ];

  // Animation variants for staggered animation
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className={cn("py-12 md:py-16 lg:py-20 px-4 md:px-6 bg-gradient-to-r from-black via-black/95 to-black border-t border-white/20 text-white", className)}>
      <div className="container mx-auto">
        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          {title && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-2 bg-black text-white border border-white/40 uppercase text-xs tracking-wider">
                Browse Categories
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">
                {title}
              </h2>
              {subtitle && (
                <p className="text-gray-300 max-w-xl mx-auto">
                  {subtitle}
                </p>
              )}
            </motion.div>
          )}
        </div>

        {/* Category grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {categories.map((category, index) => (
            <motion.div key={category.title} variants={itemVariants}>
              <CategoryCard
                title={category.title}
                description={category.description}
                emoji={category.emoji}
                href={category.href}
                badge={category.badge}
                inverted={category.inverted}
                priority={index < 4}
                className="border-white/20 hover:border-white/40"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default CategoryCollection; 