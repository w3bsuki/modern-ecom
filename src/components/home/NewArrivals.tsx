"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, StarIcon, ShoppingBag, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

// Mock data for new arrivals - in a real app, this would come from an API or database
const newArrivals = [
  {
    id: "na1",
    name: "Classic Fedora",
    price: 59.99,
    image: "/images/hats/placeholder1.jpg",
    slug: "classic-fedora",
    category: "Fedoras",
    isNew: true,
    inStock: true,
  },
  {
    id: "na2",
    name: "Summer Straw Hat",
    price: 45.99,
    image: "/images/hats/placeholder1.jpg",
    slug: "summer-straw-hat",
    category: "Summer",
    isNew: true,
    inStock: true,
  },
  {
    id: "na3",
    name: "Vintage Bowler",
    price: 79.99,
    image: "/images/hats/placeholder1.jpg",
    slug: "vintage-bowler",
    category: "Bowlers",
    isNew: true,
    inStock: true,
  },
  {
    id: "na4",
    name: "Modern Snapback",
    price: 34.99,
    image: "/images/hats/placeholder1.jpg",
    slug: "modern-snapback",
    category: "Snapbacks",
    isNew: true,
    inStock: true,
  },
];

export function NewArrivals() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-2 bg-white text-gray-900 border border-gray-200 uppercase text-xs tracking-wider">
              Just Arrived
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white">New Arrivals</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-lg">
              Check out our latest additions to the collection, featuring fresh styles and premium quality.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 md:mt-0"
          >
            <Button 
              variant="outline" 
              className="border-gray-200 text-gray-900 hover:border-gray-400 hover:bg-transparent"
              asChild
            >
              <Link href="/collections?sort=newest" className="flex items-center gap-2">
                View All New Arrivals
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product, index) => (
            <NewArrivalCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface NewArrivalCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
    category: string;
    isNew: boolean;
    inStock: boolean;
  };
  index: number;
}

function NewArrivalCard({ product, index }: NewArrivalCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem(product, null, 1);
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group"
    >
      <Link 
        href={`/product/${product.slug}`}
        className="block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={cn(
              "object-cover transition-transform duration-500",
              isHovered ? "scale-110" : "scale-100"
            )}
          />
          
          {/* New badge */}
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-white text-gray-900 border border-gray-200 uppercase text-xs tracking-wider">
              New
            </Badge>
          </div>
          
          {/* Quick add button */}
          <div 
            className={cn(
              "absolute bottom-0 inset-x-0 flex justify-center p-3 bg-gradient-to-t from-black/60 to-transparent",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            )}
          >
            <Button 
              size="sm" 
              className="w-full bg-white text-black hover:bg-white/90"
              onClick={handleQuickAdd}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Quick Add
            </Button>
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {product.category}
          </div>
          <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>
          <div className="mt-1 font-semibold text-gray-800 dark:text-gray-200">
            {formatPrice(product.price)}
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 