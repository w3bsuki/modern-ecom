"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function OrderConfirmationPage() {
  const [orderDetails, setOrderDetails] = useState({
    orderNumber: `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    orderDate: new Date().toLocaleDateString(),
    email: "customer@example.com",
  });
  
  const router = useRouter();
  
  // Redirect if the user didn't come from a checkout
  useEffect(() => {
    const hasOrderData = sessionStorage.getItem('orderCompleted');
    
    if (!hasOrderData) {
      router.push('/cart');
    } else {
      // Clear order completion flag after showing the page
      setTimeout(() => {
        sessionStorage.removeItem('orderCompleted');
      }, 1000);
    }
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-xl mx-auto text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. We've received your order and will process it right away.
        </p>
        
        <div className="bg-gray-50 border rounded-lg p-6 mb-8 text-left">
          <h2 className="font-medium mb-4 text-lg">Order Summary</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-medium">{orderDetails.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span>{orderDetails.orderDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span>{orderDetails.email}</span>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600">
              A receipt has been sent to your email. You'll receive another email when your order ships.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href="/products">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
          
          <Button asChild>
            <Link href="/">
              Back to Home
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 