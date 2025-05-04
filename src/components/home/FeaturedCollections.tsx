import React from "react";
import Link from "next/link";
import { ArrowUpRight, Plus, ArrowRight, ShoppingBag, Heart, Eye, Star, Flame, BadgePercent, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FeaturedCollectionsClient } from "./FeaturedCollectionsClient";

interface Collection {
  id: string;
  name: string;
  image: string;
  slug: string;
}

interface FeaturedCollectionsProps {
  title?: string;
  collections: Collection[];
}

export function FeaturedCollections({
  title,
  collections,
}: FeaturedCollectionsProps) {
  // Create our data with specified categories
  const data = [
    {
      id: "sale",
      title: "SALE",
      description: "Limited time discounts on premium hats",
      href: `/collections/${collections[0]?.slug || "sale"}`,
      emoji: "👒",
      badge1: "UP TO 50% OFF",
      badge2: "LIMITED TIME",
      bgColor: "bg-white",
      textColor: "text-black",
      image: "/images/hats/placeholder.jpg"
    },
    {
      id: "hot",
      title: "HOT",
      description: "Trending styles everyone's talking about",
      href: `/collections/${collections[1]?.slug || "hot"}`,
      emoji: "🧢",
      badge1: "TRENDING NOW",
      badge2: "BESTSELLERS",
      bgColor: "bg-black",
      textColor: "text-white",
      image: "/images/hats/placeholder1.jpg"
    },
    {
      id: "new",
      title: "NEW",
      description: "Fresh arrivals and latest hat collections",
      href: `/collections/${collections[2]?.slug || "new"}`,
      emoji: "🎩",
      badge1: "JUST ARRIVED",
      badge2: "EXCLUSIVE DROPS",
      bgColor: "bg-white",
      textColor: "text-black",
      image: "/images/hats/placeholder.jpg"
    },
  ];

  // Server component that delegates interactive parts to client component
  return (
    <div className="bg-white dark:bg-gray-900 pt-8 pb-10">
      <FeaturedCollectionsClient data={data} collections={collections} />
    </div>
  );
} 