"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, X, ArrowLeft, Trash2, Loader2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartItems, useCartSubtotal, useCartActions } from "@/hooks/use-cart";
import { toast } from "@/components/ui/use-toast";
import { useIsInWishlist } from "@/hooks/use-wishlist";
import { formatPrice } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Get cart state
  const cartItems = useCartItems();
  const subtotal = useCartSubtotal();
  const { removeItem, updateItemQuantity, clearCart, moveToWishlist } = useCartActions();
  
  // Prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Handle checkout process
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    
    try {
      // Simulate checkout process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear the cart
      clearCart();
      
      // Set a flag in session storage for the confirmation page
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('orderCompleted', 'true');
      }
      
      // Show success toast
      toast({
        title: "Order Placed!",
        description: "Your order has been successfully placed.",
      });
      
      // Redirect to success page
      router.push("/checkout/success");
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };
  
  if (!isMounted) {
    return null; // Prevent hydration issues
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <ShoppingBag className="mr-2 h-6 w-6" />
        Your Cart
      </h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="flex justify-center">
            <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
          </div>
          <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button asChild>
            <Link href="/">
              Continue Shopping
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItem 
                  key={`${item.id}-${item.selectedSize}`} 
                  item={item}
                  onRemove={() => removeItem(item.id, item.selectedSize)}
                  onUpdateQuantity={(quantity) => 
                    updateItemQuantity(item.id, quantity, item.selectedSize)
                  }
                  onMoveToWishlist={() => moveToWishlist(item.id, item.selectedSize)}
                />
              ))}
            </div>
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center" 
                asChild
              >
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="border rounded-lg p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              
              <Button 
                className="w-full mt-4" 
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Checkout"
                )}
              </Button>
              
              <Button
                variant="ghost"
                className="w-full mt-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => clearCart()}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    salePrice?: number | null;
    image: string;
    selectedSize: string | null;
    quantity: number;
  };
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
  onMoveToWishlist: () => void;
}

function CartItem({ item, onRemove, onUpdateQuantity, onMoveToWishlist }: CartItemProps) {
  const isInWishlist = useIsInWishlist(item.id);
  
  return (
    <div className="flex border p-4 rounded-lg">
      <div className="relative h-24 w-24 rounded overflow-hidden bg-gray-100">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="ml-4 flex-1">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm text-gray-500">
              Size: {item.selectedSize || "One Size"}
            </p>
          </div>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onMoveToWishlist}
                    disabled={isInWishlist}
                    className={cn(
                      "text-gray-400 hover:text-gray-500 p-1",
                      isInWishlist && "opacity-50 cursor-not-allowed"
                    )}
                    aria-label={isInWishlist ? "Already in wishlist" : "Save for later"}
                  >
                    <Heart className={cn(
                      "h-5 w-5",
                      isInWishlist && "fill-red-500 text-red-500"
                    )} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {isInWishlist ? "Already in wishlist" : "Save for later"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <button
              onClick={onRemove}
              className="text-gray-400 hover:text-gray-500"
              aria-label={`Remove ${item.name} from cart`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="mt-2 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (item.quantity > 1) {
                  onUpdateQuantity(item.quantity - 1);
                }
              }}
              className="h-8 w-8 flex items-center justify-center border rounded-md"
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-8 text-center">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              className="h-8 w-8 flex items-center justify-center border rounded-md"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          
          <div className="font-medium">
            {item.salePrice 
              ? (
                <div className="flex flex-col items-end">
                  <span>{formatPrice(item.salePrice * item.quantity)}</span>
                  <span className="text-xs text-gray-500 line-through">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ) 
              : formatPrice(item.price * item.quantity)}
          </div>
        </div>
      </div>
    </div>
  );
} 