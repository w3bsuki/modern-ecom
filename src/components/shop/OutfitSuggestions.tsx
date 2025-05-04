"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, ChevronRight, ChevronLeft, ShoppingBag, Check, Heart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface OutfitItem {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  category: string;
}

interface Outfit {
  id: string;
  name: string;
  description: string;
  items: OutfitItem[];
  image: string;
}

interface OutfitSuggestionsProps {
  productId: string;
  productCategory: string;
}

// This would be fetched from an API in a real implementation
const getOutfitSuggestions = (productId: string, category: string): Outfit[] => {
  // Mock data for outfit suggestions
  return [
    {
      id: "outfit1",
      name: "Casual Weekend",
      description: "A relaxed ensemble perfect for weekend outings and casual gatherings.",
      image: "/images/outfits/outfit-1.jpg",
      items: [
        {
          id: "item1",
          name: "Classic White T-Shirt",
          price: 29.99,
          image: "/images/products/tshirt-1.jpg",
          slug: "classic-white-tshirt",
          category: "Tops"
        },
        {
          id: "item2",
          name: "Slim Fit Jeans",
          price: 59.99,
          image: "/images/products/jeans-1.jpg",
          slug: "slim-fit-jeans",
          category: "Bottoms"
        },
        {
          id: "item3",
          name: "Canvas Sneakers",
          price: 49.99,
          image: "/images/products/sneakers-1.jpg",
          slug: "canvas-sneakers",
          category: "Footwear"
        },
        {
          id: "item4",
          name: "Minimalist Watch",
          price: 89.99,
          image: "/images/products/watch-1.jpg",
          slug: "minimalist-watch",
          category: "Accessories"
        }
      ]
    },
    {
      id: "outfit2",
      name: "Office Chic",
      description: "A polished look for the workplace that balances professionalism and style.",
      image: "/images/outfits/outfit-2.jpg",
      items: [
        {
          id: "item5",
          name: "Slim Fit Blazer",
          price: 129.99,
          image: "/images/products/blazer-1.jpg",
          slug: "slim-fit-blazer",
          category: "Outerwear"
        },
        {
          id: "item6",
          name: "Oxford Button-Down Shirt",
          price: 69.99,
          image: "/images/products/shirt-1.jpg",
          slug: "oxford-button-down-shirt",
          category: "Tops"
        },
        {
          id: "item7",
          name: "Tailored Trousers",
          price: 89.99,
          image: "/images/products/trousers-1.jpg",
          slug: "tailored-trousers",
          category: "Bottoms"
        },
        {
          id: "item8",
          name: "Leather Derby Shoes",
          price: 119.99,
          image: "/images/products/shoes-1.jpg",
          slug: "leather-derby-shoes",
          category: "Footwear"
        }
      ]
    },
    {
      id: "outfit3",
      name: "Night Out",
      description: "A stylish outfit for evening events, dinner dates, or a night on the town.",
      image: "/images/outfits/outfit-3.jpg",
      items: [
        {
          id: "item9",
          name: "Black Denim Jacket",
          price: 89.99,
          image: "/images/products/jacket-1.jpg",
          slug: "black-denim-jacket",
          category: "Outerwear"
        },
        {
          id: "item10",
          name: "Graphic T-Shirt",
          price: 34.99,
          image: "/images/products/tshirt-2.jpg",
          slug: "graphic-tshirt",
          category: "Tops"
        },
        {
          id: "item11",
          name: "Black Skinny Jeans",
          price: 69.99,
          image: "/images/products/jeans-2.jpg",
          slug: "black-skinny-jeans",
          category: "Bottoms"
        },
        {
          id: "item12",
          name: "Leather Chelsea Boots",
          price: 149.99,
          image: "/images/products/boots-1.jpg",
          slug: "leather-chelsea-boots",
          category: "Footwear"
        }
      ]
    }
  ];
};

const OutfitSuggestions: React.FC<OutfitSuggestionsProps> = ({ productId, productCategory }) => {
  const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { addItem } = useCart();
  
  // Fetch outfit suggestions based on product ID and category
  const outfits = getOutfitSuggestions(productId, productCategory);
  const currentOutfit = outfits[currentOutfitIndex];
  
  const handleNextOutfit = () => {
    setCurrentOutfitIndex((prev) => (prev + 1) % outfits.length);
    setSelectedItems([]);
  };
  
  const handlePrevOutfit = () => {
    setCurrentOutfitIndex((prev) => (prev - 1 + outfits.length) % outfits.length);
    setSelectedItems([]);
  };
  
  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId]
    );
  };
  
  const calculateTotalPrice = () => {
    return currentOutfit.items
      .filter(item => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.price, 0);
  };
  
  const handleAddToCart = () => {
    const selectedItemsData = currentOutfit.items.filter(item => selectedItems.includes(item.id));
    
    if (selectedItemsData.length === 0) {
      toast({
        title: "Please select at least one item",
        description: "Select items from the outfit to add to your cart.",
        variant: "destructive"
      });
      return;
    }
    
    // Add each selected item to cart
    selectedItemsData.forEach(item => {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1
      });
    });
    
    toast({
      title: "Items added to cart",
      description: `${selectedItemsData.length} item(s) have been added to your cart.`,
      action: (
        <Link href="/cart" className="font-medium underline underline-offset-4">
          View Cart
        </Link>
      ),
    });
  };
  
  const handleAddAllToCart = () => {
    // Add all items in the outfit to cart
    currentOutfit.items.forEach(item => {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1
      });
    });
    
    toast({
      title: "Complete outfit added to cart",
      description: `${currentOutfit.items.length} items have been added to your cart.`,
      action: (
        <Link href="/cart" className="font-medium underline underline-offset-4">
          View Cart
        </Link>
      ),
    });
  };
  
  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm mt-8">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-lg font-semibold">Complete Your Look</h3>
        <p className="text-sm text-gray-600">Discover perfectly curated outfits to complement your style</p>
      </div>
      
      <div className="p-4">
        {/* Outfit Navigation */}
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">{currentOutfit.name}</h4>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handlePrevOutfit}
              className="h-8 w-8"
            >
              <ChevronLeft size={16} />
            </Button>
            <span className="text-sm text-gray-500">
              {currentOutfitIndex + 1} / {outfits.length}
            </span>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleNextOutfit}
              className="h-8 w-8"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
        
        {/* Outfit Description */}
        <p className="text-sm text-gray-600 mb-4">{currentOutfit.description}</p>
        
        {/* Outfit Image */}
        <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
          <Image
            src={currentOutfit.image}
            alt={currentOutfit.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-black text-white border-0">
              Complete Outfit
            </Badge>
          </div>
        </div>
        
        {/* Outfit Items */}
        <div className="space-y-2 mb-6">
          <h5 className="text-sm font-medium text-gray-900 mb-2">Items in this outfit:</h5>
          <div className="grid grid-cols-2 gap-4">
            {currentOutfit.items.map((item) => (
              <motion.div
                key={item.id}
                className={cn(
                  "p-2 border rounded-lg cursor-pointer transition-all duration-200",
                  selectedItems.includes(item.id) 
                    ? "border-black bg-black/5" 
                    : "border-gray-200 hover:border-gray-300"
                )}
                onClick={() => toggleItemSelection(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                  </div>
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center border",
                    selectedItems.includes(item.id) 
                      ? "bg-black border-black text-white" 
                      : "border-gray-300"
                  )}>
                    {selectedItems.includes(item.id) && <Check size={12} />}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Selected Items Summary */}
        {selectedItems.length > 0 && (
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">Selected items:</span>
                <span className="ml-2 text-sm text-gray-600">{selectedItems.length}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium">Total:</span>
                <span className="ml-2 text-sm font-bold">${calculateTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="default"
            className="flex-1"
            onClick={handleAddToCart}
            disabled={selectedItems.length === 0}
          >
            <ShoppingBag size={16} className="mr-2" />
            Add Selected to Cart
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleAddAllToCart}
          >
            <Plus size={16} className="mr-2" />
            Add Entire Outfit
          </Button>
        </div>
        
        {/* View Product Details */}
        <div className="mt-4 text-center">
          <Link href={`/collection/${productCategory.toLowerCase()}`} className="text-sm text-black hover:underline inline-flex items-center">
            View more outfit ideas 
            <ChevronRight size={14} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OutfitSuggestions; 