"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TruckIcon, 
  ShieldCheck, 
  Gem, 
  Recycle, 
  Award, 
  Heart 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValueProp {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

const valueProps: ValueProp[] = [
  {
    icon: TruckIcon,
    title: 'Free Shipping',
    description: 'Free shipping on all US orders above $50. International shipping available.',
    color: 'bg-blue-500/10 text-blue-500'
  },
  {
    icon: ShieldCheck,
    title: 'Quality Guaranteed',
    description: 'Our hats are crafted with premium materials built to last for years.',
    color: 'bg-emerald-500/10 text-emerald-500'
  },
  {
    icon: Gem,
    title: 'Premium Materials',
    description: 'From premium cottons to sustainable wool, we use only the finest materials.',
    color: 'bg-purple-500/10 text-purple-500'
  },
  {
    icon: Recycle,
    title: 'Sustainable',
    description: 'Eco-friendly production and materials with reduced environmental impact.',
    color: 'bg-green-500/10 text-green-500'
  },
  {
    icon: Award,
    title: '5-Star Rated',
    description: 'Join thousands of satisfied customers who love our products.',
    color: 'bg-yellow-500/10 text-yellow-500'
  },
  {
    icon: Heart,
    title: 'Handcrafted',
    description: 'Attention to detail with master craftsmanship in every stitch.',
    color: 'bg-red-500/10 text-red-500'
  }
];

interface ValuePropositionProps {
  className?: string;
}

export function ValueProposition({ className }: ValuePropositionProps) {
  return (
    <section className={cn("py-16 bg-black relative overflow-hidden", className)}>
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid-white/5 opacity-5" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            Why Choose <span className="text-white relative z-10">
              <span className="relative">
                NoCapLLC
                <span className="absolute -bottom-1 left-0 right-0 h-[0.2em] bg-white/20"></span>
              </span>
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-zinc-400 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            We&apos;re passionate about quality headwear that combines style, comfort, and sustainability.
          </motion.p>
        </div>
        
        {/* Value proposition grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {valueProps.map((prop, index) => (
            <motion.div
              key={prop.title}
              className="bg-gradient-to-b from-zinc-900 to-black p-6 sm:p-8 rounded-lg border border-zinc-800 flex flex-col h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.5, 
                delay: 0.1 + (index * 0.1),
                ease: [0.22, 1, 0.36, 1]
              }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                borderColor: "rgba(255, 255, 255, 0.2)"
              }}
              transition={{
                duration: 0.5, 
                delay: 0.1 + (index * 0.1),
                ease: [0.22, 1, 0.36, 1],
                y: { type: "spring", stiffness: 300, damping: 20 },
                boxShadow: { duration: 0.2 },
                borderColor: { duration: 0.2 }
              }}
            >
              <div className={cn(
                "w-12 h-12 rounded-md flex items-center justify-center mb-4",
                prop.color
              )}>
                <prop.icon size={22} strokeWidth={2} />
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">
                {prop.title}
              </h3>
              
              <p className="text-zinc-400 flex-grow text-sm">
                {prop.description}
              </p>
            </motion.div>
          ))}
        </div>
        
        {/* Bottom flourish/divider */}
        <div className="flex justify-center mt-16">
          <div className="h-[3px] w-24 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
        </div>
      </div>
    </section>
  );
}

export default ValueProposition; 