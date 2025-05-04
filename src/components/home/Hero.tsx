"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Sparkles, Shuffle, ArrowLeft, X } from "lucide-react";
import SignupCarousel from "./SignupCarousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// Types
interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
}

interface HeroButtonProps {
  href: string;
  children: React.ReactNode;
  isHovered: boolean;
  setIsHovered: (value: boolean) => void;
  primary?: boolean;
  icon?: React.ReactNode;
}

interface OptionColumnProps {
  title: string;
  subtitle: string;
  optionLabel: string;
  imageSrc: string;
  ctaHref: string;
  isHovered: boolean;
  setIsHovered: (value: boolean) => void;
  fadeInDelay: number;
  discount?: string;
  tag?: string;
}

interface Suggestion {
  text: string;
  probability: number;
}

// Component for animated hero buttons
const HeroButton = ({ 
  href, 
  children, 
  isHovered, 
  setIsHovered, 
  primary = false,
  icon = <ArrowRight className="ml-2 h-5 w-5" />
}: HeroButtonProps) => (
  <div className="relative">
    <motion.div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial="initial"
      whileHover="hover"
      whileTap={{ scale: 0.95 }}
    >
      <Link href={href} className="block">
        <div className="relative overflow-hidden">
          <div className={cn(
            "py-4 px-8 flex items-center justify-between rounded-md shadow-md",
            primary ? "bg-white" : "bg-black border border-white/20"
          )}>
            <motion.span 
              className={cn(
                "uppercase font-bold tracking-wider text-sm md:text-base relative z-10",
                primary ? "text-black" : "text-white"
              )}
              animate={{
                color: isHovered ? (primary ? "#FFFFFF" : "#000000") : (primary ? "#000000" : "#FFFFFF"),
              }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.span>
            
            <motion.div
              animate={{
                x: isHovered ? 5 : 0,
                color: isHovered ? (primary ? "#FFFFFF" : "#000000") : (primary ? "#000000" : "#FFFFFF")
              }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              {icon}
            </motion.div>
          </div>
          
          <motion.div 
            className={cn(
              "absolute inset-0 origin-left rounded-md",
              primary ? "bg-black" : "bg-white"
            )}
            initial={{ scaleX: 0 }}
            animate={{
              scaleX: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.div 
            className={cn(
              "absolute inset-0 border-2 rounded-md",
              primary ? "border-white" : "border-black"
            )}
            initial={{ opacity: 0 }}
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Corner accents */}
          {[
            { position: "top-0 left-0", transform: { x: -5, y: -5 } },
            { position: "top-0 right-0", transform: { x: 5, y: -5 } },
            { position: "bottom-0 left-0", transform: { x: -5, y: 5 } },
            { position: "bottom-0 right-0", transform: { x: 5, y: 5 } }
          ].map((corner, index) => {
            const isTop = corner.position.includes("top");
            const isLeft = corner.position.includes("left");
            
            return (
              <motion.div
                key={index}
                className={cn(
                  "absolute h-[8px] w-[8px]",
                  isTop ? "border-t-2" : "border-b-2",
                  isLeft ? "border-l-2" : "border-r-2",
                  corner.position,
                  primary ? "border-white" : "border-black"
                )}
                initial={{ opacity: 0, x: corner.transform.x, y: corner.transform.y }}
                animate={{ 
                  opacity: isHovered ? 1 : 0,
                  x: isHovered ? 0 : corner.transform.x,
                  y: isHovered ? 0 : corner.transform.y,
                }}
                transition={{ duration: 0.3 }}
              />
            );
          })}
        </div>
      </Link>
    </motion.div>
  </div>
);

// Component for option columns
const OptionColumn = ({ 
  title, 
  subtitle, 
  optionLabel, 
  imageSrc, 
  ctaHref, 
  isHovered, 
  setIsHovered, 
  fadeInDelay,
  discount,
  tag
}: OptionColumnProps) => (
  <div className="relative h-[500px] md:h-[650px] flex flex-col justify-end items-center text-center px-6 md:px-12 pb-12 md:pb-16 z-10 overflow-hidden group">
    {/* Background image with overlay */}
    <div className="absolute inset-0 z-0">
      <Image 
        src={imageSrc} 
        alt={title} 
        fill 
        sizes="(max-width: 768px) 100vw, 50vw"
        priority={fadeInDelay === 0}
        style={{ objectFit: 'cover' }}
        className="brightness-[0.85] transition-transform duration-700 ease-out group-hover:scale-110 group-hover:brightness-[0.9]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30 transition-opacity duration-500 group-hover:opacity-90"></div>
    </div>
    
    {/* Discount tag if available */}
    {discount && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: fadeInDelay + 0.1 }}
        className="absolute top-6 right-6 bg-white text-black font-bold px-4 py-2 rounded-full shadow-lg z-20"
      >
        {discount}
      </motion.div>
    )}
    
    {/* Collection tag if available */}
    {tag && (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: fadeInDelay + 0.2 }}
        className="absolute top-6 left-6 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/20 shadow-lg z-20 text-sm"
      >
        {tag}
      </motion.div>
    )}
    
    {/* Text content with animations */}
    <div className="relative z-10 text-white max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: fadeInDelay, ease: [0.22, 1, 0.36, 1] }}
        className="mb-3 flex justify-center"
      >
        <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-white/10 backdrop-blur-sm text-white rounded border border-white/20">
          {optionLabel}
        </span>
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: fadeInDelay + 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
      >
        {title}
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: fadeInDelay + 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="text-base md:text-lg text-gray-200 mb-8 mx-auto max-w-md"
      >
        {subtitle}
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: fadeInDelay + 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex justify-center"
      >
        <HeroButton 
          href={ctaHref} 
          isHovered={isHovered} 
          setIsHovered={setIsHovered}
          primary
          icon={<ShoppingBag className="ml-2 h-5 w-5" />}
        >
          {`Shop ${optionLabel.split(' ')[1]}`}
        </HeroButton>
      </motion.div>
    </div>
  </div>
);

// Dialog Content component for "Can't Decide" modal
const SuggestionDialog = ({
  isSpinning,
  suggestion,
  getRandomSuggestion,
  setIsDialogOpen
}: {
  isSpinning: boolean;
  suggestion: string | null;
  getRandomSuggestion: () => void;
  setIsDialogOpen: (isOpen: boolean) => void;
}) => (
  <div className="flex flex-col items-center justify-center p-6 pt-6">
    {isSpinning ? (
      <SpinningLoader />
    ) : suggestion ? (
      <SuggestionDisplay suggestion={suggestion} />
    ) : (
      <EmptySuggestion />
    )}
    
    <div className="flex flex-col w-full gap-4">
      <SuggestionButton 
        onClick={getRandomSuggestion} 
        isSpinning={isSpinning} 
        suggestion={suggestion} 
      />
      
      {suggestion && <ShopButtons setIsDialogOpen={setIsDialogOpen} />}
      
      {/* Free shipping badge */}
      <div className="text-center text-xs text-gray-400 mt-2 flex items-center justify-center gap-2">
        <Sparkles className="h-3 w-3" />
        <span>Free shipping on all orders over $50</span>
      </div>
    </div>
  </div>
);

// Loader component when getting suggestion
const SpinningLoader = () => (
  <motion.div className="my-6 flex items-center justify-center h-[80px] relative">
    <motion.div
      animate={{ 
        rotate: 360,
        scale: [1, 1.1, 1]
      }}
      transition={{ 
        rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <Shuffle className="w-12 h-12 text-white opacity-80" />
    </motion.div>
    <motion.div
      className="absolute inset-0 rounded-full"
      initial={{ boxShadow: "0 0 0 0 rgba(255,255,255,0)" }}
      animate={{ boxShadow: "0 0 0 20px rgba(255,255,255,0)" }}
      transition={{ 
        repeat: Infinity,
        duration: 1.5,
        repeatType: "loop"
      }}
    />
  </motion.div>
);

// Component to display suggestion text
const SuggestionDisplay = ({ suggestion }: { suggestion: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
    className="text-base font-medium text-center my-4 bg-gradient-to-br from-white/5 to-white/15 p-5 rounded-md w-full border border-white/20 text-white shadow-inner"
  >
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="block"
    >
      {suggestion}
    </motion.span>
  </motion.div>
);

// Empty state for suggestion area
const EmptySuggestion = () => (
  <div className="h-[80px] my-4 w-full flex items-center justify-center">
    <motion.span 
      className="text-gray-500 text-sm"
      animate={{ 
        opacity: [0.5, 0.8, 0.5] 
      }}
      transition={{ 
        duration: 2, 
        repeat: Infinity,
        repeatType: "reverse" 
      }}
    >
      Click to see our suggestion
    </motion.span>
  </div>
);

// Button to get suggestion
const SuggestionButton = ({ 
  onClick, 
  isSpinning, 
  suggestion 
}: { 
  onClick: () => void; 
  isSpinning: boolean; 
  suggestion: string | null;
}) => (
  <Button
    onClick={onClick}
    className={cn(
      "w-full transition-all duration-300 text-sm h-10 rounded-md font-medium",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1",
      "relative overflow-hidden group",
      suggestion 
        ? "bg-black text-white border border-white/50 hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-black"
        : "bg-white text-black hover:bg-white/90 focus-visible:ring-black focus-visible:ring-offset-white"
    )}
    size="default"
    disabled={isSpinning}
  >
    <motion.span
      animate={{ 
        y: isSpinning ? 30 : 0,
        opacity: isSpinning ? 0 : 1 
      }}
      transition={{ duration: 0.2 }}
    >
      {suggestion ? "Try Again" : "Help Me Choose"}
    </motion.span>
    
    {!suggestion && !isSpinning && (
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 group-hover:opacity-100 opacity-0"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6 }}
      />
    )}
  </Button>
);

// Shop buttons that appear after getting a suggestion
const ShopButtons = ({ setIsDialogOpen }: { setIsDialogOpen: (isOpen: boolean) => void }) => (
  <div className="flex gap-3 w-full">
    <Button
      asChild
      variant="outline"
      className="w-1/2 h-10 border-white/20 hover:bg-white/10 text-white"
      onClick={() => setIsDialogOpen(false)}
    >
      <Link href="/collections/classic">
        Shop Classic
      </Link>
    </Button>
    
    <Button
      asChild
      variant="outline"
      className="w-1/2 h-10 border-white/20 hover:bg-white/10 text-white"
      onClick={() => setIsDialogOpen(false)}
    >
      <Link href="/collections/modern">
        Shop Modern
      </Link>
    </Button>
  </div>
);

// "Can't Decide" Badge in center of columns
const CenteredBadge = ({ 
  isHoveredCenter, 
  setIsHoveredCenter 
}: { 
  isHoveredCenter: boolean; 
  setIsHoveredCenter: (isHovered: boolean) => void;
}) => (
  <motion.div 
    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:block"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: 1 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Badge
      variant="outline"
      className={cn(
        "bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5",
        "cursor-pointer flex items-center gap-3 relative overflow-hidden",
        "hover:bg-white/20 transition-colors duration-300 shadow-lg",
        "group hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
      )}
      onMouseEnter={() => setIsHoveredCenter(true)}
      onMouseLeave={() => setIsHoveredCenter(false)}
    >
      <motion.div
        animate={{
          x: isHoveredCenter ? -3 : 0,
        }}
        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
        className="relative z-10"
      >
        <ArrowLeft className="h-4 w-4 text-white" />
      </motion.div>
      
      <span className="text-white font-medium relative z-10">Can&apos;t Decide?</span>
      
      <motion.div
        animate={{
          x: isHoveredCenter ? 3 : 0,
        }}
        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
        className="relative z-10"
      >
        <ArrowRight className="h-4 w-4 text-white" />
      </motion.div>
      
      {/* Improved glow effect animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
        initial={{ x: "-100%", opacity: 0 }}
        animate={isHoveredCenter ? 
          { x: "100%", opacity: 0.5 } : 
          { x: "-100%", opacity: 0 }
        }
        transition={{ 
          duration: 0.8, 
          ease: "easeInOut", 
          repeat: isHoveredCenter ? Infinity : 0,
          repeatDelay: 0.2
        }}
      />
    </Badge>
  </motion.div>
);

// Main Hero component
export function Hero({
  title = "Premium Hat Collection",
  subtitle = "Discover our premium hat collection crafted with exceptional quality materials and attention to detail.",
  ctaText = "Shop Now",
  ctaLink = "/collections",
  imageUrl = "/images/hats/placeholder.jpg"
}: HeroProps) {
  // State
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHoveredLeft, setIsHoveredLeft] = useState(false);
  const [isHoveredRight, setIsHoveredRight] = useState(false);
  const [isHoveredCenter, setIsHoveredCenter] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Set loaded state on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Suggestion data
  const suggestions: Suggestion[] = [
    { text: "Go with Classic Style - Timeless elegance never goes out of fashion!", probability: 0.3 },
    { text: "Modern Edge is calling your name! Be bold and stand out!", probability: 0.3 },
    { text: "Based on your style, Classic would look amazing on you!", probability: 0.1 },
    { text: "Modern Edge will complement your wardrobe perfectly!", probability: 0.1 },
    { text: "Why not try both? Start with Classic and come back for Modern!", probability: 0.1 },
    { text: "Modern Edge is trending right now - be ahead of the curve!", probability: 0.1 }
  ];

  // Get a random suggestion with weighted probability
  const getRandomSuggestion = () => {
    setIsSpinning(true);
    setSuggestion(null);
    
    // Create weighted random selection
    const total = suggestions.reduce((sum, item) => sum + item.probability, 0);
    let random = Math.random() * total;
    
    let selected = suggestions[0].text;
    for (const item of suggestions) {
      random -= item.probability;
      if (random <= 0) {
        selected = item.text;
        break;
      }
    }

    // Simulate "spinning" effect with timing
    setTimeout(() => {
      setSuggestion(selected);
      setIsSpinning(false);
    }, 1800);
  };

  return (
    <section className="w-full relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-pattern opacity-5 dark:opacity-[0.03] z-0"></div>
      
      {/* Two Columns Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 w-full relative">
        {/* Left Column - OPTION A */}
        <OptionColumn
          title="Classic Style"
          subtitle="Timeless elegance meets contemporary comfort in our classic collection."
          optionLabel="OPTION A"
          imageSrc="/images/hats/placeholder.jpg"
          ctaHref="/collections/classic"
          isHovered={isHoveredLeft}
          setIsHovered={setIsHoveredLeft}
          fadeInDelay={0.2}
          discount="20% OFF"
          tag="Best Seller"
        />
        
        {/* Right Column - OPTION B */}
        <OptionColumn
          title="Modern Edge"
          subtitle="Bold designs and cutting-edge style for those who dare to stand out."
          optionLabel="OPTION B"
          imageSrc="/images/hats/placeholder.jpg"
          ctaHref="/collections/modern"
          isHovered={isHoveredRight}
          setIsHovered={setIsHoveredRight}
          fadeInDelay={0.4}
          tag="New Arrival"
        />
        
        {/* Central "Can't Decide?" badge */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <CenteredBadge 
              isHoveredCenter={isHoveredCenter} 
              setIsHoveredCenter={setIsHoveredCenter} 
            />
          </DialogTrigger>
          
          {/* Dialog content */}
          <DialogContent className="sm:max-w-md border border-white/10 bg-black/95 p-0 backdrop-blur-md shadow-xl rounded-lg overflow-hidden">
            <DialogHeader className="relative p-6 pb-4 border-b border-white/10">
              <DialogTitle className="text-xl font-semibold text-center mb-1 text-white">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  Choose Your Style
                </motion.div>
              </DialogTitle>
              <DialogDescription className="text-center text-sm text-gray-400">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  Let us help you find your perfect match
                </motion.div>
              </DialogDescription>
              <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4 text-gray-500 hover:text-white" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogHeader>
            
            <SuggestionDialog 
              isSpinning={isSpinning}
              suggestion={suggestion}
              getRandomSuggestion={getRandomSuggestion}
              setIsDialogOpen={setIsDialogOpen}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* SignupCarousel */}
      <SignupCarousel />
    </section>
  );
}

export default Hero; 