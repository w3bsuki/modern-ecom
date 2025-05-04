"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  Gift, 
  TruckIcon, 
  Clock, 
  ShieldCheck, 
  CreditCard
} from "lucide-react";

interface CarouselItem {
  id: number;
  icon: React.ReactNode;
  text: string;
  cta?: {
    text: string;
    action: () => void;
  };
}

export function SignupCarousel() {
  const [isPaused, setIsPaused] = React.useState(false);
  
  const handleSignUp = () => {
    // Replace with actual modal logic later
    console.log("Sign up triggered"); 
  };
  
  const carouselItems: CarouselItem[] = [
    {
      id: 1,
      icon: <Gift className="w-5 h-5" />,
      text: "Join our VIP club for exclusive rewards",
      cta: {
        text: "JOIN",
        action: handleSignUp
      }
    },
    {
      id: 2,
      icon: <TruckIcon className="w-5 h-5" />,
      text: "Free shipping on all orders over $50",
      cta: {
        text: "SHOP",
        action: handleSignUp
      }
    },
    {
      id: 3,
      icon: <Clock className="w-5 h-5" />,
      text: "Get 10% off your first order",
      cta: {
        text: "CLAIM",
        action: handleSignUp
      }
    },
    {
      id: 4,
      icon: <ShieldCheck className="w-5 h-5" />,
      text: "Secure checkout & 30-day returns",
      cta: {
        text: "LEARN",
        action: handleSignUp
      }
    },
    {
      id: 5,
      icon: <CreditCard className="w-5 h-5" />,
      text: "Buy now, pay later with Klarna",
      cta: {
        text: "INFO",
        action: handleSignUp
      }
    }
  ];
  
  // Duplicate items for infinite scrolling
  const repeatedItems = [];
  for (let i = 0; i < 3; i++) {
    repeatedItems.push(...carouselItems);
  }

  return (
    <div 
      className="bg-gradient-to-r from-black via-black/95 to-black text-white h-16 w-full relative overflow-hidden border-y border-white/30"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="h-full flex items-center justify-center">
        <div className={cn(
          "carousel-track", 
          "flex whitespace-nowrap",
          isPaused ? "paused" : ""
        )}>
          {repeatedItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className="carousel-item flex items-center flex-shrink-0 px-2">
              <div className="item-container flex items-center gap-4 px-6 h-14">
                <div className="flex items-center group">
                  {/* Icon with subtle hover animation */}
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="flex items-center justify-center w-8 h-8 mr-3 bg-white/10 rounded-full p-1.5"
                  >
                    {React.cloneElement(item.icon as React.ReactElement, { 
                      className: "w-5 h-5 text-white group-hover:text-[#f8f8f8]" 
                    })}
                  </motion.div>
                  
                  <span className="text-white text-xs md:text-sm font-medium tracking-wide mr-4 group-hover:text-[#f8f8f8]">
                    {item.text}
                  </span>
                </div>
                
                {item.cta && (
                  <div className="hidden sm:block button-wrap relative h-9 transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={item.cta.action}
                      className={cn(
                        "h-8 px-4 py-0 text-[10px] font-bold tracking-wider uppercase rounded-full",
                        "bg-transparent text-white border border-white/40 hover:bg-white hover:text-black hover:border-white",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:ring-offset-black",
                        "transition-all duration-300 ease-in-out"
                      )}
                    >
                      {item.cta.text}
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Thin White Separator */}
              <Separator orientation="vertical" className="h-6 mx-4 bg-white/20" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Edge gradients - ensuring pure black fade */}
      <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
      
      {/* Keyframes for animation */}
      <style jsx global>{`
        .carousel-track {
          animation: scroll 50s linear infinite;
        }
        
        .carousel-track.paused {
          animation-play-state: paused;
        }
                
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        
        @media (max-width: 768px) {
          .carousel-track {
            animation-duration: 30s;
          }
        }
      `}</style>
    </div>
  );
}

export default SignupCarousel; 