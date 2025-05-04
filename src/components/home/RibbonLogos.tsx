"use client";

import { motion } from "framer-motion";
import { CircleDollarSign, Crown, Diamond, GraduationCap, Hash, ShieldCheck, Star, Trophy, Zap } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const RibbonLogos = () => {
  return (
    <section className="bg-black py-12 w-full overflow-hidden">
      <h2 className="mx-4 mb-8 text-center text-2xl font-bold text-white md:text-4xl uppercase tracking-wider">
        Join the NoCAP Club
      </h2>
      <div className="flex translate-y-[50%] rotate-[7deg] scale-110 overflow-hidden border-y-2 border-white/30 bg-black">
        <TranslateWrapper>
          <LogoItemsTop />
        </TranslateWrapper>
        <TranslateWrapper>
          <LogoItemsTop />
        </TranslateWrapper>
        <TranslateWrapper>
          <LogoItemsTop />
        </TranslateWrapper>
      </div>
      <div className="flex -translate-y-[50%] -rotate-[7deg] scale-110 overflow-hidden border-y-2 border-white/30 bg-black">
        <TranslateWrapper reverse>
          <LogoItemsBottom />
        </TranslateWrapper>
        <TranslateWrapper reverse>
          <LogoItemsBottom />
        </TranslateWrapper>
        <TranslateWrapper reverse>
          <LogoItemsBottom />
        </TranslateWrapper>
      </div>
      
      {/* JOIN CLUB button */}
      <div className="flex justify-center mt-8">
        <Link href="/membership">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-white bg-black text-white hover:bg-white hover:text-black min-w-32 font-medium"
          >
            JOIN CLUB
          </Button>
        </Link>
      </div>
    </section>
  );
};

const TranslateWrapper = ({
  children,
  reverse,
}: {
  children: JSX.Element;
  reverse?: boolean;
}) => {
  return (
    <motion.div
      initial={{ translateX: reverse ? "-100%" : "0%" }}
      animate={{ translateX: reverse ? "0%" : "-100%" }}
      transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      className="flex px-2"
    >
      {children}
    </motion.div>
  );
};

const LogoItem = ({ Icon, text }: { Icon: LucideIcon; text: string }) => {
  return (
    <div className="flex items-center justify-center gap-4 px-6 py-4 text-white transition-colors hover:bg-white/5 md:py-6">
      <Icon className="text-3xl w-6 h-6 md:w-8 md:h-8 text-white/80" />
      <span className="whitespace-nowrap text-xl font-semibold uppercase md:text-2xl">
        {text}
      </span>
    </div>
  );
};

const LogoItemsTop = () => (
  <>
    <LogoItem Icon={Star} text="Premium Quality" />
    <LogoItem Icon={Crown} text="Exclusive Designs" />
    <LogoItem Icon={Zap} text="Fast Shipping" />
    <LogoItem Icon={Trophy} text="Award Winning" />
    <LogoItem Icon={Hash} text="NoCAP" />
  </>
);

const LogoItemsBottom = () => (
  <>
    <LogoItem Icon={Diamond} text="Luxury" />
    <LogoItem Icon={ShieldCheck} text="Authentic" />
    <LogoItem Icon={CircleDollarSign} text="Best Value" />
    <LogoItem Icon={GraduationCap} text="Expert Crafted" />
    <LogoItem Icon={Star} text="5-Star Rated" />
  </>
);

export default RibbonLogos; 