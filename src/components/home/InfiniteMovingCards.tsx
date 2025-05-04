"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Product } from "../home/ProductGrid";

interface InfiniteMovingCardsProps {
  items: Product[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  title?: string;
  subtitle?: string;
}

const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  title,
  subtitle,
}: InfiniteMovingCardsProps) => {
  const [duration, setDuration] = useState(40);

  useEffect(() => {
    switch (speed) {
      case "fast":
        setDuration(20);
        break;
      case "normal":
        setDuration(40);
        break;
      case "slow":
        setDuration(60);
        break;
      default:
        setDuration(40);
    }
  }, [speed]);

  // Duplicate items to ensure smooth infinite scrolling
  const extendedItems = [...items, ...items];

  return (
    <section className="py-16 w-full">
      {(title || subtitle) && (
        <div className="container mx-auto px-4 mb-10">
          <div className="text-center mb-8">
            {title && <h2 className="text-4xl font-bold">{title}</h2>}
            {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
          </div>
        </div>
      )}

      <div className="relative overflow-hidden w-full bg-black py-10">
        <div
          className={cn(
            "flex gap-4 w-max",
            pauseOnHover && "hover:[animation-play-state:paused]"
          )}
          style={{
            animation: `scroll${direction === "left" ? "Left" : "Right"} ${duration}s linear infinite`,
          }}
        >
          {extendedItems.map((product, idx) => (
            <Link
              href={`/product/${product.slug}`}
              key={`${product.id}-${idx}`}
              className="group relative w-[350px] h-[450px] flex-shrink-0 bg-zinc-900 overflow-hidden"
            >
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 350px"
                  className="object-cover transition-all duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">${product.price.toFixed(2)}</span>
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                      {product.collection}
                    </span>
                  </div>
                </div>
                {product.isNew && (
                  <div className="absolute top-4 left-4 bg-white text-black px-3 py-1 text-sm font-bold">
                    NEW
                  </div>
                )}
                {product.isSale && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 text-sm font-bold">
                    SALE
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes scrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50%));
          }
        }
        @keyframes scrollRight {
          0% {
            transform: translateX(calc(-50%));
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
};

export default InfiniteMovingCards; 